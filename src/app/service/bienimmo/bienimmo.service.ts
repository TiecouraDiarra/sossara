
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
    return this.http.get(`${URL_BASE}/bien/afficherbien`);
  }

  //AFFICHER LA LISTE DES BIENS IMMO LES PLUS VUS
  AfficherLaListeBienImmoPlusVue(): Observable<any> {
    return this.http.get(`${URL_BASE}/favoris/top6biens`);
  }

  //AFFICHER LA LISTE DE TOUS LES BIENS IMMO AIMES
  AfficherLaListeBienImmoAimer(): Observable<any> {
    return this.http.get(`${URL_BASE}/bien/immo/favoris/get`);
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
    return this.http.get(`${URL_BASE}/bien/afficherbienparid/${id}`);
  }

   //AFFICHER UNE CANDIDATURE EN FONCTION DE SON UUID
   AfficherCandidatureParUuId(uuid: number): Observable<any> {
    return this.http.get(`${URL_BASE}/candidature/affichercandidatureparuuid/${uuid}`);
  }

  //AFFICHER LA LISTE DES BIENS EN FONCTION DE LA COMMUNE
  AfficherBienImmoParCommune(id: number): Observable<any> {
    return this.http.get(`${URL_BASE}/bien/afficherbien/parcommune/${id}`);
  }

  //AFFICHER UNE TRANSACTION POUR LES  VENTE EN FONCTION DE SON ID
  AfficherTransactionParId(id: number): Observable<any> {
    const headers = this.getHeaders();
    // console.log(headers);
    // console.log(id);
    return this.http.get(`${URL_BASE}/bien/immo/get/sell/invoyce/${id}`,
      { headers });
  }

  //AFFICHER LA LISTE DES BIENS LOUES DONT LES CANDIDATURES SONT ACCEPTEES EN FONCTION DES LOCATAIRES
  AfficherCandidatureAccepter(id: number): Observable<any> {
    const headers = this.getHeaders();
    // console.log(headers);
    // console.log(id);
    return this.http.get(`${URL_BASE}/bien/immo/get/rent/invoyce/${id}`,
      { headers });
  }
  //AFFICHER LA LISTE DES BIENS LOUES DONT LES CANDIDATURES SONT ACCEPTEES EN FONCTION DES LOCATAIRES
  AfficherBienImmoLoueCandidatureAccepter(): Observable<any> {
    const headers = this.getHeaders();
    // console.log(headers);
    return this.http.get(`${URL_BASE}/candidature/immo/get/rent/mine`,
      { headers });
  }

  //AFFICHER LA LISTE DES BIENS EN FONCTION DE L'UTILISATEUR SANS AGENCE
  AfficherBienImmoParUser(): Observable<any> {
    const headers = this.getHeaders();
    // console.log(headers);
    return this.http.get(`${URL_BASE}/bien/immo/user`,
      { headers });
  }

  //AFFICHER LA LISTE DES BIENS EN FONCTION DE L'UTILISATEUR CONNECTEE  AVEC AGENCE
  AfficherBienImmoParUserConnecte(): Observable<any> {
    const headers = this.getHeaders();
    // console.log(headers);
    return this.http.get(`${URL_BASE}/bien/immo/user`,
      { headers });
  }

   //AFFICHER LA LISTE DES BIENS EN FONCTION DE L'AGENCE CONNECTEE
   AfficherBienImmoParAgenceConnecte(): Observable<any> {
    const headers = this.getHeaders();
    // console.log(headers);
    return this.http.get(`${URL_BASE}/user/agenceconnecter`,
      { headers });
  }




  //AFFICHER LA LISTE DES BIENS QUI SONT LOUES EN FONCTION DE L'UTILISATEUR SANS AGENCE
  AfficherBienImmoDejaLoueParUser(): Observable<any> {
    const headers = this.getHeaders();
    // console.log(headers);
    return this.http.get(`${URL_BASE}/bien/immo/get/rent`,
      { headers });
  }

  //AFFICHER LA LISTE DES BIENS QUI SONT LOUES EN FONCTION DE L'AGENCE
  AfficherBienImmoDejaLoueParAgence(): Observable<any> {
    const headers = this.getHeaders();
    // console.log(headers);
    return this.http.get(`${URL_BASE}/bien/immo/agence/get/rent`,
      { headers });
  }

  //AFFICHER LA LISTE DES BIENS QUI SONT VENDUS EN FONCTION DE L'AGENCE
  AfficherBienImmoDejaVenduParAgence(): Observable<any> {
    const headers = this.getHeaders();
    // console.log(headers);
    return this.http.get(`${URL_BASE}/bien/immo/agence/get/sell`,
      { headers });
  }

  //AFFICHER LA LISTE DES BIENS QUE L'UTILISATEUR CONNECTE A LOUER
  AfficherBienImmoDejaLoueParLocataire(): Observable<any> {
    const headers = this.getHeaders();
    // console.log(headers);
    return this.http.get(`${URL_BASE}/candidature/immo/get/rent/mine`,
      { headers });
  }

  //AFFICHER LA LISTE DES BIENS QUE L'UTILISATEUR CONNECTE A ACHETER
  AfficherBienImmoUserAcheter(): Observable<any> {
    const headers = this.getHeaders();
    // console.log(headers);
    return this.http.get(`${URL_BASE}/bien/immo/get/sell/mine`,
      { headers });
  }



  //AFFICHER LA LISTE DES BIENS QUI SONT VENDUS EN FONCTION DE L'UTILISATEUR
  AfficherBienImmoDejaVenduParUser(): Observable<any> {
    const headers = this.getHeaders();
    // console.log(headers);
    return this.http.get(`${URL_BASE}/bien/immo/get/sell`,
      { headers });
  }

  //AFFICHER LA LISTE DES RECLAMATIONS EN FONCTION DES BIENS DE L'UTILISATEUR
  AfficherListeReclamationParUser(): Observable<any> {
    const headers = this.getHeaders();
    // console.log(headers);
    return this.http.get(`${URL_BASE}/probleme/signal/get`,
      { headers });
  }

  //AFFICHER LA LISTE DES RECLAMATIONS FAITES PAR UTILISATEUR
  AfficherListeReclamationFaitesParUser(): Observable<any> {
    const headers = this.getHeaders();
    // console.log(headers);
    return this.http.get(`${URL_BASE}/probleme/signal/get/mine`,
      { headers });
  }

  //AFFICHER LA LISTE DES BIENS AIMES PAR UTILISATEUR
  ListeBiensAimesParUtilisateur(): Observable<any> {
    const headers = this.getHeaders();
    // console.log(headers);
    return this.http.get(`${URL_BASE}/bien/immo/views/user/get`,
      { headers });
  }


  registerBien(
    commodite: any[],
    type: number,
    commune: number,
    nb_piece: number,
    nom: string,
    chambre: number,
    cuisine: number,
    toilette: number,
    surface: number,
    prix: number,
    statut: string, // Assurez-vous que le statut est envoyé en tant que chaîne de caractères
    description: string,
    quartier: string,
    rue: string,
    porte: number,
    periode: number,
    caution : number,
    avance : number,
    longitude: number,
    latitude: number,
    photos: File[]
): Observable<any> {
    const headers = this.getHeaders();
    const formData = new FormData(); 

    commodite.forEach(i => { formData.append('commodites[]', i); });
    formData.append('typeImmoId', type.toString());
    formData.append('commune', commune.toString());
    formData.append('nb_piece', nb_piece.toString());
    formData.append('nom', nom);
    formData.append('chambre', chambre.toString());
    formData.append('cuisine', cuisine.toString());
    formData.append('toilette', toilette.toString());
    formData.append('surface', surface.toString());
    formData.append('prix', prix.toString());
    formData.append('statutId', statut);
    formData.append('description', description);
    formData.append('quartier', quartier);
    formData.append('rue', rue);
    formData.append('porte', porte.toString());
    // Si le statut est "A vendre", définissez la période sur 6
    if (statut === "2") {
        formData.append('periodeId', '6');
    } else {
        formData.append('periodeId', periode.toString());
    }
   
    formData.append('caution', caution.toString());
    formData.append('avance', avance.toString());
    formData.append('longitude', longitude.toString());
    formData.append('latitude', latitude.toString());
    photos.forEach(p => { formData.append('photoImmos', p); });


    // Vous pouvez supposer que URL_BASE est défini ailleurs dans votre code
    return this.http.post(
        `${URL_BASE}/bien/ajouter`,
        formData,
        { headers }
    );
}

  //CANDIDATER UN BIEN 
  CandidaterBien(id: any): Observable<any> {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('bienImmo', id || '');
    // console.log(id)
    // console.log(headers)
    return this.http.post(`${URL_BASE}/candidature/ajouter`, formData, { headers });
  }

  //AIMER UN BIEN 
  AimerBien(id: any): Observable<any> {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('bienImmo', id || '');
    // console.log(id)
    // console.log(headers)
    return this.http.post(`${URL_BASE}/favoris/ajouter-ou-retirer`, formData, { headers });
  }

  //LA LISTE DES AIMES EN FONCTION DE L'ID DU BIEN 
  ListeAimerBienParId(id: any): Observable<any> {
    return this.http.get(`${URL_BASE}/bien/immo/views/get/${id}`);
  }

  //LE NOMBRE DE BIENS LOUES
  NombreBienLouer(): Observable<any> {
    return this.http.get(`${URL_BASE}/bien/immo/get/rent/all`);
  }

  //LE NOMBRE DE BIENS VENDUES
  NombreBienVendu(): Observable<any> {
    return this.http.get(`${URL_BASE}/bien/immo/get/sell/all`);
  }

  //ARRETER LE PROCESSUS
  ArreterProcessusOld(id: any): Observable<any> {
    const headers = this.getHeaders();
    // console.log(id)
    // console.log(headers)
    return this.http.post(`${URL_BASE}/reparation/confirmer/list/${id}`, null, { headers });
  }


  //ACCEPTER CANDIDATURE BIEN 
  AccepterCandidaterBien(id: any): Observable<any> {
    const headers = this.getHeaders();
    // console.log(id)
    // console.log(headers)
    return this.http.post(`${URL_BASE}/candidature/accept/${id}`, null, { headers });
  }

  //OUVRIR UNE CONVERSATION EN FONCTION DE L'UTILISATEUR
  OuvrirConversation(id: any): Observable<any> {
    const headers = this.getHeaders();
    // console.log(id)
    // console.log(headers)
    return this.http.post(`${URL_BASE}/conversation/new/${id}`, null, { headers });
  }


  //ANNULER CANDIDATURE BIEN 
  AnnulerCandidaterBien(id: any): Observable<any> {
    const headers = this.getHeaders();
    // console.log(id)
    // console.log(headers)
    return this.http.post(`${URL_BASE}/candidature/annuler/${id}`, null, { headers });
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
    periode: number,
    longitude: number,
    latitude: number,
    id: any
  ): Observable<any> {
    const headers = this.getHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    // console.log(headers);
    // console.log('commo', commodite);
    // console.log('commune', commune);
    // console.log('piece', nb_piece);
    // console.log('nom', nom);
    // console.log('chamb', chambre);
    // console.log('cuis', cuisine);
    // console.log('toil', toilette);
    // console.log('sur', surface);
    // console.log('prix', prix);
    // console.log('stat', statut);
    // console.log('descr', description);
    // console.log('quart', quartier);
    // console.log('rue', rue);
    // console.log('porte', porte);
    // console.log('periode', periode);
    // console.log('longitude', longitude);
    // console.log('latitude', latitude);
    // console.log('id', id);
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
    // Si le statut est "A vendre", définissez la période sur 6
    if (statut === "A vendre") {
      formData.append('periode', '6');
    } else if (statut === "A louer") {
      formData.append('periode', periode.toString());
    }
    formData.append('longitude', longitude.toString());
    formData.append('latitude', latitude.toString());
    formData.append('id', id);

    return this.http.post(
      URL_BASE + '/bien/immo/update/' + `${id}`,
      formData,
      { headers }
    );
  }

  //AFFICHER LA LISTE DES TYPES DE PROBLEMES
  AfficherLIsteProbleme(): Observable<any> {
    const headers = this.getHeaders();
    // console.log(headers);
    return this.http.get(`${URL_BASE}/typeprobleme/afficher`,
      { headers });
  }

  //AFFICHER LA LISTE DES RECLAMATIONS DONT LES PROCESSUS SONT LANCES
  AfficherLIsteReclamationProcessusLance(): Observable<any> {
    const headers = this.getHeaders();
    // console.log(headers);
    return this.http.get(`${URL_BASE}/probleme/processus/get`,
      { headers });
  }

    //AFFICHER LA LISTE DES RECLAMATIONS DONT LES PROCESSUS SONT LANCES agences proprietaire
    AfficherProcessusLancerProprietaireAgenceConnecter(): Observable<any> {
      const headers = this.getHeaders();
      // console.log(headers);
      return this.http.get(`${URL_BASE}/probleme/processus/get/mine`,
        { headers });
    }

      //AFFICHER LA LISTE DES RECLAMATIONS DONT LES PROCESSUS SONT LANCES agences proprietaire
      // ...
      faireUneRecherche(
        typeImmo?: any,
        statut?: any,
        chambre?: any,
        nb_piece?: any,
        toilette?: any,
        cuisine?: any,
        commune?: any,
        cercle?: any,
        region?: any,
        minprix?:any,
        maxprix?:any,
        commodites?: any[]
      ): Observable<any> {
        const headers = this.getHeaders(); // Supposons que cette méthode renvoie les en-têtes appropriés
      
        // Construisez les paramètres de l'URL
        let params = new HttpParams();
        if (typeImmo) params = params.append('typeImmo', typeImmo);
        if (statut) params = params.append('statut', statut);
        if (chambre) params = params.append('chambre', chambre);
        if (nb_piece) params = params.append('nb_piece', nb_piece);
        if (toilette) params = params.append('toilette', toilette);
        if (cuisine) params = params.append('cuisine', cuisine);
        if (commune) params = params.append('commune', commune);
        if (cercle) params = params.append('cercle', cercle);
        if (region) params = params.append('region', region);
        if (chambre) params = params.append('minprix', minprix);
        if (nb_piece) params = params.append('maxprix', maxprix);
        if (commodites) {
          commodites.forEach(commodite => {
            params = params.append('commodites', commodite);
          });
        }
      
        return this.http.get(`${URL_BASE}/bien/biens`, { headers, params });
      }
      

  //FAIRE UNE RECLAMATION
  FaireReclamation(
    contenu: string,
    type: number,
    prix_estimatif: number,
    idbien: number,
    photos: File[],
    // photo: File // Liste de photos
  ): Observable<any> {
    const headers = this.getHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    // console.log(headers);
    // console.log('contenu', contenu);
    // console.log('prixestimatif', prix_estimatif);
    // console.log('type', type);
    // console.log('idbien', idbien);
    // console.log('photo', photos);
    const formData = new FormData();

    formData.append('contenu', contenu);
    formData.append('typeProblemeId', type.toString());
    formData.append('prix_estimatif', prix_estimatif.toString());
    formData.append('bienImmoId', idbien.toString());
    photos.forEach(p => { formData.append('photoReclamations', p) });

    return this.http.post(
      URL_BASE + '/probleme/signal',
      formData,
      { headers }
    );
  }

  //LANCER LE PROCESSUS DE REPARATION
  LancerProcessusReparation(id: any): Observable<any> {
    const headers = this.getHeaders();
    // const data = new FormData();
    // data.append("contenu", contenu)
    // console.log(id)
    // console.log(headers)
    console.log(headers)
    return this.http.post(`${URL_BASE}/probleme/lancerprocessus/${id}`, null, { headers });
  }

  //SUPPRIMER UN BIEN
  SupprimerBien(id: any): Observable<any> {
    const headers = this.getHeaders();
    // console.log(id)
    // console.log(headers)
    return this.http.post(`${URL_BASE}/bien/immo/delete/${id}`, null, { headers });
  }

  //FAIRE UNE RECLAMATION
  ArreterProcessusNew(
    idRec: number,
    photo: File,
    // photo: File // Liste de photos
  ): Observable<any> {
    const headers = this.getHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    // console.log(headers);
    // console.log('photo', photo);
    const formData = new FormData();

    formData.append('idRec', idRec.toString());
    formData.append('photo', photo);

    return this.http.post(
      URL_BASE + '/reparation/confirmer/list/' + `${idRec}`,
      formData,
      { headers }
    );
  }

}
