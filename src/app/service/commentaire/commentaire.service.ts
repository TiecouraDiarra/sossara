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
export class commentaireService {

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

  // URL_BASE: string = environment.Url_BASE
  constructor(
    private storageService: StorageService,
    private http: HttpClient,) { }

  //FAIRE UNE commentaire
  Fairecommentaire(contenu: string, id: any): Observable<any> {
    const headers = this.getHeaders();
    const data = new FormData();
    data.append("contenu", contenu)
    data.append("bienImmo", id)

    return this.http.post(`${URL_BASE}/commentaire/ajouter`, data, { headers });
  }

  //REPONDRE UNE commentaire
  Repondrecommentaire(contenu: string, id: any): Observable<any> {
    const headers = this.getHeaders();
    const data = new FormData();
    data.append("contenu", contenu)
    data.append("commentaire", id)

    return this.http.post(`${URL_BASE}/reponse/ajouter`, data, { headers });
  }

  //AFFICHER LA LISTE DES commentaireS EN FONCTION D'UN BIEN
  AffichercommentaireParBien(id: any): Observable<any> {
    return this.http.get(`${URL_BASE}/commentaire/afficherparBienUuid/${id}`);
  }

  //AFFICHER LA LISTE DES REPONSES EN FONCTION D'UN COMMENTAIRE
  AfficherReponseParCommentaireid(id: any): Observable<any> {
    return this.http.get(`${URL_BASE}/reponse/afficherparcommentaire/${id}`);
  }

  //MODIFIER UN commentaire
  Modifiercommentaire(contenu: string, id: any): Observable<any> {
    const headers = this.getHeaders();
    const data = new FormData();
    data.append("contenu", contenu)
    data.append("id", id)
    return this.http.put(`${URL_BASE}/commentaire/modifierComm`, data, { headers });
  }

  //AFFICHER UN COMMENTAIRE PAR ID
  AfficherCommentaireParid(id: any): Observable<any> {
    return this.http.get(`${URL_BASE}/commentaire/afficherparId/${id}`);
  }

//AFFICHER UN COMMENTAIRE PAR ID
SupprimerCommentaire(id: any): Observable<any> {
  const headers = this.getHeaders();
  return this.http.delete(`${URL_BASE}/commentaire/supprimer/${id}`, { headers });
}

}
