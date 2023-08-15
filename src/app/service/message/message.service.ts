import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { StorageService } from '../auth/storage.service';
import { Observable } from 'rxjs';

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
    private http: HttpClient,) { }

    //AFFICHER LA LISTE DES CONVERSATIONS EN FONCTION DE USER
  AfficherLaListeConversation():Observable<any>{
    const headers = this.getHeaders();
    console.log(headers)
    return this.http.get(`${URL_BASE}/conversation/get/`, { headers });
  }

  //AFFICHER UNE CONVERSATION 
  AfficherUneConversation(id: number):Observable<any>{
    const headers = this.getHeaders();
    console.log(headers)
    return this.http.get(`${URL_BASE}/message/${id}`, { headers });
  }

  //ENVOYER UN MESSAGE
  EnvoyerMessage(content: any, id: any): Observable<any> {
    const headers = this.getHeaders();
    // const data = new FormData();
    // data.append("contenu", contenu)
    console.log(id)
    console.log(headers)
    console.log(content)
    return this.http.post(`${URL_BASE}/message/new/${id}`, {
      content
    }, { headers });
  }
}
