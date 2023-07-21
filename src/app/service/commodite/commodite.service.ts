import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommoditeService {
  API_URL = 'http://192.168.1.108:8000/api/type/immo';

  constructor(private http: HttpClient) { }

    //AFFICHER LA LISTE DES COMMODITES
    AfficherLaListeCommodite():Observable<any>{
      return this.http.get(`${this.API_URL}/`);
    }
}
