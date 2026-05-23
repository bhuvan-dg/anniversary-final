const welcomeTexts = [
  { main: "Our Memory Lane", sub: "A special place for our story." },
  { main: "To Beautiful Memories", sub: "Every special moment kept right here." },
  { main: "For You and Me", sub: "Thank you for being part of my life." }
];

let textIndex = 0;
const mainTextElement = document.getElementById("typingText");
const subTextElement = document.getElementById("subText");
const audio = document.getElementById("myAudio");
const playIcon = document.getElementById("mainPlayIcon");
const songTitle = document.getElementById("currentSongTitle");
const playerContainer = document.querySelector(".music-floater");

let currentPlayingKey = null;

const songs = {
  music1: { url: "../music1.mpeg", title: "Yaar indha Saalai Oram" },
  music2: { url: "../music2.mpeg", title: "Pookal Pookum tharnam" }
};

function changeText() {
  mainTextElement.style.opacity = 0;
  subTextElement.style.opacity = 0;

  setTimeout(() => {
    textIndex = (textIndex + 1) % welcomeTexts.length;
    mainTextElement.innerText = welcomeTexts[textIndex].main;
    subTextElement.innerText = welcomeTexts[textIndex].sub;

    mainTextElement.style.opacity = 1;
    subTextElement.style.opacity = 1;
  }, 500);
}

let textInterval = setInterval(changeText, 3000);

function enterWebsite() {
  clearInterval(textInterval);

  const welcome = document.getElementById("welcomeScreen");
  const main = document.getElementById("mainContent");

  welcome.style.opacity = "0";
  setTimeout(() => {
    welcome.style.display = "none";
    main.classList.add("show-content");

    // Set music1 as the default and start from 50 seconds
    currentPlayingKey = 'music1';
    audio.src = songs.music1.url;
    audio.volume = 0.5;
    audio.currentTime = 50; // Start from 50 seconds
    audio.play().catch(error => {
      console.log("Autoplay blocked:", error);
    });

    // Update player UI to show music1 is playing
    const playerBar = document.getElementById("playerBar");
    playerBar.classList.add("show-player");
    updatePlayerUI(true, songs.music1.title);
    updateListIcon('music1', true);
  }, 800);
}

const anniversaryDate = new Date("2025-05-26T00:00:00").getTime();

function updateTimer() {
  const now = new Date().getTime();
  const distance = now - anniversaryDate;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerText = days < 10 ? "0" + days : days;
  document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
  document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
  document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;
}
updateTimer(); // Call once immediately
setInterval(updateTimer, 1000);

window.addEventListener("scroll", reveal);
function reveal() {
  const reveals = document.querySelectorAll(".reveal");
  for (let i = 0; i < reveals.length; i++) {
    const windowHeight = window.innerHeight;
    const elementTop = reveals[i].getBoundingClientRect().top;
    const elementVisible = 100;
    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    }
  }
}

function playSong(key) {
  const song = songs[key];
  const playerBar = document.getElementById("playerBar");

  if (currentPlayingKey === key) {
    if (audio.paused) {
      audio.play();
      playerBar.classList.add("show-player");
      updatePlayerUI(true, song.title);
      updateListIcon(key, true);
    } else {
      audio.pause();
      playerBar.classList.remove("show-player");
      updatePlayerUI(false, song.title);
      updateListIcon(key, false);
    }
  } else {
    currentPlayingKey = key;
    audio.src = song.url;
    audio.volume = 1.0;
    audio.play();

    playerBar.classList.add("show-player");
    updatePlayerUI(true, song.title);

    resetAllListIcons();
    updateListIcon(key, true);

    const activeTrack = document.getElementById(`track-${key}`);
    if (activeTrack) activeTrack.classList.add('playing');
  }
}

function toggleMusic() {
  if (!currentPlayingKey) return;

  const playerBar = document.getElementById("playerBar");

  if (audio.paused) {
    audio.play();
    playerBar.classList.add("show-player");
    updatePlayerUI(true);
    updateListIcon(currentPlayingKey, true);
  } else {
    audio.pause();
    playerBar.classList.remove("show-player");
    updatePlayerUI(false);
    updateListIcon(currentPlayingKey, false);
  }
}

function updateListIcon(key, isPlaying) {
  const trackItem = document.getElementById(`track-${key}`);
  if (trackItem) {
    const icon = trackItem.querySelector('.track-icon i');
    if (isPlaying) {
      icon.classList.remove('fa-play');
      icon.classList.add('fa-pause');
    } else {
      icon.classList.remove('fa-pause');
      icon.classList.add('fa-play');
    }
  }
}

function resetAllListIcons() {
  document.querySelectorAll('.track-item').forEach(item => {
    item.classList.remove('playing');
    const icon = item.querySelector('.track-icon i');
    icon.classList.remove('fa-pause');
    icon.classList.add('fa-play');
  });
}

function updatePlayerUI(isPlaying, title = null) {
  if (title) songTitle.innerText = title;

  if (isPlaying) {
    playIcon.classList.remove("fa-play");
    playIcon.classList.add("fa-pause");
    playerContainer.classList.add("music-playing");
  } else {
    playIcon.classList.remove("fa-pause");
    playIcon.classList.add("fa-play");
    playerContainer.classList.remove("music-playing");
  }
}

function createHeartShower() {
  const container = document.body;
  const colors = ["#ec4899", "#8b5cf6", "#d946ef", "#a855f7"];

  for (let i = 0; i < 30; i++) {
    const heart = document.createElement("div");
    heart.classList.add("floating-flower");

    heart.innerHTML = '<i class="fas fa-heart"></i>';

    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    heart.style.color = randomColor;

    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (Math.random() * 20 + 15) + "px";
    heart.style.animationDuration = (Math.random() * 3 + 3) + "s";
    heart.style.animationDelay = Math.random() + "s";

    container.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 6000);
  }

  if (navigator.vibrate) {
    navigator.vibrate(100);
  }
}

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}