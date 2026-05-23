#include<stdio.h>
#include<stdlib.h>

struct node {
    int data;
    struct node *link;
};

void add_at_end(struct node *head, int value) {
    struct node *ptr, *temp;
    ptr = head;
    temp = malloc(sizeof(struct node));
    temp->data = value;
    temp->link = NULL;
    while (ptr->link != NULL) {
        ptr = ptr->link;
    }
    ptr->link = temp;
}

void add_at_beg(struct node **head, int value) {
    struct node *ptr;
    ptr = malloc(sizeof(struct node));
    ptr->data = value;
    ptr->link = *head;
    *head = ptr;
}

void add_at_pos(struct node *head, int value, int pos) {
    struct node *ptr, *temp;
    ptr = head;
    temp = malloc(sizeof(struct node));
    temp->data = value;
    pos--;
    while (pos != 1) {
        ptr = ptr->link;
        pos--;
    }
    temp->link = ptr->link;
    ptr->link = temp;
}

void print(struct node *head) {
    struct node *ptr;
    ptr = head;
    printf("The nodes are ");
    while (ptr != NULL) {
        printf("\t%d", ptr->data);
        ptr = ptr->link;
    }
}

void del_first(struct node **head) {
    struct node *temp;
    temp = *head;
    *head = (*head)->link;
    free(temp);
    temp = NULL;
}

void del_last(struct node *head) {
    struct node *temp;
    temp = head;
    while (temp->link->link != NULL) {
        temp = temp->link;
    }
    free(temp->link);
    temp->link = NULL;
}

void del_pos(struct node **head, int pos) {
    struct node *current, *previous;
    current = *head;
    previous = *head;
    while (pos != 1) {
        previous = current;
        current = current->link;
        pos--;
    }
    previous->link = current->link;
    free(current);
    current = NULL;
}

void count(struct node *head) {
    int count = 0;
    struct node *ptr;
    ptr = head;
    while (ptr != NULL) {
        count++;
        ptr = ptr->link;
    }
    printf("\nTotal nodes: %d", count);
}

int main() {
    int choice, num, numb;
    struct node *head;
    head = NULL;
    head = malloc(sizeof(struct node));
    head->data = 10;
    head->link = NULL;

    do {
        printf("\n1.Add node at the end\n2.Print the values\n3.Count the nodes\n4.Add node at the beginning\n5.Add node at some position\n6.Delete the first node\n7.Delete the last node\n8.Delete at some position\n9.Exit\n");
        printf("Enter the option:");
        scanf("%d", &choice);
        switch (choice) {
            case 1:
                printf("Enter the value to be added at End:");
                scanf("%d", &num);
                add_at_end(head, num);
                break;
            case 2:
                print(head);
                break;
            case 3:
                count(head);
                break;
            case 4:
                printf("Enter the value to be added at Beginning:");
                scanf("%d", &numb);
                add_at_beg(&head, numb);
                break;
            case 5:
                printf("Enter the position:");
                scanf("%d", &numb);
                printf("Enter the value:");
                scanf("%d", &num);
                add_at_pos(head, num, numb);
                break;
            case 6:
                del_first(&head);
                break;
            case 7:
                del_last(head);
                break;
            case 8:
                printf("Enter the position:");
                scanf("%d", &numb);
                del_pos(&head, numb);
                break;
            case 9:
                return 0;
            default:
                printf("Enter the valid option");
                break;
        }
    } while (choice != 9);
    return 0;
}