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
    user: String;
    
    room: String;
    
    messageArray: Array<{ user: String, userTo: String, message: String }> = [];

    users: Array<String> = [];

    myControl = new FormControl();

    filteredOptions: Observable<String[]>;

    private notifier: NotificationsService;
    
    rooms: String[] = [
        "Room1",
        "Room2",
        "Room3"
    ];

    constructor(private _chatService:ChatService, private _imageService: ImageUploadService, notifier: NotificationsService) {
        this.notifier = notifier;

        this._chatService.newUserJoined()
            .subscribe(x => {
                this.messageArray.push(x);
                this.users = x.users;
            });

        this._chatService.newMessageReceived()
            .subscribe(x => {
                if (x.userTo == null || x.userTo == this.user || x.user == this.user) {
                    if (x.user != this.user) {
                        this.notifier.info(x.user + "<br>sent a message");
                    }
                    this.messageArray.push(x)
                }
            });
    }

    join(user, room) {
        this._chatService.leaveRoom({user: user, room: this.room});

        this.user = user;
        this.room = room;
        this._chatService.joinRoom({user: user, room: room});
    }

    leave(){
        this._chatService.leaveRoom({user:this.user, room:this.room});
    }

    sendMessage(message) {
        var userTo = null;
        if (message.startsWith("@")){
            var messageSplit = message.split(" ");
            userTo = messageSplit[0].substring(1, messageSplit[0].length);
        }
        this._chatService.sendMessage({user: this.user, userTo: userTo, room: this.room, message: message});
    }

    ngOnInit() {
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      }
    
      private _filter(value: string): String[] {
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