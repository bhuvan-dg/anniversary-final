from ultralytics import YOLO
import time
import streamlit as st
import cv2
import settings
import threading
import serial  # Added serial library

# --- Arduino Setup ---
try:
    if 'arduino' not in st.session_state:
        # Change 'COM3' to your actual Arduino port
        st.session_state.arduino = serial.Serial('COM16', 9600, timeout=1)
        time.sleep(2) # Wait for Arduino to initialize
except Exception as e:
    st.sidebar.error(f"Arduino not connected: {e}")

def sleep_and_clear_success():
    time.sleep(3)
    # Check if the keys actually exist before trying to use them
    if 'recyclable_placeholder' in st.session_state:
        st.session_state['recyclable_placeholder'].empty()
    if 'non_recyclable_placeholder' in st.session_state:
        st.session_state['non_recyclable_placeholder'].empty()
    if 'hazardous_placeholder' in st.session_state:
        st.session_state['hazardous_placeholder'].empty()
def load_model(model_path):
    model = YOLO(model_path)
    return model

def classify_waste_type(detected_items):
    recyclable_items = set(detected_items) & set(settings.RECYCLABLE)
    non_recyclable_items = set(detected_items) & set(settings.NON_RECYCLABLE)
    hazardous_items = set(detected_items) & set(settings.HAZARDOUS)
    
    return recyclable_items, non_recyclable_items, hazardous_items

def remove_dash_from_class_name(class_name):
    return class_name.replace("_", " ")

def _display_detected_frames(model, st_frame, image):
    image = cv2.resize(image, (640, int(640*(9/16))))
    
    if 'unique_classes' not in st.session_state:
        st.session_state['unique_classes'] = set()

    if 'recyclable_placeholder' not in st.session_state:
        st.session_state['recyclable_placeholder'] = st.sidebar.empty()
    if 'non_recyclable_placeholder' not in st.session_state:
        st.session_state['non_recyclable_placeholder'] = st.sidebar.empty()
    if 'hazardous_placeholder' not in st.session_state:
        st.session_state['hazardous_placeholder'] = st.sidebar.empty()

    if 'last_detection_time' not in st.session_state:
        st.session_state['last_detection_time'] = 0

    res = model.predict(image, conf=0.6)
    names = model.names
    detected_items = set()

    for result in res:
        new_classes = set([names[int(c)] for c in result.boxes.cls])
        
        # Only trigger if the detection is new and enough time has passed (cooldown)
        if new_classes != st.session_state['unique_classes'] and (time.time() - st.session_state['last_detection_time'] > 11.5):
            st.session_state['unique_classes'] = new_classes
            st.session_state['recyclable_placeholder'].markdown('')
            st.session_state['non_recyclable_placeholder'].markdown('')
            st.session_state['hazardous_placeholder'].markdown('')
            detected_items.update(st.session_state['unique_classes'])

            recyclable_items, non_recyclable_items, hazardous_items = classify_waste_type(detected_items)

            # --- ARDUINO LOGIC START ---
            # --- ARDUINO LOGIC START ---
            if hasattr(st.session_state, 'arduino'):
                if recyclable_items:
                    print(f"MATCH: {recyclable_items} -> Trying to pass B")
                    st.session_state.arduino.write(b'B') 
                
                elif non_recyclable_items or hazardous_items:
                    print(f"MATCH: {non_recyclable_items} -> Trying to pass N")
                    st.session_state.arduino.write(b'N')
            else:
                print("CRITICAL: Arduino object not found in session_state!")
            # --- ARDUINO LOGIC END ---

            # --- ARDUINO LOGIC END ---

            if recyclable_items:
                detected_items_str = "\n- ".join(remove_dash_from_class_name(item) for item in recyclable_items)
                st.session_state['recyclable_placeholder'].markdown(
                    f"<div class='stRecyclable'>Recyclable items:\n\n- {detected_items_str}</div>",
                    unsafe_allow_html=True
                )
            if non_recyclable_items:
                detected_items_str = "\n- ".join(remove_dash_from_class_name(item) for item in non_recyclable_items)
                st.session_state['non_recyclable_placeholder'].markdown(
                    f"<div class='stNonRecyclable'>Non-Recyclable items:\n\n- {detected_items_str}</div>",
                    unsafe_allow_html=True
                )
            if hazardous_items:
                detected_items_str = "\n- ".join(remove_dash_from_class_name(item) for item in hazardous_items)
                st.session_state['hazardous_placeholder'].markdown(
                    f"<div class='stHazardous'>Hazardous items:\n\n- {detected_items_str}</div>",
                    unsafe_allow_html=True
                )

            threading.Thread(target=sleep_and_clear_success).start()
            st.session_state['last_detection_time'] = time.time()

    res_plotted = res[0].plot()
    st_frame.image(res_plotted, channels="BGR")


def play_webcam(model):
    source_webcam = settings.WEBCAM_PATH
    if st.button('Detect Objects'):
        try:
            vid_cap = cv2.VideoCapture(source_webcam)
            st_frame = st.empty()
            while (vid_cap.isOpened()):
                success, image = vid_cap.read()
                if success:
                    _display_detected_frames(model,st_frame,image)
                else:
                    vid_cap.release()
                    break
        except Exception as e:
            st.sidebar.error("Error loading video: " + str(e))