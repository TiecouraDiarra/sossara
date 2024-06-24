import { ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';
import Swal from 'sweetalert2';
import * as L from 'leaflet';
import { routes } from 'src/app/core/helpers/routes/routes';
import { ActivatedRoute, Router } from '@angular/router';
import { CommoditeService } from 'src/app/service/commodite/commodite.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { AdresseService } from 'src/app/service/adresse/adresse.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { environment } from 'src/app/environments/environment';
import { CaracteristiqueService } from 'src/app/service/caracteristique/caracteristique.service';
import { ContentChange, SelectionChange } from 'ngx-quill';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-modifier-bien',
  templateUrl: './modifier-bien.component.html',
  styleUrls: ['./modifier-bien.component.scss'],
})
export class ModifierBienComponent {
  selectedCategory: any = '';
  public routes = routes;
  public albumsOne: any = [];
  public albumsTwo: any = [];
  bien: any;
  les_commodite: any[] = [];
  cercles: any[] = [];
  cercle: any;
  pays: any;
  commune: any;
  nombien: any;
  typebien: any;
  bienImmo: any;
  region: any;
  adresse: any;
  id: any;
  commodite: any;
  errorMessage: any = '';
  isSuccess: any = false;
  isError: any = false;
  isLoggedIn = false;
  isLoginFailed = true;
  regions: any = [];
  communes: any = [];
  selectedValue: string | any = 'pays';
  selectedValueR: string | any = 'region';
  selectedValueC: string | any = 'cercle';
  image: File[] = [];
  images: File[] = [];
  idBien: any;
  nombreZone: any;
  usage: any;
  users: any;
  latitude: any;
  longitude: any;
  description: any;
  status: any = ['A louer', 'A vendre'];
  type: any;
  valuesSelect: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  selectedFiles: any;
  isButtonDisabled: boolean = false;
  maxImageCount: number = 0;
  message: string | undefined;
  periode: any;
  currentUser: any = false;
  ModifBien: any = false;
  isLocataire = false;
  isAgence = false;
  isProprietaire = false;
  roles: string[] = [];
  selectedStatutMensuel: any | null = null;
  selectedStatut: any | null = null;
  photos: any;
  caracteristique: any;
  selectedType: any | null = null;
    isloadingB = false;
  profil: any;
  currentUser2: any;

  // Supposons que vous ayez une méthode pour charger les types de biens
  loadTypeBiens() {
    // Code pour charger les types de biens depuis une source de données (API, service, etc.)
    // Par exemple, vous pouvez utiliser une méthode dans votre service
    //AFFICHER LA LISTE DES TYPEBIEN
    this.serviceAdresse.AfficherListeTypeBien().subscribe((data) => {
      this.typebien = data;
    });
  }

  //METHODE PERMETTANT DE CHANGER LES TYPES
  // onTypeChange(event: any) {
  //   this.selectedType = event.value;
  //   if (this.selectedType === 3) {
  //     this.form.statut = null; // Mettre le statut à null si le statut est "A vendre"
  //   }
  // }
  onTypeChange(event: any) {
    // Assurez-vous que les données du type de bien sont chargées
    // if (!this.typebien) {
    //   this.loadTypeBiens();
    //   return;
    // }
    this.selectedType = event.value;
    // this.selectedStatut = '2'

    if (this.selectedType === 3 || this.selectedType===5) {
      this.form.statut = null; // Mettre le statut à null si le statut est "A vendre"
      this.form.caution = 0; // Envoyer la valeur 0 si le type de bien est un terrain
      this.form.avance = 0; // Envoyer la valeur 0 si le type de bien est un terrain
      this.form.chambre = 0; // Envoyer la valeur 0 si le type de bien est un terrain
      this.form.cuisine = 0; // Envoyer la valeur 0 si le type de bien est un terrain
      this.form.toilette = 0; // Envoyer la valeur 0 si le type de bien est un terrain
      this.form.nb_piece = 0; // Envoyer la valeur 0 si le type de bien est un terrain
      this.form.porte = ''; // Envoyer la valeur 0 si le type de bien est un terrain
      this.form.rue = ''; // Envoyer la valeur 0 si le type de bien est un terrain
      this.form.periode = '';
    }
    if(this.selectedType!=3 || this.selectedType!=0){
      this.form.surface=0
    }
  }

  form: any = {
    commodite: null,
    type: null,
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
    rue: null,
    porte: null,
    periode: null,
    longitude: null,
    latitude: null,
    photo: null,
    caution: null,
    avance: null,
    commoditeChecked: false,
    selectedCommodities: [], // Nouveau tableau pour stocker les commodités sélectionnées
  };
  images1: any;

  constructor(
    public router: Router,
    private storageService: StorageService,
    private serviceAdresse: AdresseService,
    private caracteristiqueService: CaracteristiqueService,
    private route: ActivatedRoute,
    private serviceCommodite: CommoditeService,
    private cdRef: ChangeDetectorRef,
    private serviceUser: UserService,
    private serviceBienImmo: BienimmoService
  ) {
   
  }
  selectedCommodites: { [key: string]: boolean } = {};



  ngOnInit(): void {
    // if (this.storageService.isLoggedIn()) {
    //   // this.isLoggedIn = true;
    //   if (this.roles[0] == 'ROLE_LOCATAIRE') {
    //     this.isLocataire = true;
    //   } else if (this.roles[0] == 'ROLE_AGENCE') {
    //     this.isAgence = true;
    //   } else if (this.roles.includes('ROLE_PROPRIETAIRE')) {
    //     this.isProprietaire = true;
    //   }
    // }
    if (this.storageService.isLoggedIn()) {
      // Récupérer les données de l'utilisateur connecté
    this.serviceUser.AfficherUserConnecter().subscribe((data) => {
      this.profil = data[0]?.profil;
      this.currentUser2= data[0]
      if (this.profil == 'LOCATAIRE') {
        this.isLocataire = true;
      } else if (this.profil == 'AGENCE' ) {
        this.isAgence = true; 
      } else if (this.profil == 'AGENT') {
        
      } else if (this.profil == 'PROPRIETAIRE') {
        this.isProprietaire = true;
      }else {
      }
    })
      // }
    }

    //RECUPERER L'ID D'UN BIEN
    this.id = this.route.snapshot.params['uuid'];
     //RECUPERER L'ID D'UN BIEN
     this.id = this.route.snapshot.params['uuid'];
     //AFFICHER UN BIEN IMMO EN FONCTION DE SON ID
     this.serviceBienImmo.AfficherBienImmoParId(this.id).subscribe((data) => {
       this.bien = data;
       console.log(this.bien);
       
       setTimeout(() => {
         this.form = {
           nom: this.bien?.nom,
           description: this.bien?.description,
           type: this.bien?.typeImmo?.id,
           caracteristique: this.bien?.caracteristique?.id,
           surface: this.bien?.surface,
           periode: this.bien?.periode?.id,
           porte: this.bien?.adresse?.porte,
           rue: this.bien?.adresse?.rue,
           quartier: this.bien?.adresse?.quartier,
           statut: this.bien?.statut?.id,
           prix: this.bien?.prix,
           toilette: this.bien?.toilette,
           nb_piece: this.bien?.nb_piece,
           cuisine: this.bien?.cuisine,
           chambre: this.bien?.chambre,
           reference: this.bien?.reference,
           longitude: this.bien?.adresse?.longitude,
           latitude: this.bien?.adresse?.latitude,
           commune: this.bien?.adresse?.commune?.id,
           pays: this.bien?.adresse?.commune?.cercle?.region?.pays?.id,
           region: this.bien?.adresse?.commune?.region?.id,
           caution: this.bien?.caution,
           avance: this.bien?.avance,
         };
         this.selectedType = this.form.type
         this.selectedStatut = this.form.statut
         this.selectedStatutMensuel = this.form.periode 

         this.serviceCommodite.AfficherListeCommodite().subscribe((data) => {
          this.les_commodite = data;
          console.log(this.les_commodite);
          this.cdRef.detectChanges(); // Force detection of changes
          
  
          if (this.bien && this.bien.commodites) {
  
            for (const commodite of this.les_commodite) {
              commodite.selected = this.bien.commodites.some(
                (bienCommodite: any) => bienCommodite.id === commodite.id
              );
            }
  
            // Récupérer la liste des IDs des commodités sélectionnées
            const selectedCommoditesIds = this.les_commodite
              .filter(commodite => commodite.selected)
              .map(commodite => commodite.id);
  
            // Mettre à jour this.form.commodite avec la liste des IDs
            this.form.commodite = selectedCommoditesIds.length > 0 ? selectedCommoditesIds : null;
          }
        });


    // this.serviceCommodite.AfficherListeCommodite().subscribe((commodites) => {
    //   this.les_commodite = commodites;

    //   if (this.bien && this.bien.commodites) {
    //     for (const commodite of this.les_commodite) {
    //       commodite.selected = this.bien.commodites.some(
    //         (bienCommodite: any) => bienCommodite.id === commodite.id
    //       );
    //     }

    //     this.form.commodite = this.les_commodite
    //       .filter((commodite) => commodite.selected)
    //       .map((commodite) => commodite.id);

    //   }
      
    // });
        //  this.serviceCommodite.AfficherListeCommodite().subscribe((data) => {
        //    this.les_commodite = data;
 
        //    // Parcourez les commodités et pré-sélectionnez celles liées au bien
        //    for (const commodite of this.les_commodite) {
        //      commodite.selected = this.bien.commodites.some(
        //        (bienCommodite: any) => bienCommodite.id === commodite.id
        //      );
        //    }
        //  });
       });
     });    
    //AFFICHER UN BIEN IMMO EN FONCTION DE SON ID
    this.serviceBienImmo.AfficherBienImmoParId(this.id).subscribe((data) => {
      this.bien = data;
      this.selectedValue =
        this.bien?.adresse.commune?.cercle?.region?.pays?.nompays;
      this.selectedValueR =
        this.bien?.adresse.commune?.cercle?.region?.nomregion;
      this.selectedValueC = this.bien?.adresse.commune?.cercle?.nomcercle;
      this.selectedStatut = this.bien?.statut?.id;
      this.selectedStatutMensuel = this.bien?.periode?.id;



      // Récupération de la liste des commodités


      this.photos = this.bien?.photos;
      this.photos = this.bien?.photos;
      this.images1 = this.bien?.photos.map((photo: { nom: string }) => ({
        nom: photo.nom,
        data: this.generateImageUrl(photo.nom),
      }));
      this.latitude = this.bien.adresse.latitude;
      this.longitude = this.bien.adresse.longitude;
      this.currentUser2 = this.storageService.getUser();
      if (
        this.currentUser2 &&
        this.bien &&
        this.currentUser2?.email === this.bien?.utilisateur?.email
      ) {
        this.currentUser = true;
        this.ModifBien = true;
      }

      for (const photo of this.photos) {
        const src = this.generateImageUrl(photo.nom); // Utilisez 'this.generateImageUrl'
        const caption = 'Caption for ' + photo.nom;

        this.albumsOne.push({ src: src, caption: caption });
        this.albumsTwo.push({ src: src, caption: caption });
      }

      // Vérifiez si la latitude est null, si c'est le cas, utilisez une valeur par défaut
      if (this.latitude == null) {
        this.latitude = 12.639231999999997;
      }

      // Vérifiez si la longitude est null, si c'est le cas, utilisez une valeur par défaut
      if (this.longitude == null) {
        this.longitude = -7.998184000000001;
      }

      // Options de la carte
      const mapOptions = {
        center: { lat: this.latitude, lng: this.longitude }, // Coordonnées du centre de la carte
        zoom: 15, // Niveau de zoom initial
      };

      // Ajouter une couche de tuiles OpenStreetMap
      const tiles = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 18,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      );

      // Créer une icône personnalisée pour le marqueur
      var customIcon = L.icon({
        iconUrl: 'assets/img/iconeBien/localisations.svg',
        iconSize: [80, 80], // Taille de l'icône [largeur, hauteur]
        iconAnchor: [19, 38], // Point d'ancrage de l'icône [position X, position Y], généralement la moitié de la largeur et la hauteur de l'icône
        popupAnchor: [0, -38], // Point d'ancrage du popup [position X, position Y], généralement en haut de l'icône
      });
      const map = L.map('map')
        .setView([this.latitude, this.longitude], 12)
        .addLayer(tiles); // Définir une vue initiale;
      tiles.addTo(map);
      // Créer un marqueur initial au centre de la carte
      const initialMarker = L.marker([this.latitude, this.longitude], {
        icon: customIcon,
        draggable: true, // Rend le marqueur draggable
      }).addTo(map);
      // Attachez un gestionnaire d'événements pour mettre à jour les coordonnées lorsque le marqueur est déplacé
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
    });
    //AFFICHER LA LISTE DES PERIODES
    this.serviceAdresse.AfficherListeStatutBien().subscribe((data) => {
      this.status = data;
    });
    //AFFICHER LA LISTE DES TYPEBIEN
    this.serviceAdresse.AfficherListeTypeBien().subscribe((data) => {
      this.typebien = data;
    });

    //AFFICHER LA LISTE DES CARACTERISTIQUE
    this.caracteristiqueService.AfficherCaracteristique().subscribe((data) => {
      this.caracteristique = data;
    });

    //AFFICHER LA LISTE DES COMMUNES
    this.serviceAdresse.AfficherListeCommune().subscribe((data) => {
      this.commune = data;
      if (this.selectedValueC) {
        this.communes = this.commune.filter(
          (el: any) => el.cercle.nomcercle == this.selectedValueC
        );
      }
    });
    //AFFICHER LA LISTE DES Pays
    this.serviceAdresse.AfficherListePays().subscribe((data) => {
      this.pays = data;
    });
    //AFFICHER LA LISTE DES CERCLE
    this.serviceAdresse.AfficherListeCercle().subscribe((data) => {
      this.cercle = data;
      if (this.selectedValueR) {
        this.cercles = this.cercle.filter(
          (el: any) => el.region.nomregion == this.selectedValueR
        );
      }
    });

    //AFFICHER LA LISTE DES PERIODES
    this.serviceAdresse.AfficherListePeriode().subscribe((data) => {
      this.periode = data;
    });

    //AFFICHER LA LISTE DES REGIONS
    this.serviceAdresse.AfficherListeRegion().subscribe((data) => {
      this.region = data;
      this.nombreZone = data.length;
      if (this.selectedValue) {
        this.regions = this.region.filter(
          (el: any) => el.pays.nompays == this.selectedValue
        );

      }
    });
  }

  onChange(newValue: any) {
    this.regions = this.region.filter(
      (el: any) => el.pays.nompays == newValue.value
    );
  }

  onChangeRegion(newValue: any) {
    this.cercles = this.cercle.filter(
      (el: any) => el.region.nomregion == newValue.value
    );
  }

  onChangeCercle(newValue: any) {
    this.communes = this.commune.filter(
      (el: any) => el.cercle.nomcercle == newValue.value
    );
  }

  //CHARGER L'IMAGE
  onFileSelected(event: any): void {
    const selectedFiles = event.target.files;

    for (const file of selectedFiles) {
      if (this.images1.length < 98) {
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
                  // Change l'extension du fichier en WebP
                  const webpFile = new File([blob], this.changeExtension(file.name, 'webp'), { type: 'image/webp' });
                  const readerWebp = new FileReader();
                  readerWebp.onload = (eWebp: any) => {
                    this.images1.push({ nom: webpFile.name, data: eWebp.target.result });
                    this.checkImageCount(); // Appel de la fonction pour vérifier la limite d'images
                    // this.maxImageCount = this.images1.length;
                  };
                  readerWebp.readAsDataURL(webpFile);
                }
              }, 'image/webp', 0.8);
            }
          };
          img.src = e.target.result as string;
        };

        reader.readAsDataURL(file);
      } // Vérifiez si la limite n'a pas été atteinte
    }

    this.form.photo = this.images1; // Utilisez this.images1 pour assigner les images au formulaire
    this.checkImageCount(); // Assurez-vous de vérifier à nouveau la limite après le traitement
  }

  // Fonction pour changer l'extension du fichier
  changeExtension(filename: string, newExtension: string): string {
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return filename + '.' + newExtension;
    } else {
      return filename.substr(0, lastDotIndex) + '.' + newExtension;
    }
  }

  removeImage(index: number) {
    this.images1.splice(index, 1); // Supprime l'image du tableau
    this.checkImageCount(); // Appelle la fonction pour vérifier la limite d'images après la suppression
  }
  // Fonction pour vérifier la limite d'images et désactiver le bouton si nécessaire
  checkImageCount(): void {
    if (this.images.length >= 78000) {
      this.isButtonDisabled = true;
    } else {
      this.isButtonDisabled = false;
    }
  }

  //METHODE PERMETTANT DE CHANGER LES STATUTS
  onStatutChangeMensuel(event: any) {
    this.selectedStatutMensuel = event.value;
    if (this.selectedStatut === '2') {
      this.form.caution = ''; // Mettre le caution à null si le statut est "A vendre"
      this.form.avance = ''; // Mettre l'avance à null si le statut est "A vendre"
    }
    this.form.caution = ''; // Mettre le caution à null si le statut est "A vendre"
    this.form.avance = ''; 
  }

  //METHODE PERMETTANT DE CHANGER LES STATUTS
  onStatutChange(event: any) {
    this.selectedStatut = event.value;
    if (this.selectedStatut === 2) {
      this.form.periode = ''; // Mettre la période à null si le statut est "A vendre"
      this.form.caution = '';
      this.form.avance = '';
      this.form.surface='';
      this.form.caracteristique='';
    }
  }

  onChangeCommodite() {
    if (this.les_commodite) {
      const commoditeArray = [];
      for (const item of this.les_commodite) {
        if (item.selected) {
          commoditeArray.push(item.id);
        }
      }
      this.form.commodite = commoditeArray;
    }
  }
  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO;
    return baseUrl + photoFileName;
  }

  //MODIFIER UN BIEN
  ModifierBien(): void {
    //RECUPERER L'ID D'UN BIEN
    this.id = this.route.snapshot.params['uuid'];
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
      this.form.caracteristique === null &&
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
    }else if (this.form.caracteristique === null) {
      swalWithBootstrapButtons.fire(
        this.message = 'La caractéristique du bien est obligatoire !',
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
          text: 'Etes-vous sûre de bien vouloir modifier ce bien ?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Confirmer',
          cancelButtonText: 'Annuler',
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            this.isloadingB = true;
            const images = this.images1;
            const files = await this.convertURLsToFiles(images);
            const user = this.storageService.getUser();
            if (user && user.token) {
              this.serviceBienImmo.setAccessToken(user.token);
              this.serviceBienImmo
                .ModifierBien(
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
                  files,
                  this.id
                )
                .subscribe({
                  next: (data) => {
                    this.isSuccess = false;
                    // this.popUpConfirmationModification();
                    // this.router.navigate(['details-bien', this.id]);
                    if (data.status) {
                      this.isloadingB = false;
                      let timerInterval = 2000;
                      Swal.fire({
                        position: 'center',
                        text: data.message,
                        title: "Modification du bien",
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
                        this.router.navigate(['details-bien', this.id]);
                        //RECUPERER L'ID D'UN BIEN
                        this.id = this.route.snapshot.params['id'];

                        //AFFICHER UN BIEN IMMO EN FONCTION DE SON ID
                        this.serviceBienImmo.AfficherBienImmoParId(this.id).subscribe((data) => {
                          this.bien = data.biens[0];
                          this.photos = this.bien.photos;
                          this.commodite = data.commodite;



                          if (
                            this.currentUser2 &&
                            this.bien &&
                            this.currentUser2.user.email === this.bien.utilisateur.email
                          ) {
                            this.currentUser = true;
                            this.ModifBien = true;
                          }

                          for (const photo of this.photos) {
                            const src = this.generateImageUrl(photo.nom); // Utilisez 'this.generateImageUrl'
                            const caption = 'Caption for ' + photo.nom;

                            this.albumsOne.push({ src: src, caption: caption });
                            this.albumsTwo.push({ src: src, caption: caption });
                          }
                        });
                        return this.router.navigate(['pages/service-details', this.id]);
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

  // Fonction pour convertir les URLs des images en objets File
  async convertURLsToFiles(
    images: { nom: string; data: string }[]
  ): Promise<File[]> {
    const files: File[] = [];

    for (const image of images) {
      const file = await this.fetchImageAsFile(image.data);
      files.push(new File([file], image.nom));
    }

    return files;
  }

  // Fonction pour récupérer l'image depuis l'URL sous forme de blob
  async fetchImageAsFile(url: string): Promise<Blob> {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  }

  //POPUP APRES CONFIRMATION
  popUpConfirmationModification() {
    let timerInterval = 2000;
    Swal.fire({
      position: 'center',
      text: 'Bien modifie avec succès.',
      title: 'Modification de bien',
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
      // Après avoir réussi à candidater, mettez à jour l'état de la candidature
      //RECUPERER L'ID D'UN BIEN
      this.id = this.route.snapshot.params['id'];

      //AFFICHER UN BIEN IMMO EN FONCTION DE SON ID
      this.serviceBienImmo.AfficherBienImmoParId(this.id).subscribe((data) => {
        this.bien = data.biens[0];
        this.photos = this.bien.photos;
        this.commodite = data.commodite;



        if (
          this.currentUser2 &&
          this.bien &&
          this.currentUser2.user.email === this.bien.utilisateur.email
        ) {
          this.currentUser = true;
          this.ModifBien = true;
        }

        for (const photo of this.photos) {
          const src = this.generateImageUrl(photo.nom); // Utilisez 'this.generateImageUrl'
          const caption = 'Caption for ' + photo.nom;

          this.albumsOne.push({ src: src, caption: caption });
          this.albumsTwo.push({ src: src, caption: caption });
        }
      });
      return this.router.navigate(['pages/service-details', this.id]);
    });
  }

  initialiserFormulaire() {
    // Récupération des données du bien immobilier
    this.serviceBienImmo.AfficherBienImmoParId(this.id).subscribe((data) => {
      this.bien = data;
      this.form = {
        nom: this.bien?.nom,
        description: this.bien?.description,
        // Autres champs à récupérer...
      };

      // Récupération de la liste des commodités
      this.serviceCommodite.AfficherListeCommodite().subscribe((data) => {
        this.les_commodite = data;
        // Pré-remplissage des commodités
        if (this.bien && this.bien.commodites) {
          for (const commodite of this.les_commodite) {
            commodite.selected = this.bien.commodites.some(
              (bienCommodite: any) => bienCommodite.id === commodite.id
            );
          }
        }
      });
    });
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

  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['code-block'],
        //  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        //  [{ 'direction': 'rtl' }],                         // text direction

        //  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ align: [] }],

        //  ['clean'],                                         // remove formatting button

        //  ['link'],
        ['link', 'image', 'video'],
      ],
    },
  };

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
  onSelectionChanged = (event: SelectionChange) => {
    if (event.oldRange == null) {
      this.onFocus();
    }
    if (event.range == null) {
      this.onBlur();
    }
  };

  onContentChanged = (event: ContentChange) => { };

  onFocus = () => { };
  onBlur = () => { };
}
