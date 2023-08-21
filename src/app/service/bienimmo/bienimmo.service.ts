
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
    return this.http.get(`${URL_BASE}/bien/immo/user`,
      { headers });
  }

  //AFFICHER LA LISTE DES BIENS QUI SONT LOUES EN FONCTION DE L'UTILISATEUR
  AfficherBienImmoDejaLoueParUser(): Observable<any> {
    const headers = this.getHeaders();
    console.log(headers);
    return this.http.get(`${URL_BASE}/bien/immo/get/rent`,
      { headers });
  }

  //AFFICHER LA LISTE DES BIENS QUI SONT VENDUS EN FONCTION DE L'UTILISATEUR
  AfficherBienImmoDejaVenduParUser(): Observable<any> {
    const headers = this.getHeaders();
    console.log(headers);
    return this.http.get(`${URL_BASE}/bien/immo/get/sell`,
      { headers });
  }

  //AFFICHER LA LISTE DES RECLAMATIONS EN FONCTION DES BIENS DE L'UTILISATEUR
  AfficherListeReclamationParUser(): Observable<any> {
    const headers = this.getHeaders();
    console.log(headers);
    return this.http.get(`${URL_BASE}/signal/get`,
      { headers });
  }


  //AJOUTER UN BIEN
  registerBien(
    commodite: [],
    type: number,
    commune: number,
    nb_piece: number,
    nom: string,
    chambre: number,
    cuisine: number,
    toilette: number,
    surface: number,
    prix: number,
    statut: string,
    description: string,
    quartier: string,
    rue: string,
    porte: number,
    photos: File[],
    // photo: File // Liste de photos
  ): Observable<any> {
    const headers = this.getHeaders();
    headers.append('Content-Type', 'multipart/form-data');
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
    console.log('photo', photos);
    const formData = new FormData();

    commodite.forEach(i => { formData.append('commodite[]', i) });
    formData.append('type', type.toString());
    formData.append('commune', commune.toString());
    formData.append('nb_piece', nb_piece.toString());
    formData.append('nom', nom);
    formData.append('chambre', chambre.toString());
    formData.append('cuisine', cuisine.toString());
    formData.append('toilette', toilette.toString());
    formData.append('surface', surface.toString());
    formData.append('prix', prix.toString());
    formData.append('statut', statut);
    formData.append('description', description);
    formData.append('quartier', quartier);
    formData.append('rue', rue);
    formData.append('porte', porte.toString());
    photos.forEach(p => { formData.append('photo[]', p) });

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

  //OUVRIR UNE CONVERSATION EN FONCTION DE L'UTILISATEUR
  OuvrirConversation(id: any): Observable<any> {
    const headers = this.getHeaders();
    console.log(id)
    console.log(headers)
    return this.http.post(`${URL_BASE}/conversation/new/${id}`, null, { headers });
  }


  //ANNULER CANDIDATURE BIEN 
  AnnulerCandidaterBien(id: any): Observable<any> {
    const headers = this.getHeaders();
    console.log(id)
    console.log(headers)
    return this.http.post(`${URL_BASE}/candidature/refuse/${id}`, null, { headers });
  }

  //AJOUTER UN BIEN
  ModifierBien(
    commodite: [],
    type: number,
    commune: number,
    nb_piece: number,
    nom: string,
    chambre: number,
    cuisine: number,
    toilette: number,
    surface: number,
    prix: number,
    statut: string,
    description: string,
    quartier: string,
    rue: string,
    porte: number,
    photos: File[], //Liste de photos
    id: any
  ): Observable<any> {
    const headers = this.getHeaders();
    headers.append('Content-Type', 'multipart/form-data');
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
    console.log('photo', photos);
    console.log('id', id);
    const formData = new FormData();

    commodite.forEach(i => { formData.append('commodite[]', i) });
    formData.append('type', type.toString());
    formData.append('commune', commune.toString());
    formData.append('nb_piece', nb_piece.toString());
    formData.append('nom', nom);
    formData.append('chambre', chambre.toString());
    formData.append('cuisine', cuisine.toString());
    formData.append('toilette', toilette.toString());
    formData.append('surface', surface.toString());
    formData.append('prix', prix.toString());
    formData.append('statut', statut);
    formData.append('description', description);
    formData.append('quartier', quartier);
    formData.append('rue', rue);
    formData.append('porte', porte.toString());
    photos.forEach(p => { formData.append('photo[]', p) });
    formData.append('id', id);

    return this.http.post(
      URL_BASE + '/bien/immo/update/' + `${id}`,
      formData,
      { headers }
    );
  }
}
