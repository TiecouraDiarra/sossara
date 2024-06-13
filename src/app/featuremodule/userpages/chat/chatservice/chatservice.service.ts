import { Injectable } from '@angular/core';
import { ChatMessage } from '../model/chat-message';
import * as SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from 'src/app/service/auth/storage.service';
import { environment } from 'src/app/environments/environment';

const URL_BASE: string = environment.Url_BASE;

@Injectable({
  providedIn: 'root'
})
export class ChatserviceService {


  private stompClient: any
  private messageSubject: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);

  constructor(private httpClient: HttpClient, private storageService: StorageService) {
    this.initConnenctionSocket();
  }

  // Méthode pour ajouter le token JWT aux en-têtes
  getHeaders(): HttpHeaders {
    const token = this.storageService.getUser().token;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  initConnenctionSocket() {
    const url = '//localhost:8080/chat-socket';
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket)
  }

  joinRoom(roomId: string) {
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe(`/topic/${roomId}`, (messages: any) => {
        const messageContent = JSON.parse(messages.body);
        const currentMessage = this.messageSubject.getValue();
        currentMessage.push(messageContent);

        this.messageSubject.next(currentMessage);

      })
    })
    this.loadMessage(roomId);
  }

  sendMessage(roomId: string, chatMessage: ChatMessage) {
    this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatMessage))
  }

  getMessageSubject() {
    return this.messageSubject.asObservable();
  }

  loadMessage(roomId: string): void {
    this.httpClient.get<any[]>(`http://localhost:8080/api/chat/${roomId}`).pipe(
      map(result => {
        return result.map(res => {
          return {
            senderEmail: res.senderEmail,
            senderNom: res.senderNom,
            message: res.message
          } as ChatMessage
        })
      })
    ).subscribe({
      next: (chatMessage: ChatMessage[]) => {
        this.messageSubject.next(chatMessage);
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

   //AFFICHER LA LISTE DES CHATS EN FONCTION DE USER CONNECTE
   AfficherChatUserConnecte(): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${URL_BASE}/chat/message/afficherchat`, { headers });
  }

  getChatByUuid(uuid: string): Observable<any> {
    return this.httpClient.get<any>(`${URL_BASE}/chat/message/chat/${uuid}`);
  }
}
