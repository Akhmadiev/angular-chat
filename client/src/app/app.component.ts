import { Component } from '@angular/core';
import { ChatService } from './chat.service';
import { ImageUploadService } from './image-upload.service';
import { NotificationsService } from 'angular2-notifications';
import { FormGroup, FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
// import { SwPush } from '@angular/service-worker';
// import { NewsletterService } from './newsletter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    user: string;

    room: string;

    messageArray: Array<{ user: string, private: boolean, message: string }> = [];

    users: Array<any> = [];

    myControl = new FormControl();

    filteredOptions: Observable<string[]>;

    rooms: string[] = [
        'Room1',
        'Room2',
        'Room3'
    ];

    publicKey: 'BOha2zpOQfGcxihY6zK51U0KrIf6akrXBndn-NHodHHnjwoAh0cNuJzx_dS11RPhdUGm238D8VGB1103U-_0mlU';

    privateKey: 'l4rK1VJXiZCE_Tzo1qCPr8nXiG_7MxteIzJJSFj4jhg';

    constructor(
        private chatService: ChatService,
        private imageService: ImageUploadService,
        private notifier: NotificationsService,
        ) {
        this.notifier = notifier;

        this.chatService.newUserJoined()
            .subscribe(x => {
                this.messageArray.push(x);
                this.users = x.users;
            });

        this.chatService.newMessageReceived()
            .subscribe(x => {
                if (this.user !== x.user) {
                    this.notifier.info(x.user + '<br>sent a message');
                }
                this.messageArray.push(x);
            });
    }

    // subscribeToNotifications() {

    //     this.swPush.requestSubscription({
    //         serverPublicKey: this.publicKey
    //     })
    //     .then(sub => this.newsletterService.addPushSubscriber(sub).subscribe())
    //     .catch(err => console.error('Could not subscribe to notifications', err));
    // }

    join(user, room) {
        this.user = user;
        this.room = room;
        this.chatService.joinRoom({user, room});
    }

    leave() {
        this.chatService.leaveRoom({user: this.user, room: this.room});
    }

    // subscribeToNotifications() {

    //     this.swPush.requestSubscription({
    //         serverPublicKey: this.VAPID_PUBLIC_KEY
    //     })
    //     .then(sub => this.newsletterService.addPushSubscriber(sub).subscribe())
    //     .catch(err => console.error("Could not subscribe to notifications", err));
    // }

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

    NgOnInit() {
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      }

      private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.users.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
      }

    // processFile(imageInput: any) {
    //     const file: File = imageInput.files[0];
    //     const reader = new FileReader();

    //     reader.addEventListener('load', (event: any) => {

    //       this.selectedFile = new ImageSnippet(event.target.result, file);

    //       this._imageService.uploadImage(this.selectedFile.file).subscribe(
    //         (res) => {

    //         },
    //         (err) => {

    //         })
    //     });

    //     reader.readAsDataURL(file);
    // }

    // uploadImage() {
    //     if (this.selectedFile) {
    //       const reader = new FileReader();

    //       reader.addEventListener('load', (event: any) => {
    //         this.selectedFile.src = event.target.result;

    //         this._imageService.uploadImage(this.selectedFile.file).subscribe(
    //             (res) => {

    //             },
    //             (err) => {

    //             })
    //       });

    //     reader.readAsDataURL(this.selectedFile.file);
    //     }
    // }
}
