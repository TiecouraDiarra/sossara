import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { StorageService } from '../auth/storage.service';


const URL_BASE: string = environment.Url_BASE;

@Injectable({
  providedIn: 'root'
})
export class ModepaiementService {

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

  //AFFICHER LA LISTE DES MODE DE PAIEMENT
  AfficherListeModePaiement(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}/modepaiement/afficher`, { headers });
  }

  //FAIRE LE PAIEMENT
  FairePaiement(
    id: any,
    nombreMois: any,
    nombreAnnees: any,
    nombreJours: any,
    sommePayer: any,
    numeroPaiement: any,
    modePaiement: any,
  ): Observable<any> {
    const headers = this.getHeaders();
    const formData = new FormData();

    formData.append('nombreMois', nombreMois || 0);
    formData.append('nombreAnnees', nombreAnnees || 0);
    formData.append('nombreJours', nombreJours || 0);
    formData.append('sommePayer', sommePayer);
    formData.append('modePaiement', modePaiement);
    formData.append('numeroPaiement', numeroPaiement);

  
    return this.http.post(`${URL_BASE}/paiement/fairepaiement/${id}`, formData, { headers });
  }

  //AFFICHER UN PAIEMENT EN FONCTION DE SON UUID
  AfficherPaiementParUuId(uuid: number): Observable<any> {
    return this.http.get(`${URL_BASE}/paiement/afficherpaiementparuuid/${uuid}`);
  }

  //ENREGISTRER UN PAIEMENT OU NE PAS ENREGISTRER
  EnregistrerOuNon(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`${URL_BASE}/paiement/enregistrer/${id}`, { headers });
  }

}
