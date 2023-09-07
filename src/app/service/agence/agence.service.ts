import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../auth/storage.service';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const URL_BASE: string = environment.Url_BASE

@Injectable({
  providedIn: 'root'
})
export class AgenceService {

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
    private http: HttpClient) { }


  //AJOUTER UN AGENT
  AjouterAgent(
    nom: string,
    email: string,
    telephone: string,
    adresse: string,
    ): Observable<any> {
    const headers = this.getHeaders();
    const formData = new FormData();
    console.log("nom " + nom)
    console.log(headers)
    console.log("email " +email)
    console.log("telephone " +telephone)
    console.log("adresse " +adresse)
    formData.append('nom', nom);
    formData.append('email', email);
    formData.append('telephone', telephone);
    formData.append('adresse', adresse);
    return this.http.post(`${URL_BASE}/user/child/create`, {
      formData,
    }, { headers });
  }

}
