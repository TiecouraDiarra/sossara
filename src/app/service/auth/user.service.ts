import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/test/';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  API_URLE = 'http://192.168.1.4:8000/api/';

   // Méthode pour stocker le token JWT dans le sessionStorage
  //  storeToken(token: string): void {
  //   sessionStorage.setItem('jwt_token', token);
  // }

  // Méthode pour récupérer le token JWT depuis le sessionStorage
  // getToken(): string | null {
  //   return sessionStorage.getItem('jwt_token');
  // }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem(USER_KEY) // Remplacez par votre token JWT valide
    })
  };
  constructor(private http: HttpClient) {}

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
  AfficherLaListeAgence():Observable<any>{
    return this.http.get(`${this.API_URLE}user/agence/get`);
  }

  //AFFICHER LA LISTE DES RDV EN FONCTION DE USER
  AfficherLaListeRdv():Observable<any>{
    return this.http.get(`${this.API_URLE}rdv/get`, this.httpOptions);
  }
}
