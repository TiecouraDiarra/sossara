import { Component, ElementRef, HostListener, NgZone, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import * as Aos from 'aos';
import { routes } from 'src/app/core/helpers/routes/routes';
import { AdresseService } from 'src/app/service/adresse/adresse.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { CommoditeService } from 'src/app/service/commodite/commodite.service';
import { DataService } from 'src/app/service/data.service';
import Swal from 'sweetalert2';
declare var google: any;
import * as L from 'leaflet';
import { CaracteristiqueService } from 'src/app/service/caracteristique/caracteristique.service';
import { ContentChange, SelectionChange } from 'ngx-quill';
import { HttpClient } from '@angular/common/http';

interface Food {
  value: string | any;
  viewValue: string;
}
interface price {
  value: string | any;
  viewValue: string;
}

@Component({
  selector: 'app-ajouter-bien',
  templateUrl: './ajouter-bien.component.html',
  styleUrls: ['./ajouter-bien.component.css'],
})

// export class AjouterBienComponent {


export class AjouterBienComponent implements OnInit {
  selectedCategory: any = '';
  requiredFileType: any;
  maxImageCount: number = 0; // Limite maximale d'images
  isButtonDisabled: boolean = false; // Variable pour désactiver le bouton si la limite est atteinte
  les_commodite: any[] = [];
  commodite: any;
  adresse: any;
  region: any;
  statusBien: any;
  pays: any;
  commune: any;
  typebien: any;
  periode: any;
  bienImmo: any;
  BienLoueRecens: any;
  commodite1: any;
  commodite2: any;
  isLocataire = false;
  isAgence = false;
  isProprietaire = false;
  roles: string[] = [];
  commodite3: any;
  regions: any[] = [];
  cercles: any[] = [];
  communes: any = [];
  photo: File[] = [];
  image: File[] = [];
  images: File[] = [];
  fileName: any;
  valuesSelect: any = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  status: any[] = [];
  nombreZone: any;
  cercle: any;
  lesCommodite: any;
  caracteristique: any;
  profil: any;

  constructor(
    private DataService: DataService,
    public router: Router,
    private http: HttpClient,
    private serviceCommodite: CommoditeService,
    private storageService: StorageService,
    private userService: UserService,
    private caracteristiqueService: CaracteristiqueService,
    private elRef: ElementRef,
    private ngZone: NgZone,
    private el: ElementRef,
    private serviceAdresse: AdresseService,

    private serviceBienImmo: BienimmoService
  ) { }

  @HostListener('input', ['$event']) onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/,/g, ''); // Remove existing commas
    
    // Format the number with commas as thousand separators
    value = this.formatNumber(value);

    input.value = value;
  }

  private formatNumber(value: string): string {
    if (!value) return '';
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  public routes = routes;
  selectedValue: string | any = 'pays';
  selectedValueR: string | any = 'region';
  selectedValueC: string | any = 'cercle';
  fliesValues: any = [];
  valuesFileCurrent: String = 'assets/img/mediaimg-2.jpg';
  errorMessage: any = '';
  isSuccess: any = false;
  files: any = [];
  // photo: any;
  message: string | undefined;
  selectedFiles: any;
  imagesArray: string[] = []; // Array to store URLs of selected images
  private map!: L.Map;
  currentPolygon!: L.Polygon;
  isloadingB = false;

  //CHARGER L'IMAGE
  onFileSelected(event: any): void {
    const selectedFiles = event.target.files;
  
    for (const file of selectedFiles) {
      if (this.images.length < 8) {
        const reader = new FileReader(); // Créez un nouvel objet FileReader pour chaque fichier
  
        reader.onload = (e: any) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, img.width, img.height);
              canvas.toBlob((blob) => {
                if (blob) {
                  const webpFile = new File([blob], 'photo.webp', { type: 'image/webp' });
                  this.images.push(webpFile);
                  this.image.push(e.target.result); 
                  this.checkImageCount(); // Appel de la fonction pour vérifier la limite d'images
                  // this.maxImageCount = this.image.length;
                }
              }, 'image/webp', 0.8);
            }
          };
          img.src = e.target.result as string;
        };
  
        reader.readAsDataURL(file); 
      } // Vérifiez si la limite n'a pas été atteinte
    }
  
    this.form.photo = this.images;
    this.checkImageCount(); // Assurez-vous de vérifier à nouveau la limite après le traitement
  }
  


  // Fonction pour vérifier la limite d'images et désactiver le bouton si nécessaire
  checkImageCount(): void {
    if (this.images.length >= 8) {
      this.isButtonDisabled = true;
    } else {
      this.isButtonDisabled = false;
    }
  }

  onChangeCommodite() {
    if (this.lesCommodite) {
      const commoditeArray = [];
      for (const item of this.lesCommodite) {
        if (item.selected) {
          commoditeArray.push(item.id);
        }
      }
      this.form.commodite = commoditeArray;
      // console.log(this.form.commodite); // Vérifiez la sortie dans la console pour déboguer
    }
  }
  

  form: any = {
    commodite: null,
    type: null,
    caracteristique: null,
    commune: null,
    nb_piece: null,
    nom: null,
    chambre: null,
    cuisine: null,
    toilette: null,
    surface: null,
    prix: null,
    statut: null,
    description: null,
    quartier: null,
    periode: null,
    caution: null,
    avance: null,
    rue: null,
    porte: null,
    longitude: null,
    latitude: null,
    photo: null,
    commoditeChecked: false,
    selectedCommodities: [], // Nouveau tableau pour stocker les commodités sélectionnées
  };



  initMap() {

    // Ajouter une couche de tuiles OpenStreetMap
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Créer une icône personnalisée pour le marqueur
    var customIcon = L.icon({
      iconUrl: 'assets/img/iconeBien/localisations.svg',
      iconSize: [80, 80], // Taille de l'icône [largeur, hauteur]
      iconAnchor: [19, 38], // Point d'ancrage de l'icône [position X, position Y], généralement la moitié de la largeur et la hauteur de l'icône
      popupAnchor: [0, -38] // Point d'ancrage du popup [position X, position Y], généralement en haut de l'icône
    });

    this.map = L.map('map').setView([12.6489, -8.0008], 14).addLayer(tiles); // Définir une vue initiale

    tiles.addTo(this.map);
    // Créer un marqueur initial au centre de la carte
    const initialMarker = L.marker([12.6489, -8.0008], {
      icon: customIcon,
      draggable: true // Rend le marqueur draggable
    }).addTo(this.map);

    // Attachez un gestionnaire d'événements pour mettre à jour les coordonnées lorsque le marqueur est déplacé
    initialMarker.on('dragend', (markerEvent) => {
      const markerLatLng = markerEvent.target.getLatLng();
      this.form.latitude = markerLatLng.lat;
      this.form.longitude = markerLatLng.lng;

    });

    // Attachez un gestionnaire d'événements pour déplacer le marqueur lorsqu'il est cliqué
    initialMarker.on('click', () => {
      const newLatLng = L.latLng(
        initialMarker.getLatLng().lat + 0.001, // Déplacez le marqueur d'une petite quantité en latitude
        initialMarker.getLatLng().lng + 0.001 // Déplacez le marqueur d'une petite quantité en longitude
      );

      initialMarker.setLatLng(newLatLng);

      // Mettez à jour les coordonnées dans votre formulaire
      this.form.latitude = newLatLng.lat;
      this.form.longitude = newLatLng.lng;

    });
  }


  ngOnInit(): void {
    // this.initMap();
    // Écouter les changements de route
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Vérifier si la nouvelle route est "contact"
        if (this.router.url === '/userpages/ajouter-bien') {
          // Actualiser la page
          window.location.reload();
        }
      }
      if (!this.map) {
        this.initMap();
      }
    });
    // this.initMap();
    Aos.init({ disable: 'mobile' });
    if (this.storageService.isLoggedIn()) {
      // this.isLoggedIn = true;
      this.userService.AfficherUserConnecter().subscribe((data) => {
        this.profil = data[0]?.profil;
        if (this.profil == 'LOCATAIRE') {
          this.isLocataire = true;
        } else if (this.profil == 'AGENCE' ) {
          this.isAgence = true; 
        } else if (this.profil == 'AGENT') {
          // this.isAgent = true
        } else if (this.profil == 'PROPRIETAIRE') {
          this.isProprietaire = true
        }
      })
      // if (this.roles[0] == 'ROLE_LOCATAIRE') {
      //   this.isLocataire = true;
      // } else if (this.roles[0] == 'ROLE_AGENCE') {
      //   this.isAgence = true;
      // } else if (this.roles.includes("ROLE_PROPRIETAIRE")) {
      //   this.isProprietaire = true
      // }
    }

    //AFFICHER LA LISTE DES COMMODITES
    // this.serviceCommodite.AfficherLaListeCommodite().subscribe((data) => {
    //   // this.les_commodite = data.commodite;
    //   this.adresse = data;
    //   // this.pays = data.pays;
    //   // this.region = data.region;
    //   // this.commune = data.commune;
    //   // this.typebien = data.type;
    //   this.periode = data.periode;
    // });
    this.serviceCommodite.AfficherListeCommodite().subscribe((data) => {
      this.lesCommodite = data;
    });
    //AFFICHER LA LISTE DES COMMUNES
    this.serviceAdresse.AfficherListeCommune().subscribe((data) => {
      this.commune = data;
    });
    //AFFICHER LA LISTE DES Pays
    this.serviceAdresse.AfficherListePays().subscribe((data) => {
      this.pays = data;
    });
    //AFFICHER LA LISTE DES CERCLE
    this.serviceAdresse.AfficherListeCercle().subscribe((data) => {
      this.cercle = data;
    });

    //AFFICHER LA LISTE DES CARACTERISTIQUE
    this.caracteristiqueService.AfficherCaracteristique().subscribe((data) => {
      this.caracteristique = data;
    });

    //AFFICHER LA LISTE DES REGIONS
    this.serviceAdresse.AfficherListeRegion().subscribe((data) => {
      this.region = data;
      this.nombreZone = data.length;
    });

    //AFFICHER LA LISTE DES TYPEBIEN
    this.serviceAdresse.AfficherListeTypeBien().subscribe((data) => {
      this.typebien = data;
    });

    //AFFICHER LA LISTE DES PERIODES
    this.serviceAdresse.AfficherListePeriode().subscribe((data) => {
      this.periode = data;
    });
    //AFFICHER LA LISTE DES PERIODES
    this.serviceAdresse.AfficherListeStatutBien().subscribe((data) => {
      this.status = data;
    });


  }

  selectedCountry: any
  selectedRegion: any
  selectedCercle: any
  selectedCommune: any

  onChange(event: any) {
    this.selectedCountry = event.value;
    this.regions = this.region.filter(
      (el: any) => el.pays.nompays === this.selectedCountry
    );
    this.cercles = [];
    this.communes = [];

    this.updateMapWithPolygon(`country=${this.selectedCountry}`, 6);
  }
 
  onChangeRegion(event: any) {
    this.selectedRegion = event.value;
    this.cercles = this.cercle.filter(
      (el: any) => el.region.nomregion === this.selectedRegion
    );
    this.communes = [];

    this.updateMapWithPolygon(`state=${this.selectedRegion}`, 12);
  }

  onChangeCercle(event: any) {
    this.selectedCercle = event.value;
    this.communes = this.commune.filter(
      (el: any) => el.cercle.nomcercle === this.selectedCercle
    );

    this.updateMapWithPolygon(`city=${this.selectedCercle}`, 12);
  }

  onChangeCommune(event: any) {
    this.selectedCommune = event.value;
    const selectedCercle = this.selectedCercle; // Récupérez le cercle sélectionné à partir d'une variable définie dans votre composant
    const selectedRegion = this.selectedRegion; // Récupérez la région sélectionnée à partir d'une variable définie dans votre composant
    const selectedCountry = this.selectedCountry; // Récupérez le pays sélectionné à partir d'une variable définie dans votre composant

    const query = `country=${selectedCountry}&state=${selectedRegion}&city=${selectedCercle},${this.selectedCommune}`;
    this.updateMapWithPolygon(query, 14);
  }

  onChangeQuartier(event: any) {
    const selectedQuartier = event.target.value;
    const selectedRegion = this.selectedRegion; // Récupérez la région sélectionnée à partir d'une variable définie dans votre composant
    const selectedCountry = this.selectedCountry; // Récupérez le pays sélectionné à partir d'une variable définie dans votre composant


    const query = `country=${selectedCountry}&state=${selectedRegion}&city=${selectedQuartier}`;
    this.updateMapWithPolygon(query, 12);
  }


  updateMapWithPolygon(query: string, zoomLevel: number) {
    const url = `https://nominatim.openstreetmap.org/search?${query}&format=json&polygon_geojson=1&limit=1`;

    this.http.get(url).subscribe((response: any) => {
      if (response && response.length > 0) {
        // Créer une icône personnalisée pour le marqueur
        const coordinates = response[0];
        const lat = coordinates.lat;
        const lon = coordinates.lon;
        const geojson = coordinates.geojson;

        this.map.setView([lat, lon], zoomLevel);

        if (this.currentPolygon) {
          this.map.removeLayer(this.currentPolygon);
        }

        // Créer une icône personnalisée pour le marqueur
        // var customIcon = L.icon({
        //   iconUrl: 'assets/img/iconeBien/localite.png',
        //   iconSize: [80, 80], // Taille de l'icône [largeur, hauteur]
        //   iconAnchor: [19, 38], // Point d'ancrage de l'icône [position X, position Y], généralement la moitié de la largeur et la hauteur de l'icône
        //   popupAnchor: [0, -38] // Point d'ancrage du popup [position X, position Y], généralement en haut de l'icône
        // });

        // // Ajouter un marqueur aux coordonnées
        // const marker = L.marker([lat, lon], {
        //   icon: customIcon,
        // }).addTo(this.map);

        if (geojson && geojson.type === 'Polygon') {
          this.currentPolygon = L.polygon(geojson.coordinates[0].map((coord: number[]) => [coord[1], coord[0]]));
          this.currentPolygon.addTo(this.map);
        }
      }
    });
  }

  selectedStatut: any | null = null;
  selectedType: any | null = null;
  //METHODE PERMETTANT DE CHANGER LES STATUTS
  onStatutChange(event: any) {
    this.selectedStatut = event.value;
    if (this.selectedStatut === 2) {
      this.form.periode = ''; // Mettre la période à null si le statut est "A vendre"
      this.form.caution='';
      this.form.avance='';
      this.form.surface='';
      this.form.caracteristique='';
    }
  }

  //METHODE PERMETTANT DE CHANGER LES TYPES
  onTypeChange(event: any) {
    this.selectedType = event.value;
    if (this.selectedType === 3 || this.selectedType===5) {
      this.resetform(); // Mettre le statut à null si le statut est "A vendre"
    }
    if(this.selectedType!=3 || this.selectedType!=0){
      this.form.surface=0
    }
  }

  selectedStatutMensuel: any | null = null;
  //METHODE PERMETTANT DE CHANGER LES STATUTS
  onStatutChangeMensuel(event: any) {
    this.selectedStatutMensuel = event.value;
    if (this.selectedStatut === 2) {
      this.form.caution = ''; // Mettre le caution à null si le statut est "A vendre"
      this.form.avance = ''; // Mettre l'avance à null si le statut est "A vendre"
    }
    this.form.caution = ''; // Mettre le caution à null si le statut est "A vendre"
    this.form.avance = ''; 

  }



  // onFileSelected(newValue: any) {
  //   this.files.push(newValue.target.files[0]);
  //   this.valuesFileCurrent = newValue.target.value;
  // }
  onSubmit(form: NgForm): void {
    const {
      commodite,
      type,
      caracteristique,
      commune,
      nb_piece,
      nom,
      chambre,
      cuisine,
      toilette,
      surface,
      prix,
      statut,
      description,
      quartier,
      rue,
      porte,
      periode,
      caution,
      avance,
      longitude,
      latitude,
      photo,
    } = this.form;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'swal2-confirm btn',
        cancelButton: 'swal2-cancel btn',
      },
      heightAuto: false,
    });



    if (
      this.form.commodite === null &&
      this.form.type === null &&
      this.form.commune === null &&
      this.form.nom === null &&
      this.form.prix === null &&
      this.form.statut === null &&
      this.form.description === null &&
      this.form.quartier === null &&
      this.form.photo === null
    ) {
      swalWithBootstrapButtons.fire(
        (this.message = ' Tous les champs sont obligatoires !')
      );

    }else if (this.form.nom === null) {
      swalWithBootstrapButtons.fire(
        this.message = 'Le nom du bien est obligatoire !',
      );
    }else if (this.form.prix === null) {
      swalWithBootstrapButtons.fire(
        this.message = 'Le prix du bien est obligatoire !',
      );
    } else if (this.form.description === null) {
      swalWithBootstrapButtons.fire(
        this.message = 'La description du bien est obligatoire !',
      );
    }else if (this.form.type === null) {
      swalWithBootstrapButtons.fire(
        this.message = 'Le type du bien est obligatoire !',
      );
    }else if (this.form.statut === null) {
      swalWithBootstrapButtons.fire(
        this.message = 'Le statut du bien est obligatoire !',
      );
    }else if (this.form.commodite === null || this.form.commodite.length === 0) {
      swalWithBootstrapButtons.fire(
        this.message = 'Choisir au moins une commodité !',
      );
    }else if (this.form.commune === null) {
      swalWithBootstrapButtons.fire(
        this.message = 'Adresse du bien est obligatoire !',
      );
    } else if (this.form.quartier === null) {
      swalWithBootstrapButtons.fire(
        this.message = 'Le quartier du bien est obligatoire !',
      );
    }else if (this.form.longitude === null || this.form.latitude === null) {
      swalWithBootstrapButtons.fire(
        this.message = 'Faites glisser le marker sur la carte pour positionner précisément votre bien !',
      );
    } else if (this.form.photo === null) {
      swalWithBootstrapButtons.fire(
        this.message = 'Choisir au moins une photo du bien !',
      );
    } else {
      swalWithBootstrapButtons
        .fire({ 
          text: 'Etes-vous sûre de bien vouloir creer ce bien ?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Confirmer',
          cancelButtonText: 'Annuler',
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.isloadingB = true;
            const user = this.storageService.getUser();
            if (user && user.token) {
              const monprix = prix.replace(/\,/g, '');
              this.serviceBienImmo.setAccessToken(user.token);
              this.serviceBienImmo
                .registerBien(
                  commodite,
                  type,
                  caracteristique,
                  commune,
                  nb_piece,
                  nom,
                  chambre,
                  cuisine,
                  toilette,
                  surface,
                  monprix,
                  statut,
                  description,
                  quartier,
                  rue,
                  porte,
                  periode,
                  caution,
                  avance,
                  longitude,
                  latitude,
                  photo
                )
                .subscribe({
                  next: (data) => {
                    this.isSuccess = false;
                    // this.popUpConfirmation();
                    if (data.status) {
                      this.isloadingB = false;
                      let timerInterval = 2000;
                      Swal.fire({
                        position: 'center',
                        text: data.message,
                        title: "Création du bien",
                        icon: 'success',
                        heightAuto: false,
                        showConfirmButton: false,
                        confirmButtonColor: '#e98b11',
                        showDenyButton: false,
                        showCancelButton: false,
                        allowOutsideClick: false,
                        timer: timerInterval,
                        timerProgressBar: true,
                      }).then(() => {
                        this.path();
                      });
                    } else {
                      Swal.fire({
                        position: 'center',
                        text: data.message,
                        title: 'Erreur',
                        icon: 'error',
                        heightAuto: false,
                        showConfirmButton: true,
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#e98b11',
                        showDenyButton: false,
                        showCancelButton: false,
                        allowOutsideClick: false,
                      }).then((result) => { });
                    }
                  },
                  error: (err) => {
                    this.isloadingB = false;
                    this.errorMessage = err.error.message;
                    this.isSuccess = true;
                  },
                });
            } else {
              this.isloadingB = false;
            }
          }
        });
    }
  }
  

  onKeyPress(event: any) {
    const pattern = /[0-9\ \+\-]/;
    let inputChar = String.fromCharCode(event.charCode);
  
    if (!pattern.test(inputChar)) {
      // Caractère non numérique, empêcher l'entrée
      event.preventDefault();
    }
  
    // Insérer un espace après chaque trio de chiffres
    let inputValue = event.target.value.replace(/\s/g, ''); // Supprimer les espaces existants
    let formattedValue = '';
    for (let i = inputValue.length; i > 0; i -= 3) {
      formattedValue = ',' + inputValue.slice(Math.max(i - 3, 0), i) + formattedValue;
    }
    // Supprimer l'espace initial s'il dépasse la limite de 1000 caractères
    formattedValue = formattedValue.slice(0, 1000);
  
    // Mettre à jour la valeur dans l'input
    event.target.value = formattedValue;
  }
  
  
  formatPrice(price: number): string {
    return price?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  

  //POPUP APRES CONFIRMATION
  popUpConfirmation() {
    let timerInterval = 2000;
    Swal.fire({
      position: 'center',
      text: 'Bien cree avec succès.',
      title: 'Creation de bien',
      icon: 'success',
      heightAuto: false,
      showConfirmButton: false,
      // confirmButtonText: "OK",
      confirmButtonColor: '#e98b11',
      showDenyButton: false,
      showCancelButton: false,
      allowOutsideClick: false,
      timer: timerInterval, // ajouter le temps d'attente
      timerProgressBar: true, // ajouter la barre de progression du temps
    }).then((result) => {
      this.path();
      // Après avoir réussi à candidater, mettez à jour l'état de la candidature
    });
  }
  path() {
    this.router.navigate([routes.mylisting]);
  }

  removeImage(index: number) {
    this.image.splice(index, 1); // Supprime l'image du tableau
    this.images.splice(index, 1); // Supprime le fichier du tableau 'images'
    this.checkImageCount(); // Appelle la fonction pour vérifier la limite d'images après la suppression
  }

  // onPhotosSelected(event: any): void {
  //   if (event.target.files && event.target.files.length > 0) {
  //     this.photo = Array.from(event.target.files);
  //   } else {
  //     this.photo = [];
  //   }
  // }

  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['code-block'],
        //  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        //  [{ 'direction': 'rtl' }],                         // text direction

        //  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'align': [] }],

        //  ['clean'],                                         // remove formatting button

        //  ['link'],
        ['link', 'image', 'video']
      ],
    },
  }

  onSelectionChanged = (event: SelectionChange) => {
    if (event.oldRange == null) {
      this.onFocus();
    }
    if (event.range == null) {
      this.onBlur();
    }
  }

  onContentChanged = (event: ContentChange) => {
  }

  onFocus = () => {
  }
  onBlur = () => {
  }



  resetform() {
    this.form.statut = ''; // Réinitialise le champ nomAgence*
    this.form.porte ='';
    this.form.nb_piece='';
    this.form.cuisine='';
    this.form.chambre='';
    this.form.toilette='';
    this.form.rue='';
    this.form.caution='';
    this.form.avance='';
    this.form.periode='';
}
}
