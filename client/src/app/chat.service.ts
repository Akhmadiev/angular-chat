import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

export class ChatService {
    private url = 'http://localhost:3000';
    private socket;

    constructor() {
        this.socket = io(this.url);
    }

    public joinRoom(data) {
        this.socket.emit('join', data);
    }

    newUserJoined() {
        const observable = new Observable<{user: string,
            socketId: string,
            users: Array<string>,
            userTo: string,
            message: string}>
            (observer => {
            this.socket.on('new user joined', (data) => {
                observer.next(data);
            });
            return () => { this.socket.disconnect(); };
        });

        return observable;
    }

    leaveRoom(data) {
        this.socket.emit('leave', data);
    }

    userLeftRoom() {
        const observable = new Observable<{user: string, message: string}>(observer => {
            this.socket.on('left room', (data) => {
                observer.next(data);
            });
            return () => {this.socket.disconnect(); };
        });

        return observable;
    }

    sendMessage(data) {
        this.socket.emit('message', data);
    }

    newMessageReceived() {
        const observable = new Observable<{user: string, userTo: string, message: string}>(observer => {
            this.socket.on('new message', (data) => {
                observer.next(data);
            });
            return () => {this.socket.disconnect(); };
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
