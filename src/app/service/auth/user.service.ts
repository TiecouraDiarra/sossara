import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { StorageService } from './storage.service';

const API_URL = 'http://localhost:8080/api/test/';
const URL_BASE: string = environment.Url_BASE
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private accessToken!: string; // Ajoutez cette ligne


  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem(USER_KEY) // Remplacez par votre token JWT valide
    })
  };
  constructor(private http: HttpClient, private storageService: StorageService) { }

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

  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API_URL + 'user', { responseType: 'text' });
  }

  getModeratorBoard(): Observable<any> {
    return this.http.get(API_URL + 'mod', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(API_URL + 'admin', { responseType: 'text' });
  }


  //AFFICHER LA LISTE DES AGENCES
  AfficherLaListeAgence(): Observable<any> {
    return this.http.get(`${URL_BASE}/user/agence/get`);
  }

  //AFFICHER LA LISTE DES RDV EN FONCTION DE USER
  AfficherLaListeRdv(): Observable<any> {
    const headers = this.getHeaders();
    console.log(headers)
    return this.http.get(`${URL_BASE}/rdv/get/mine`, { headers });
  }

  //AFFICHER LA PHOTO DE USER CONNECTER
  AfficherPhotoUserConnecter(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}/user/photo/get`, { headers });
  }

  //PRENDRE RENDEZ-VOUS EN FONCTION DU BIEN
  PrendreRdv(date: Date, heure: string, id: any): Observable<any> {
    const headers = this.getHeaders();
    // const data = new FormData();
    // data.append("contenu", contenu)
    console.log(id)
    console.log(headers)
    console.log(date)
    console.log(heure)
    return this.http.post(`${URL_BASE}/rdv/${id}`, {
      date,
      heure
    }, { headers });
  }

  //AFFICHER LA LISTE DES CANDIDATURES DE BIENS EN FONCTION DE USER
  AfficherLaListeCandidature(): Observable<any> {
    const headers = this.getHeaders();
    console.log(headers)
    return this.http.get(`${URL_BASE}/candidature/get`, { headers });
  }

  //CHANGER MOT DE PASSE
  ChangerMotDePasse(old_password: string, password: string): Observable<any> {
    const headers = this.getHeaders();
    console.log(headers)
    console.log('Ancien mdp', old_password)
    console.log('nouveau mdp', password)
    return this.http.post(
      URL_BASE + '/user/password_reset',
      {
        old_password,
        password,
      },
      { headers }
    );
  }

  //CHANGER PHOTO PROFILE
  changerPhoto(photo: File): Observable<any> {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('photo', photo);
    return this.http.post(`${URL_BASE}/user/update/photo`, formData, { headers });
  }
}
