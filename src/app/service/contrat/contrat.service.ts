import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { StorageService } from '../auth/storage.service';


const URL_BASE: string = environment.Url_BASE;

@Injectable({
  providedIn: 'root'
})
export class ContratService {

  private accessToken!: string; // Ajoutez cette ligne

  constructor(private http: HttpClient,
    private storageService: StorageService,) { }


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



  //AFFICHER UN CONTRAT EN FONCTION DE SON UUID
  AfficherContratParUuId(uuid: number): Observable<any> {
    return this.http.get(`${URL_BASE}/contrat/affichercontratparuuid/${uuid}`);
  }


  //ANNULER UN CONTRAT COTE LOCATAIRE 
  AnnulerContratLocataire(id: any): Observable<any> {
    const headers = this.getHeaders();
    
   
    return this.http.post(`${URL_BASE}/contrat/annulerlocataire/${id}`, null, { headers });
  }

  //ANNULER UN CONTRAT COTE PROPRIETAIRE 
  AnnulerContratProprietaire(id: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${URL_BASE}/contrat/annulerproprietaire/${id}`, null, { headers });
  }

  //ACCEPTER CANDIDATURE BIEN PROPRIETAIRE C'EST A DIRE VALIDER CONTRAT
  AccepterCandidaterBien(id: any): Observable<any> {
    const headers = this.getHeaders();
    
   
    return this.http.post(`${URL_BASE}/candidature/accept/${id}`, null, { headers });
  }

  //VALIDER CONTRAT LOCATAIRE C'EST A DIRE VALIDER CONTRAT
  ValiderContratBien(id: any): Observable<any> {
    const headers = this.getHeaders();
    
   
    return this.http.post(`${URL_BASE}/contrat/validelocataire/${id}`, null, { headers });
  }
}
