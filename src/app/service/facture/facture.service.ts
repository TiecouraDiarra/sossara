import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { StorageService } from '../auth/storage.service';


const URL_BASE: string = environment.Url_BASE;

@Injectable({
  providedIn: 'root'
})
export class FactureService {

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

  //AFFICHER LA LISTE DES FACTURES DU LOCATAIRE CONNECTE
  AfficherFactureLocataireConnecter(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}/facture/locataire`, { headers });
  }

  //AFFICHER LA LISTE DES FACTURES DU PROPRIETAIRE CONNECTE
  AfficherFactureProprietaireConnecter(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}/facture/proprietaire`, { headers });
  }


  //AFFICHER UNE FACTURE EN FONCTION DE SON UUID
  AfficherFactureParUuId(uuid: number): Observable<any> {
    const headers = this.getHeaders();

    return this.http.get(`${URL_BASE}/facture/afficherfactureparuuid/${uuid}`, { headers });
  }

    //checkFactureParUser
    checkFactureParUser(uuid: number): Observable<any> {
      const headers = this.getHeaders();
      return this.http.get(`${URL_BASE}/facture/check/${uuid}`,{ headers } );
    }
    //checkFactureAllParUser
    checkFactureAllParUser(uuid: number): Observable<any> {
      const headers = this.getHeaders();
      return this.http.get(`${URL_BASE}/facture/checkall/${uuid}`,{ headers } );
    }
  

  //AFFICHER UNE FACTURE EN FONCTION DE SON UUID
  AfficherFactureParBien(uuid: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${URL_BASE}/facture/factureparbien/${uuid}`, { headers });
  }

  //ENREGISTRER UN PAIEMENT OU NE PAS ENREGISTRER
  EnregistrerOuNon(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`${URL_BASE}/paiement/enregistrer/${id}`, { headers });
  }

}
