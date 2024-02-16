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

  //AFFICHER LA LISTE DES RDV RECU PAR USER CONNECTE
  AfficherLaListeRdv(): Observable<any> {
    const headers = this.getHeaders();
    // console.log(headers)
    return this.http.get(`${URL_BASE}/rdv/get/mine`, { headers });
  }

  //AFFICHER LA LISTE DES RDV ENVOYER PAR USER CONNECTE
  AfficherLaListeRdvUserConnecte(): Observable<any> {
    const headers = this.getHeaders();
    // console.log(headers)
    return this.http.get(`${URL_BASE}/rdv/get`, { headers });
  }

  //AFFICHER LA PHOTO DE USER CONNECTER
  AfficherPhotoUserConnecter(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}/user/photo/get`, { headers });
  }

  //PRENDRE RENDEZ-VOUS EN FONCTION DU BIEN
  PrendreRdv(date: string, heure: string, id: any): Observable<any> {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('bienImmo', id || '');
    formData.append('date', date || '');
    formData.append('heure', heure || '');
    return this.http.post(`${URL_BASE}/rdv/ajouter`,
    formData, { headers });
  }

  //AFFICHER LA LISTE DES CANDIDATURES DE BIENS EN FONCTION DE USER
  AfficherLaListeCandidature(): Observable<any> {
    const headers = this.getHeaders();
    // console.log(headers)
    return this.http.get(`${URL_BASE}/candidature/get/mine`, { headers });
  }

  //CHANGER MOT DE PASSE
  ChangerMotDePasse(old_password: string, password: string): Observable<any> {
    const headers = this.getHeaders();
    // console.log(headers)
    // console.log('Ancien mdp', old_password)
    // console.log('nouveau mdp', password)
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
    headers.set('Cache-Control', 'no-cache'); // Désactive le cache pour cette requête
    const formData = new FormData();
    formData.append('photo', photo);
    return this.http.post(`${URL_BASE}/user/update/photo`, formData, { headers });
  }

  //MODIFIER PROFIL USER
  modifierProfil(
    nom: string,
    telephone: string,
    email: string,
    dateNaissance: string
  ): Observable<any> {
    const formData = new FormData();
    const headers = this.getHeaders();
    // console.log("Nom de user : " + nom);
    // console.log("telephone de user : " + telephone);
    // console.log("email de user : " + email);
    // console.log("dateNaissance de user : " + dateNaissance);
    // console.log(headers)
    formData.append('nom', nom);
    formData.append('email', email);
    formData.append('telephone', telephone);
    formData.append('dateNaissance', dateNaissance);
    return this.http.post(
      URL_BASE + '/user/update',
      formData,
      { headers }
    );
  }

  //ENVOIE D'EMAIL POUR CHANGER LE PASSWORD
  forgotPassword(email: string): Observable<any> {
    // const headers = this.getHeaders();
    return this.http.post(`${URL_BASE}/reset/pass`, {
      email
    });
  }

  //CHANGER PASSWORD APRES OUBLIE
  ChangerPassword(token: string, password: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${URL_BASE}/rdv/${token}`, {
      password
    }
    );
  }



}
