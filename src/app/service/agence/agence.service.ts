import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../auth/storage.service';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const URL_BASE: string = environment.Url_BASE

@Injectable({
  providedIn: 'root'
})
export class AgenceService {

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
    private http: HttpClient) { }


  //AJOUTER UN AGENT
  AjouterAgent(
    nom: string,
    email: string,
    telephone: string,
    quartier: string,
  ): Observable<any> {
    const headers = this.getHeaders();
    const formData = new FormData();
    console.log("nom " + nom)
    console.log(headers)
    console.log("email " + email)
    console.log("telephone " + telephone)
    console.log("quartier " + quartier)
    formData.append('nom', nom);
    formData.append('email', email);
    formData.append('telephone', telephone);
    formData.append('quartier', quartier);
    return this.http.post(`${URL_BASE}/user/child/create`,
      formData, { headers });
  }

  //AFFICHER LA LISTE DES AGENTS EN FONCTION DE L'AGENCE CONNECTEE
  ListeAgentParAgence(): Observable<any> {
    const headers = this.getHeaders();
    // console.log(headers);
    return this.http.get(`${URL_BASE}/user/child/get`,
      { headers });
  }

  //AFFICHER UN AGENT EN FONCTION DE SON ID
  AfficherAgentParId(id: number): Observable<any> {
    return this.http.get(`${URL_BASE}/bien/immo/user/agent/get/${id}`);
  }

  //AFFICHER UN UTILISATEUR EN FONCTION DE SON ID
  AfficherUserParId(id: number): Observable<any> {
    return this.http.get(`${URL_BASE}/user/${id}`);
  }

  //AFFICHER UNE AGENCE EN FONCTION DE SON ID
  AfficherAgenceParId(id: number): Observable<any> {
    return this.http.get(`${URL_BASE}/user/afficheruserparid/${id}`);
  }

  //AFFICHER LA LISTE DES AGENTS EN FONCTION DE L'ID DE AGENCE
  AfficherListeAgentParAgence(id: number): Observable<any> {
    return this.http.get(`${URL_BASE}/user/child/get/${id}`);
  }

  //SUPPRIMER UN AGENT
  SupprimerAgent(id: any): Observable<any> {
    const headers = this.getHeaders();
    // console.log(id)
    // console.log(headers)
    return this.http.post(`${URL_BASE}/user/child/delete/${id}`, null, { headers });
  }

}
