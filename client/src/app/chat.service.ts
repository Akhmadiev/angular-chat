import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

export class ChatService {
    private url = 'http://localhost:3000';
    private socket;

    constructor() {
        this.socket = io(this.url);
    }

    public joinRoom(data) {
        this.socket.emit('join',data);
    }

    newUserJoined() {
        let observable = new Observable<{user: String, users: Array<String>, userTo: String, message:String}>(observer=>{
            this.socket.on('new user joined', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });

        return observable;
    }

    leaveRoom(data){
        this.socket.emit('leave', data);
    }

    userLeftRoom(){
        let observable = new Observable<{user:String, message:String}>(observer=>{
            this.socket.on('left room', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });

        return observable;
    }

    sendMessage(data) {
        this.socket.emit('message', data);
    }

    newMessageReceived() {
        let observable = new Observable<{user:String, userTo: String, message:String}>(observer=>{
            this.socket.on('new message', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });

        return observable;
    }

    public getMessages = () => {
        return Observable.create((observer) => {
            this.socket.on('message', (message) => {
                observer.next(message);
            });
        });
    }
}