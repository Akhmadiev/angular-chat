import { Component } from '@angular/core';
import { ChatService } from './chat.service';
import { ImageUploadService } from './image-upload.service';
import { NotificationsService } from 'angular2-notifications';
import { FormGroup, FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    user: string;

    room: string;

    messageArray: Array<{ user: string, userTo: string, message: string }> = [];

    users: Array<string> = [];

    myControl = new FormControl();

    filteredOptions: Observable<string[]>;

    private notifier: NotificationsService;

    rooms: string[] = [
        'Room1',
        'Room2',
        'Room3'
    ];

    constructor(private chatService: ChatService, private imageService: ImageUploadService, notifier: NotificationsService) {
        this.notifier = notifier;

        this.chatService.newUserJoined()
            .subscribe(x => {
                this.messageArray.push(x);
                this.users = x.users;
            });

        this.chatService.newMessageReceived()
            .subscribe(x => {
                if (x.userTo == null || x.userTo === this.user || x.user === this.user) {
                    if (x.user !== this.user) {
                        this.notifier.info(x.user + '<br>sent a message');
                    }
                    this.messageArray.push(x);
                }
            });
    }

    join(user, room) {
        this.user = user;
        this.room = room;
        this.chatService.joinRoom({user, room});
    }

    leave() {
        this.chatService.leaveRoom({user: this.user, room: this.room});
    }

    sendMessage(message) {
        let userTo = null;
        if (message.startsWith('@')) {
            const messageSplit = message.split(' ');
            userTo = messageSplit[0].substring(1, messageSplit[0].length);
        }
        this.chatService.sendMessage({user: this.user, userTo, room: this.room, message});
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
