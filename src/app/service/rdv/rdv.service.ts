import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { StorageService } from '../auth/storage.service';
import { Observable } from 'rxjs';

const URL_BASE: string = environment.Url_BASE;


@Injectable({
  providedIn: 'root'
})
export class RdvService {

  private accessToken!: string; // Ajoutez cette ligne

  constructor(private http: HttpClient,
    private storageService: StorageService) { }


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


  //ACCEPETER UN RDV
  AccepterRdv(uuid: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${URL_BASE}/rdv/accepter/${uuid}`, null, { headers });
  }

  //ANNULER UN RDV
  AnnulerRdv(uuid: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${URL_BASE}/rdv/annuler/${uuid}`, null, { headers });
  }
}
