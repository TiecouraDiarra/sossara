
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const custom_header_value = 'frontend'
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    //'Authorization': 'Bearer your_access_token', // Remplacez par le véritable jeton d'accès si nécessaire
    //'X-Custom-Auth': custom_header_value, // Si vous avez un en-tête personnalisé
  }),
};

@Injectable({
  providedIn: 'root'
})
export class BienimmoService {

  API_URL = 'http://192.168.1.4:8000/api/bien/immo';

  constructor(private http: HttpClient) { }

    //AFFICHER LA LISTE DES BIENS IMMO
    AfficherLaListeBienImmo():Observable<any>{
      return this.http.get(`${this.API_URL}/`);
    }
    //AFFICHER LA LISTE DES BIENS IMMO RECENTS A LOUER
    AfficherLaListeBienImmoRecent():Observable<any>{
      return this.http.get(`${this.API_URL}/statut/A louer`);
    }

    //AFFICHER UN BIEN IMMO EN FONCTION DE SON ID
    AfficherBienImmoParId(id: number):Observable<any>{
      return this.http.get(`${this.API_URL}/${id}`);
    }

    //AFFICHER LA LISTE DES BIENS EN FONCTION DE LA COMMUNE
    AfficherBienImmoParCommune(id: number):Observable<any>{
      return this.http.get(`${this.API_URL}/commune/${id}`);
    }

     //AFFICHER LA LISTE DES BIENS EN FONCTION DE L'UTILISATEUR
     AfficherBienImmoParUser(id: number):Observable<any>{
      return this.http.get(`${this.API_URL}/user/${id}`);
    }
}
