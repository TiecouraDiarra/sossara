import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { StorageService } from '../auth/storage.service';
import { Observable } from 'rxjs';
import { Message } from 'src/app/featuremodule/userpages/message/models/message';
import { Chat } from 'src/app/featuremodule/userpages/message/models/chat';

const URL_BASE: string = environment.Url_BASE;

@Injectable({
  providedIn: 'root'
})



export class MessageService {

  private accessToken!: string; // Ajoutez cette ligne


  setAccessToken(token: string) {
    this.accessToken = token;
  }
   // Méthode pour ajouter le token JWT aux en-têtes
   getHeaders(): HttpHeaders {
    const token = this.storageService.getUser().token;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  constructor(private storageService: StorageService,
    private http: HttpClient, private httpClient: HttpClient) { }

    //AFFICHER LA LISTE DES CONVERSATIONS EN FONCTION DE USER
  AfficherLaListeConversation():Observable<any>{
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}/conversation/get/`, { headers });
  }

  //AFFICHER UNE CONVERSATION 
  AfficherUneConversation(id: number):Observable<any>{
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}/message/${id}`, { headers });
  }

  //ENVOYER UN MESSAGE
  EnvoyerMessage(content: any, id: any): Observable<any> {
    const headers = this.getHeaders();
    // const data = new FormData();

    return this.http.post(`${URL_BASE}/message/new/${id}`, {
      content
    }, { headers });
  }




  updateChat(message: Message, chatId: any): Observable<Object> {    
    return this.httpClient.put(URL_BASE + "/chats/message/" + `${chatId}`, message);
  }

  getChatById(chatId: any) {
    return this.httpClient.get<Chat>(URL_BASE + "/chats/" + chatId)
  }

  createChatRoom(chat: Chat): Observable<Object> {
    return this.httpClient.post(URL_BASE + "/chats/add", chat);
  }

  getChatByFirstUserNameAndSecondUserName(firstUserName: any, secondUserName: any) {
    return this.httpClient.get<Chat>(URL_BASE + "/chats/getChatByFirstUserNameAndSecondUserName" + '?expediteur=' + firstUserName + '&destinateur=' + secondUserName)
  }
  getChatByFirstUserNameAndSecondUserName2(firstUserName: string, secondUserName: string, message: Message) {
    const params = new HttpParams()
      .set('expediteur', firstUserName)
      .set('destinateur', secondUserName);
    
    return this.httpClient.post<Chat[]>(URL_BASE + '/chats/getChatByFirstUserNameAndSecondUserName2', message, { params });
  }
  
  getChatByFirstUserNameOrSecondUserName(username: any) {
    return this.httpClient.get<Chat>(URL_BASE + "/chats/allchat/" + username)
  }

}
