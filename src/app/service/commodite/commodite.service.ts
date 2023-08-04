import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
export class CommoditeService {
  API_URL = 'http://192.168.1.4:8000/api/type/immo';

  constructor(private http: HttpClient) { }

    //AFFICHER LA LISTE DES COMMODITES
    AfficherLaListeCommodite():Observable<any>{
      return this.http.get(`${this.API_URL}/`);
    }
}
