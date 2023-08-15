import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { StorageService } from '../auth/storage.service';

const URL_BASE: string = environment.Url_BASE

const httpOptions: any = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class CommentaireService {

  private accessToken!: string; // Ajoutez cette ligne


  setAccessToken(token: string) {
    this.accessToken = token;
  }
   // Méthode pour ajouter le token JWT aux en-têtes
   getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`
    });
  }

  // URL_BASE: string = environment.Url_BASE
  constructor(
    private storageService: StorageService,
    private http: HttpClient,) { }

  //FAIRE UN COMMENTAIRE
  FaireCommentaire(contenu: any, id: any): Observable<any> {
    const headers = this.getHeaders();
    // const data = new FormData();
    // data.append("contenu", contenu)
    console.log(id)
    console.log(headers)
    console.log(contenu)
    return this.http.post(`${URL_BASE}/commentaire/${id}`, {
      contenu
    }, { headers });
  }

  //AFFICHER LA LISTE DES COMMENTAIRES EN FONCTION D'UN BIEN
  AfficherCommentaireParBien(id: number):Observable<any>{
    return this.http.get(`${URL_BASE}/commentaire/get/${id}`);
  }
}
