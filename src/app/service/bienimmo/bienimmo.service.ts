import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BienimmoService {

  API_URL = 'http://192.168.1.108:8000/api/bien/immo';

  constructor(private http: HttpClient) { }

    //AFFICHER LA LISTE DES BIENS IMMO
    AfficherLaListeBienImmo():Observable<any>{
      return this.http.get(`${this.API_URL}/`);
    }
}
