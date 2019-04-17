import { Component } from '@angular/core';
import { ChatService } from './chat.service';
import { NotificationsService } from 'angular2-notifications';
import { FormControl } from '@angular/forms';
import { PushNotificationsService } from './push-notification.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    user: string;
    uploadedFile: File;
    room: string;
    htmlUrl: string;

    messageArray: Array<{ user: string, private: boolean, message: string }> = [];

    users: Array<any> = [];

    myControl = new FormControl();

    rooms: string[] = [
        'Room1',
        'Room2',
        'Room3'
    ];

    readonly rootURL = 'http://localhost:3000';

    constructor(
        private chatService: ChatService,
        private notifier: NotificationsService,
        private notificationService: PushNotificationsService,
        private http: HttpClient) {

        this.chatService.newUserJoined()
            .subscribe(x => {
                this.messageArray.push(x);
                this.users = x.users;
            });

        this.chatService.newMessageReceived()
            .subscribe(x => {
                if (this.user !== x.user) {
                    this.notifier.info(x.user + '<br>sent a message');
                    this.notify(x.user, x.message);
                }
                this.messageArray.push(x);
            });
    }

    join(user, room) {
        this.notificationService.requestPermission();

        this.user = user;
        this.room = room;
        this.chatService.joinRoom({user, room});
    }

    leave() {
        this.chatService.leaveRoom({user: this.user, room: this.room});
    }

    sendMessage(message) {
        if (message.startsWith('@')) {
            const messageSplit = message.split(' ');
            const userTo = messageSplit[0].substring(1, messageSplit[0].length);
            const socketId = this.users.filter(x => x.user === userTo)[0].socketId;
            console.log(`user: ${this.user}; userTo: ${userTo}; userToSocket: ${socketId}; message: ${message}`);

            const newMessage = { user: this.user, message, private: true };
            this.messageArray.push(newMessage);
            this.chatService.sendPrivateMessage({user: this.user, socketId, userTo, message});
        } else {
            this.chatService.sendMessage({user: this.user, room: this.room, message});
        }
    }

    notify(user, message) {
        const data: Array <any> = [];

        data.push({
            title: user,
            alertContent: message
        });

        this.notificationService.generateNotification(data);
    }

     fileChange(element) {
        this.uploadedFile = element.target.files[0];
      }

      uploadImage() {
        const formData = new FormData();
        formData.append('file', this.uploadedFile, this.uploadedFile.name);

        this.http.post(this.rootURL + '/upload', formData, {responseType: 'text'})
        .subscribe(
            res => {
                this.chatService.sendMessage({user: this.user, isFile: true, room: this.room, message: this.uploadedFile.name});
                console.log(res);
            },
            err => {
              console.log(err);
            }
          );
      }

      download(fileName) {
        window.open(this.rootURL + '/download?fileName=' + fileName);
      }
}
