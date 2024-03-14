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
    telephone: string
  
  ): Observable<any> {
    const headers = this.getHeaders();
    const formData = new FormData();
    
    formData.append('nom', nom);
    formData.append('email', email);
    formData.append('telephone', telephone);
    return this.http.post(`${URL_BASE}/auth/agent/ajouter`,
      formData, { headers });
  }

  //AFFICHER LA LISTE DES AGENTS EN FONCTION DE L'AGENCE CONNECTEE
  ListeAgentParAgence(): Observable<any> {
    const headers = this.getHeaders();
     return this.http.get(`${URL_BASE}/user/agenceconnecter`,
      { headers });
  }

  //AFFICHER UN AGENT EN FONCTION DE SON ID
  AfficherAgentParId(id: number): Observable<any> {
    return this.http.get(`${URL_BASE}/user/agentparuuid/${id}`);
  }

  //AFFICHER UN UTILISATEUR EN FONCTION DE SON ID
  AfficherUserParId(id: number): Observable<any> {
    return this.http.get(`${URL_BASE}/user/${id}`);
  }

  //AFFICHER UNE AGENCE EN FONCTION DE SON ID
  // AfficherAgenceParId(id: number): Observable<any> {
  //   return this.http.get(`${URL_BASE}/user/afficheruserparid/${id}`);
  // }
  AfficherAgenceParId(id: number): Observable<any> {
    return this.http.get(`${URL_BASE}/user/agence/${id}`);
  }

  AfficherAgenceParUuId(id: number): Observable<any> {
    return this.http.get(`${URL_BASE}/user/agenceparuuid/${id}`);
  }

  //AFFICHER LA LISTE DES AGENTS EN FONCTION DE L'ID DE AGENCE
  AfficherListeAgentParAgence(id: number): Observable<any> {
    return this.http.get(`${URL_BASE}/user/child/get/${id}`);
  }

  //SUPPRIMER UN AGENT
  SupprimerAgent(id: any): Observable<any> {
    const headers = this.getHeaders();
   
    return this.http.post(`${URL_BASE}/user/child/delete/${id}`, null, { headers });
  }

}
