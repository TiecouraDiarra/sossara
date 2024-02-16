import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { StorageService } from '../auth/storage.service';

const URL_BASE: string = environment.Url_BASE

const httpOptions: any = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class commentaireService {

  private accessToken!: string; // Ajoutez cette ligne


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

  // URL_BASE: string = environment.Url_BASE
  constructor(
    private storageService: StorageService,
    private http: HttpClient,) { }

  //FAIRE UNE commentaire
  Fairecommentaire(contenu: string, id: any): Observable<any> {
    const headers = this.getHeaders();
    const data = new FormData();
    data.append("contenu", contenu)
    data.append("bienImmo", id)
    // console.log(id)
    // console.log(data)  
    // console.log(contenu)
    return this.http.post(`${URL_BASE}/commentaire/ajouter`,data, { headers });
  }

  //AFFICHER LA LISTE DES commentaireS EN FONCTION D'UN BIEN
  AffichercommentaireParBien(id: number):Observable<any>{
    return this.http.get(`${URL_BASE}/commentaire/afficherparBien/${id}`);
  }
}
