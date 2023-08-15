
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { StorageService } from '../auth/storage.service';

const custom_header_value = 'frontend'
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    //'Authorization': 'Bearer your_access_token', // Remplacez par le véritable jeton d'accès si nécessaire
    //'X-Custom-Auth': custom_header_value, // Si vous avez un en-tête personnalisé
  }),
};
const URL_BASE: string = environment.Url_BASE;

@Injectable({
  providedIn: 'root'
})
export class BienimmoService {

  // API_URL = 'http://192.168.1.6:8000/api/bien/immo';

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

  constructor(private http: HttpClient,
    private storageService: StorageService,) { }

  //AFFICHER LA LISTE DES BIENS IMMO
  AfficherLaListeBienImmo(): Observable<any> {
    return this.http.get(`${URL_BASE}/bien/immo`);
  }
  //AFFICHER LA LISTE DES BIENS IMMO RECENTS A LOUER
  AfficherLaListeBienImmoRecentAlouer(): Observable<any> {
    return this.http.get(`${URL_BASE}/bien/immo/statut/A louer`);
  }

  //AFFICHER LA LISTE DES BIENS IMMO  A VENDRE
  AfficherLaListeBienImmoAvendre(): Observable<any> {
    return this.http.get(`${URL_BASE}/bien/immo/statut/A vendre`);
  }

  //AFFICHER UN BIEN IMMO EN FONCTION DE SON ID
  AfficherBienImmoParId(id: number): Observable<any> {
    return this.http.get(`${URL_BASE}/bien/immo/${id}`);
  }

  //AFFICHER LA LISTE DES BIENS EN FONCTION DE LA COMMUNE
  AfficherBienImmoParCommune(id: number): Observable<any> {
    return this.http.get(`${URL_BASE}/bien/immo/commune/${id}`);
  }

  //AFFICHER LA LISTE DES BIENS EN FONCTION DE L'UTILISATEUR
  AfficherBienImmoParUser(): Observable<any> {
    const headers = this.getHeaders();
    console.log(headers);
    return this.http.get(`${URL_BASE}/bien/immo/user` ,
    { headers });
  }

  //AJOUTER UN BIEN
  registerBien(
    commodite: Array<any>,
    type: any,
    commune: any,
    nb_piece: any,
    nom: any,
    chambre: any,
    cuisine: any,
    toilette: any,
    surface: any,
    prix: any,
    statut: any,
    description: any,
    quartier: any,
    rue: any,
    porte: any,
    photo: File // Liste de photos
  ): Observable<any> {
    const headers = this.getHeaders();
    console.log(headers);
    console.log('commo', commodite);
    console.log('commune', commune);
    console.log('piece', nb_piece);
    console.log('nom', nom);
    console.log('chamb', chambre);
    console.log('cuis', cuisine);
    console.log('toil', toilette);
    console.log('sur', surface);
    console.log('prix', prix);
    console.log('stat', statut);
    console.log('descr', description);
    console.log('quart', quartier);
    console.log('rue', rue);
    console.log('porte', porte);
    console.log('Photo', photo);
    const formData = new FormData();
    for (const c of commodite) {
      formData.append('commodite[]', c);
    }
    formData.append('type', type);
    formData.append('commune', commune);
    formData.append('nb_piece', nb_piece);
    formData.append('nom', nom);
    formData.append('chambre', chambre);
    formData.append('cuisine', cuisine);
    formData.append('toilette', toilette);
    formData.append('surface', surface);
    formData.append('prix', prix);
    formData.append('statut', statut);
    formData.append('description', description);
    formData.append('quartier', quartier);
    formData.append('rue', rue);
    formData.append('porte', porte);
    formData.append('photo', photo);
    
    // for (const image of photo) {
    //   formData.append('photo[]', image, image.name);
    // }
    return this.http.post(
      URL_BASE + '/bien/immo/new',
      formData,
      { headers }
    );
  }

  //CANDIDATER UN BIEN 
  CandidaterBien(id: any): Observable<any> {
    const headers = this.getHeaders();
    console.log(id)
    console.log(headers)
    return this.http.post(`${URL_BASE}/candidature/${id}`, null, { headers });
  }

  //ACCEPTER CANDIDATURE BIEN 
  AccepterCandidaterBien(id: any): Observable<any> {
    const headers = this.getHeaders();
    console.log(id)
    console.log(headers)
    return this.http.post(`${URL_BASE}/candidature/accept/${id}`, null, { headers });
  }

   //ANNULER CANDIDATURE BIEN 
   AnnulerCandidaterBien(id: any): Observable<any> {
    const headers = this.getHeaders();
    console.log(id)
    console.log(headers)
    return this.http.post(`${URL_BASE}/candidature/refuse/${id}`, null, { headers });
  }
}
