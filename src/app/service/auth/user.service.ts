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
    return this.http.get(`${URL_BASE}/user/alluser`);
  }

  //AFFICHER LA LISTE DES RDV RECU PAR USER CONNECTE
  AfficherLaListeRdv(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}/rdv/get/mine`, { headers });
  }

  //AFFICHER LA LISTE DES RDV ENVOYER PAR USER CONNECTE
  AfficherLaListeRdvUserConnecte(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}/rdv/get`, { headers });
  }

  /// Modifiez le type de retour pour qu'il soit de type Observable<string>
  AfficherPhotoUserConnecter(): Observable<string> {
    const headers = this.getHeaders();
    return this.http.get<string>(`${URL_BASE}/user/photo-utilisateur`, { headers });
  }


  //AFFICHER LES INFORMATIONS DE USER CONNECTER
  AfficherUserConnecter(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}/user/afficherConnecter`, { headers });
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
    return this.http.get(`${URL_BASE}/candidature/get/mine`, { headers });
  }

  //CHANGER MOT DE PASSE
  ChangerMotDePasse(oldPassword: any, newPassword: any): Observable<any> {
    const headers = this.getHeaders();

    const formData = new FormData();
    formData.append('oldPassword', oldPassword);
    formData.append('newPassword', newPassword);
    return this.http.post(
      URL_BASE + '/auth/updatePassword',
      formData,
      { headers }
    );
  }
  // ChangerMotDePasse(old_password: string, password: string): Observable<any> {
  //   const headers = this.getHeaders();

  //   return this.http.post(
  //     URL_BASE + '/user/password_reset',
  //     {
  //       old_password,
  //       password,
  //     },
  //     { headers }
  //   );
  // }

  //CHANGER PHOTO PROFILE

  changerPhoto(photo: File): Observable<any> {
    const headers = this.getHeaders();
    headers.set('Cache-Control', 'no-cache'); // Désactive le cache pour cette requête
    const formData = new FormData();
    formData.append('photo', photo);
    return this.http.put(`${URL_BASE}/user/updatePhoto`, formData, { headers });
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

    formData.append('nom', nom);
    formData.append('email', email);
    formData.append('telephone', telephone);
    formData.append('dateNaissance', dateNaissance);
    return this.http.put(
      URL_BASE + '/user/updateProfil',
      formData,
      { headers }
    );
  }

  //MODIFIER ADRESSE USER
  modifierAdress(
    quartier: string,
    rue: string,
    porte: string,
    commune: any
  ): Observable<any> {
    const formData = new FormData();
    const headers = this.getHeaders();

    formData.append('quartier', quartier);
    formData.append('rue', rue);
    formData.append('porte', porte);
    formData.append('commune', commune);
    return this.http.put(
      URL_BASE + '/adresse/adresse',
      formData,
      { headers }
    );
  }


  //ENVOIE D'EMAIL POUR CHANGER LE PASSWORD
  forgotPassword(email: string): Observable<any> {
    // const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('email', email);
    console.log(email);
    return this.http.post(`${URL_BASE}/auth/forgotPassword`,
      formData
    );
  }

  //CHANGER PASSWORD APRES OUBLIE
  ChangerPassword(token: string, newPassword: any): Observable<any> {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('token', token);
    // console.log(token);
    formData.append('newPassword', newPassword);
    return this.http.post(URL_BASE + '/auth/resetPassword', formData);
  }



}
