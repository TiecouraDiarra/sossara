import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { routes } from 'src/app/core/helpers/routes/routes';
import { DataService } from 'src/app/service/data.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { MatTableDataSource } from '@angular/material/table';
import { CommoditeService } from 'src/app/service/commodite/commodite.service';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { AdresseService } from 'src/app/service/adresse/adresse.service';
import { configbienService } from 'src/app/service/configbien/configbien.service';
import { NgForm } from '@angular/forms';
// declare var google: any;
import * as L from 'leaflet';
import { Options } from 'ng5-slider';

const URL_PHOTO: string = environment.Url_PHOTO;



@Component({
  selector: 'app-trouverbien',
  templateUrl: './trouverbien.component.html',
  styleUrls: ['./trouverbien.component.css']
})
export class TrouverbienComponent implements OnInit {
  public routes = routes;
  public mapgrid: any = [];
  public categories: any = [];
  categoriesDataSource = new MatTableDataSource();
  searchInputCategory: any;
  selectedCategory: any = '';
  bienImmo: any;
  bienImmoMap: any;
  commodite: any
  adresse: any
  region: any
  commune: any
  cercles: any[] = [];
  communes1: any = [];
  typebien: any
  searchText: any;
  selectedType1: any;
  selectedRegion: any;
  selectedCommune: any;
  selectedType: any;
  p: number = 1;
  customHtmlMinValue: number = 0;
  customHtmlMaxValue: number = 0;
  customHtmlSliderOptions: Options = { floor: 0, ceil: 100, translate: (value: number): string => ' FCFA ' + value }; // Valeur par défaut

  // customHtmlSliderOptions: Options = {
  //   floor: 0,
  //   ceil: this.customHtmlMaxValue+100,
  //   translate: (value: number): string => {
  //     return ' FCFA ' + value;
  //   }
  // };
  valuesSelect: any = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  valuesSelectPrix: any = ['10000', '20000', '30000', '40000', '50000', '60000', '70000', '80000', '90000', '100000', '200000', '300000', '400000', '500000', '600000', '700000', '800000', '900000', '1000000', '150000000000000000000000000'];


  // MAP
  options!: any;
  userPosition: any;
  // overlayse: any[] = [];
  // @Input() searchText: string | undefined;
  overlays: Array<any> = [];
  // Filtrer les marqueurs en fonction de searchText
  //  filteredMarkers = this.overlays;
  public showFilter: boolean = false;
 
  // IMAGE PAR DEFAUT DES BIENS
  DEFAULT_IMAGE_URL = 'assets/img/gallery/gallery1/gallery-1.jpg';
  status: any;
  cercle: any;
  max: any;
  min: any;
  // cercles: any;

  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }

  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO;
    return baseUrl + photoFileName;
  }

 

  //RECHERCHER PAR REGION
  onRegionSelectionChange(event: any) {
    this.selectedRegion = event.value;
  }

  // a fonction de filtrage pour la region et la commune dans MAP
  filterMarkersByCriteria() {
    let filteredOverlays: any[] = this.overlays;

    // Filtrer les marqueurs en fonction de la région sélectionnée
    if (this.selectedRegion !== '' && this.selectedRegion !== 'Tout') {
      filteredOverlays = filteredOverlays.filter(marker => marker.region === this.selectedRegion);
    }

    // Filtrer les marqueurs en fonction de la commune sélectionnée
    if (this.selectedCommune !== '' && this.selectedCommune !== 'Tout') {
      filteredOverlays = filteredOverlays.filter(marker => marker.commune === this.selectedCommune);
    }

    // Filtrer les marqueurs en fonction de la commune sélectionnée
    if (this.selectedType !== '' && this.selectedType !== 'Tout') {
      filteredOverlays = filteredOverlays.filter(marker => marker.type === this.selectedType);
    }

    // Filtrer les marqueurs en fonction du texte de recherche
    if (this.searchText !== '') {
      filteredOverlays = filteredOverlays.filter(marker => marker.nom.toLowerCase().includes(this.searchText.toLowerCase()));
    }

    // Ajoutez d'autres critères de filtrage ici si nécessaire

    return filteredOverlays;
  }

  //RECHERCHER PAR COMMUNE
  onCommuneSelectionChange(event: any) {
    this.selectedCommune = event.value;
    // Appelez la fonction de filtrage ici pour mettre à jour la carte en fonction de la nouvelle sélection de commune.
    this.filterMarkersByCriteria();
  }

  //RECHERCHER PAR TYPE
  onTypeSelectionChange(event: any) {
    this.selectedType = event.value;
  }
  //FORMATER LE PRIX
  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  isLoggedIn = false;
  isLoginFailed = true;
  errorMessage = '';
  locale!: string;
  NombreJaime: number = 0


  private map!: L.Map;
  private centroid: L.LatLngExpression = [17.570692, -3.996166]; // Coordonnées du Mali

  setInfo(event: any) {
    var marker = event.overlay;
    // var imageSrc = marker.image ? this.generateImageUrl(marker.image) : 'assets/img/gallery/gallery1/gallery-1.jpg'; // Remplacez 'chemin/vers/image_par_defaut.jpg' par le chemin de votre image par défaut.
    var content =
      '<div class="profile-widget crd" style="width: 300px; background: url(' +
      marker.image +
      '); position: relative; padding: 90px 0; background-repeat: no-repeat; background-size: cover; display: inline-block; border-radius: 10px; ">' +
      '<div class="pro-content">' +
      '<h3 class="title">' +
      '<a href="javascript:void(0)">' +
      marker.doc_name +
      '</a>' +
      '</h3>';

    // Utilisation de *ngIf pour conditionner l'affichage en fonction du statut
    if (marker.statut == 'A vendre') {
      content +=
        '<div class="row">' +
        '<div class="col"><span class="Featured-text" style="background-color:#e98b11; font-weight: bold;">' + marker.statut + '</span></div>' +
        `<div class="col"><p class="blog-category"><a (click)="goToDettailBien(${marker.id})"><span>`
        + marker.types + '</span></a></p></div>';
    } else if (marker.statut == 'A louer') {
      content +=
        '<div class="row">' +
        '<div class="col"><span class="Featured-text" style="font-weight: bold;">' + marker.statut + '</span></div>' +
        '<div class="col"><p class="blog-category"><a href="javascript:void(0)"><span>' +
        marker.types + '</span></a></p></div>';
    }

    content +=
     
      '<ul class="available-info mt-3">' +
      '<li class="mapaddress"><i class="fas fa-map-marker-alt me-2"></i> ' +
      marker.address + ', ' + marker.regions +
      ' </li>' +
      '<li class="map-amount" style="color: #e98b11;  font-weight: bold;">' +
      this.formatPrice(marker.amount) + ' FCFA' +

      '</li>' +
      '</ul>' +
      '</div>' +
      '</div>';

  }
  private initMap(): void {
  
    // Ajouter des tuiles OpenStreetMap à la carte
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    });
    // Créer la carte Leaflet
    this.map = L.map('map').setView([17.570692, -3.996166], 6).addLayer(tiles); // Définir une vue initiale

    tiles.addTo(this.map);

    // Obtenir la position actuelle de l'utilisateur
    navigator.geolocation.getCurrentPosition((position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      // Créer une icône personnalisée pour le marqueur
      var customIcon = L.icon({
        iconUrl: 'assets/img/iconeBien/localite.png',
        iconSize: [50, 50], // Taille de l'icône [largeur, hauteur]
        iconAnchor: [19, 38], // Point d'ancrage de l'icône [position X, position Y], généralement la moitié de la largeur et la hauteur de l'icône
        popupAnchor: [0, -38] // Point d'ancrage du popup [position X, position Y], généralement en haut de l'icône
      });

      // Créer un marqueur pour la position de l'utilisateur
      const userMarker = L.marker([userLat, userLng], { icon: customIcon }).addTo(this.map);
      userMarker.bindPopup('Votre position actuelle').openPopup();

      // Centrer la carte sur la position de l'utilisateur
      this.map.setView([userLat, userLng], 12);
    }, (error) => {

    });

    this.route.queryParams.subscribe((params: Params) => {
      // Initialisez les valeurs du formulaire avec les paramètres d'URL
      this.form.type = params['type'] || null;
      this.form.statut = params['statut'] || null;
      this.form.chambre = params['chambre'] || null;
      this.form.nb_piece = params['nb_piece'] || null;
      this.form.toilette = params['toilette'] || null;
      this.form.cuisine = params['cuisine'] || null;
      this.form.commune = params['commune'] || null;
      this.form.cercleForm = params['cercleForm'] || null;
      this.form.regionForm = params['regionForm'] || null;
      this.form.minprix = params['minprix'] || null;
      this.form.maxprix = params['maxprix'] || null;
      this.form.commodite = params['commodite'] || null;
      // Initialisez d'autres propriétés du formulaire ici
    });



    //AFFICHER LA LISTE DES BIENS IMMO
    this.route.queryParams.subscribe(params => {
      const {
        type,
        statut,
        chambre,
        nb_piece,
        toilette,
        cuisine,
        commune,
        cercleForm,
        regionForm,
        minprix,
        maxprix,
        commodite,
      } = params;

      // Appel de la méthode de recherche avec les nouveaux paramètres d'URL
      this.serviceBienImmo

        .faireUneRecherche(
          type,
          statut,
          chambre,
          nb_piece,
          toilette,
          cuisine,
          commune,
          cercleForm,
          regionForm,
          minprix,
          maxprix,
          commodite
        )
        .subscribe((data) => {


          if (Array.isArray(data) && data.length > 0) {
            // Assurez-vous que data.biens est un tableau avant d'appeler map
            this.bienImmoMap = data?.reverse();
            // Convertissez les données de bien immobilier en marqueurs Leaflet
            this.overlays = this.bienImmoMap.map((bien: any) => {
              const imageSrc = bien?.photos ? this.generateImageUrl(bien.photos) : 'assets/img/gallery/gallery1/gallery-1.jpg';
              const marker = L.marker([bien?.adresse?.latitude, bien?.adresse?.longitude], {
                icon: L.icon({
                  iconUrl: 'assets/img/iconeBien/localisations.svg',
                  iconSize: [80, 80], // Taille de l'icône du marqueur
                  iconAnchor: [19, 38], // Point d'ancrage de l'icône du marqueur
                  popupAnchor: [0, -38], // Point d'ancrage du popup du marqueur
                  shadowSize: [41, 41]
                })
              });

              // Créez un contenu de popup pour le marqueur
              let content = `
              <div class="profile-widget crd" style="width: 300px; background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${imageSrc}'); position: relative; padding: 90px 0; background-repeat: no-repeat; background-size: cover; display: inline-block; border-radius: 10px;">
                <div class="pro-content">
                  <h3 class="title" style="font-weight: 500; color:white; margin-bottom: 15px;font-size: 13px;">
                    <a class="bien-nom crd" style="cursor: pointer;">
                      ${bien?.nom}
                    </a>
                  </h3>`;
              // Vérifiez le statut du bien immobilier
              if (bien?.statut?.nom === 'A vendre') {
                content += `
                        <div class="row">
                          <div class="col">
                            <span class="Featured-text" style="background-color:#e98b11; font-weight: bold;">
                              ${bien?.statut?.nom}
                            </span>
                          </div>
                          <div class="col-6">
                            <span class="Featured-text" style="font-weight: bold; background-color: #dee2e7;color: #374b5c;">
                              ${bien?.typeImmo?.nom}
                            </span>
                          </div>
                        </div>`;
              } else if (bien?.statut?.nom === 'A louer') {
                content += `
                        <div class="row">
                          <div class="col-6">
                            <span class="Featured-text" style="font-weight: bold;">
                              ${bien?.statut?.nom}
                            </span>
                          </div>
                          <div class="col-6">
                              <span class="Featured-text" style="font-weight: bold; background-color: #dee2e7;color: #374b5c;">
                               ${bien?.typeImmo?.nom}
                              </span>
                          </div>
                        </div>`;
              }
              // Ajoutez les informations supplémentaires telles que l'adresse et le prix
              content += `
      <ul class="available-info mt-3">
        <li class="mapaddress">
          <i class="fas fa-map-marker-alt me-2"></i> ${bien?.adresse?.commune?.cercle?.nomcercle}, ${bien?.adresse?.quartier}
        </li>
        <li class="map-amount" style="color: #e98b11; font-weight: bold; margin-top:-27px">
          ${this.formatPrice(bien?.prix)} FCFA
        </li>
      </ul>
    `;

              // Fermez la partie pro-content
              content += `</div></div>`;

              // Ajoutez le contenu du popup au marqueur
              marker.bindPopup(content);

            

              return marker;
            })

            // Ajoutez les marqueurs à la carte Leaflet
            this.overlays.forEach(marker => marker.addTo(this.map));
          } else {
            // Aucun bien immobilier trouvé, centrer la carte sur une position par défaut
            this.map.setView([17.570692, -3.996166], 6);
          }
          // Mise à jour de la liste des biens immobiliers
          this.bienImmo = data;

          

          this.bienImmo = data;
          

          // Initialisation de favoritedPropertiesCount pour tous les biens immobiliers avec zéro favori.
          this.bienImmo.forEach((bien: {
            uuid: any;
            favoris: any
          }) => {
            // Charger le nombre de "J'aime" pour chaque bien
            // this.serviceBienImmo.ListeAimerBienParId(bien.id).subscribe(data => {
            this.NombreJaime = bien.favoris?.length;

            // if (typeof bien.uuid === 'number') {
              this.favoritedPropertiesCount1[bien.uuid] = this.NombreJaime;
            // }

            // Charger l'état de favori depuis localStorage
            const isFavorite = localStorage.getItem(`favoriteStatus_${bien.uuid}`);
            if (isFavorite === 'true') {
              this.favoriteStatus[bien.uuid] = true;
            } else {
              this.favoriteStatus[bien.uuid] = false;
            }
          });
        });

      // Nettoyer les marqueurs existants de la carte
      this.overlays.forEach(marker => this.map.removeLayer(marker));
      this.overlays = [];
    });

     }






  constructor(
    private Dataservice: DataService,
    private serviceBienImmo: BienimmoService,
    private router: Router,
    @Inject(LOCALE_ID) private localeId: string,
    private serviceUser: UserService,
    private serviceAdresse: AdresseService,
    private serviceConfigBien: configbienService,
    private storageService: StorageService,
    private serviceCommodite: CommoditeService,
    private route: ActivatedRoute
  ) {
    this.locale = localeId;
    this.mapgrid = this.Dataservice.mapgridList;
    this.categories = this.Dataservice.categoriesList;
    (this.categoriesDataSource = new MatTableDataSource(this.categories));
  }

  favoriteStatus: { [key: string]: boolean } = {};
  favoritedPropertiesCount1: { [bienId: number]: number } = {};
  toggleFavorite(bienId: number) {
    this.favoriteStatus[bienId] = !this.favoriteStatus[bienId];

    // Mettez à jour le nombre de favoris pour le bien immobilier actuel
    if (this.favoriteStatus[bienId]) {
      this.favoritedPropertiesCount1[bienId]++;
    } else {
      this.favoritedPropertiesCount1[bienId]--;
    }

    // Vous pouvez également ajouter ici la logique pour enregistrer l'état du favori côté serveur si nécessaire.
  }
  searchCategory(value: any): void {
    const filterValue = value;
    this.categoriesDataSource.filter = filterValue.trim().toLowerCase();
    this.categories = this.categoriesDataSource.filteredData;
  }

  updateUrl(): void {
    const queryParams: Params = {
      type: this.form.type,
      statut: this.form.statut,
      chambre: this.form.chambre,
      nb_piece: this.form.nb_piece,
      toilette: this.form.toilette,
      cuisine: this.form.cuisine,
      commune: this.form.commune,
      cercleForm: this.form.cercleForm,
      regionForm: this.form.regionForm,
      minprix: this.form.minprix,
      maxprix: this.form.maxprix,
      commodite: this.form.commodite
      // Ajoutez d'autres paramètres si nécessaire
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge' // Conserve les anciens paramètres d'URL
    });
  }


  ngOnInit(): void {
    // Écouter les changements de route
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Vérifier si la nouvelle route est "contact"
        if (this.router.url === '/trouverbien') {
          // Actualiser la page
          window.location.reload();
        }
      }
      if (!this.map) {
        this.initMap();
      }
    });
    // this.initMap();
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
    } else if (!this.storageService.isLoggedIn()) {
      this.isLoginFailed = false;
    }
    this.initSliderOptions();


    this.serviceCommodite.AfficherListeCommodite().subscribe((data) => {
      this.commodite = data;
    });

    //AFFICHER LA LISTE DES TYPES DE BIENS
    this.serviceConfigBien.AfficherListeTypeImmo().subscribe(data => {
      this.typebien = data;
    }
    );

    //AFFICHER LA LISTE DES STATUT DE BIENS
    this.serviceConfigBien.AfficherListeStatut().subscribe(data => {
      this.status = data;
    }
    );

    //AFFICHER LA LISTE DES REGIONS
    this.serviceAdresse.AfficherListeRegion().subscribe(data => {
      this.region = data;
    }
    );

    //AFFICHER LA LISTE DES REGIONS
    this.serviceAdresse.AfficherListeCercle().subscribe(data => {
      this.cercle = data;
    }
    );

    //AFFICHER LA LISTE DES COMMUNES
    this.serviceAdresse.AfficherListeCommune().subscribe(data => {
      this.commune = data;
    }
    );




    // this.overlays = [
    //   new google.maps.Marker({
    //     position: { lat: 12.6046407, lng: -7.9722873 },
    //     icon: 'assets/img/icons/marker7.png',
    //     doc_name: 'Appartement meuble 15/20',
    //     address: 'Sogoniko, Bamako',
    //     amount: '100000',
    //     image: 'assets/img/gallery/gallery1/gallery-1.jpg',
    //     statut: 'A louer',
    //     type: 'Appartement'
    //   }),
    //   new google.maps.Marker({
    //     position: { lat: 12.6153914, lng: -7.9679699 },
    //     icon: 'assets/img/icons/marker7.png',
    //     doc_name: 'Magasin a vendre',
    //     address: 'Magnambougou, Bamako',
    //     amount: '500000',
    //     image: 'assets/img/banner/maison.jpg',
    //     statut: 'A vendre',
    //     type: 'Villa'
    //   }),
    //   new google.maps.Marker({
    //     position: { lat: 12.6162202, lng: -7.9227909 },
    //     icon: 'assets/img/icons/marker7.png',
    //     doc_name: 'Villa a vendre',
    //     address: 'Yirimadjo, Bamako',
    //     amount: '700000',
    //     image: 'assets/img/banner/immo.jpg',
    //     statut: 'A vendre',
    //     type: 'Terrain'
    //   }),
    //   new google.maps.Marker({
    //     position: { lat: 12.6254203, lng: -8.0203158 },
    //     icon: 'assets/img/icons/marker7.png',
    //     doc_name: 'Maison a vendre',
    //     address: 'Sebenicoro, Bamako',
    //     amount: '200000',
    //     image: 'assets/img/banner/test1.jpg',
    //     statut: 'A vendre',
    //     type: 'Appartement'
    //   }),
    //   new google.maps.Marker({
    //     position: { lat: 12.5861475, lng: -7.9838534 },
    //     icon: 'assets/img/icons/marker7.png',
    //     doc_name: 'Villa a louer',
    //     address: 'Niamakoro, Bamako',
    //     amount: '400000',
    //     image: 'assets/img/banner/test2.jpg',
    //     statut: 'A louer',
    //     type: 'Appartement'
    //   }),
    //   new google.maps.Marker({
    //     position: { lat: 12.5232635, lng: -7.9469228 },
    //     icon: 'assets/img/icons/marker7.png',
    //     doc_name: 'Magasin à Loué',
    //     address: 'Senou, Bamako',
    //     amount: '600000',
    //     image: 'assets/img/banner/test3.jpg',
    //     statut: 'A louer',
    //     type: 'Appartement'
    //   }),
    //   new google.maps.Marker({
    //     position: { lat: 12.632193, lng: -8.0349542 },
    //     icon: 'assets/img/icons/marker7.png',
    //     doc_name: 'Magasin à louer au plein coeur ACI 2000',
    //     address: 'ACI 2000, Bamako',
    //     amount: '800000',
    //     image: 'assets/img/banner/bamako-slider.jpg',
    //     statut: 'A louer',
    //     type: 'Appartement'
    //   }),
    // ];
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS BIEN
  goToDettailBien(id: number) {
    return this.router.navigate(['details-bien', id])
  }

  onChangeCommodite() {
    if (this.commodite) {
      const commoditeArray = [];
      for (const item of this.commodite) {
        if (item.selected) {
          commoditeArray.push(item.id);
        }
      }
      this.form.commodite = commoditeArray;
    }
  }
  selectedStatut: string | null = null;

  onStatutChange(event: any) {
    this.selectedStatut = event.value;
  }
  onChangeRegion(newValue: any) {
    this.cercles = this.cercle.filter(
      (el: any) =>
        el.region.id == newValue.value || el.region.nomregion == newValue.value
    );
    this.cercles.forEach((el: any) => {
      this.form.regionForm = el.region.id;
    });

  }
  onChangeCercle(newValue: any) {
    this.communes1 = this.commune.filter(
      (el: any) =>
        el.cercle.id == newValue.value || el.cercle.nomcercle == newValue.value
    );
    this.communes1.forEach((el: any) => {
      this.form.cercleForm = el.cercle.id;

    });
  }


  // hasRole(roleName: string): boolean {
  //   return this.bienImmo.utilisateur.roles.some((role: { name: string; }) => role.name === roleName);
  // }
  hasRole(bien: any, roleName: string): boolean {
    return bien?.utilisateur?.roles?.some((role: { name: string }) => role.name === roleName);
  }


  //METHODE PERMETTANT D'AIMER UN BIEN 
  AimerBien(id: any): void {
    const user = this.storageService.getUser();
    if (user && user.token) {
      // Définissez le token dans le service commentaireService
      this.serviceUser.setAccessToken(user.token);

      // Appelez la méthode AimerBien() avec l'ID
      this.serviceBienImmo.AimerBien(id).subscribe(
        data => {

          // Mettez à jour le nombre de favoris pour le bien immobilier actuel
          if (this.favoriteStatus[id]) {
            this.favoriteStatus[id] = false; // Désaimé
            localStorage.removeItem(`favoriteStatus_${id}`);
            this.favoritedPropertiesCount1[id]--;
          } else {
            this.favoriteStatus[id] = true; // Aimé
            localStorage.setItem(`favoriteStatus_${id}`, 'true');
            this.favoritedPropertiesCount1[id]++;
          }
        },
        error => {

        }
      );
    } else {

    }
  }

  onSubmit(form: NgForm): void {
    const {
      commodite,
      type,
      commune,
      nb_piece,
      chambre,
      cuisine,
      toilette,
      regionForm,
      cercleForm,
      statut,
      maxprix,
      minprix
    } = this.form;
  }

  form: any = {
    commodite: null,
    type: null,
    commune: null,
    nb_piece: null,
    chambre: null,
    cuisine: null,
    toilette: null,
    statut: null,
    regionForm: null,
    cercleForm: null,
    maxprix: null,
    minprix: null
  };

  initSliderOptions() {
    this.serviceBienImmo.AfficherLaListePrix().subscribe(data => {
      this.customHtmlMaxValue = data[0]?.prix;
      this.customHtmlMinValue = data[data.length - 1]?.prix;

      // Mettez à jour automatiquement les valeurs du formulaire avec les valeurs du slider
      this.form.maxprix = this.customHtmlMaxValue;
      this.form.minprix = this.customHtmlMinValue;

      this.customHtmlSliderOptions = {
        floor: this.customHtmlMinValue,
        ceil: this.customHtmlMaxValue,
        translate: (value: number): string => {
          return this.formatPrice(value) + ' FCFA';
        }
      };
    });
  }
  updateMinPrice() {
    this.form.minprix = this.customHtmlMinValue;
    this.updateUrl();
  }

  updateMaxPrice() {
    this.form.maxprix = this.customHtmlMaxValue;
    this.updateUrl();
  }


}