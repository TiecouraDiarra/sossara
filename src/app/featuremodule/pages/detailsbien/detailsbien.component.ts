import { AfterViewInit, Component, Inject, LOCALE_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lightbox } from 'ngx-lightbox';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { AdresseService } from 'src/app/service/adresse/adresse.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { commentaireService } from 'src/app/service/commentaire/commentaire.service';
import * as L from 'leaflet';
// import { ShareThisService } from 'share-this';


import { CommoditeService } from 'src/app/service/commodite/commodite.service';
import { MessageService } from 'src/app/service/message/message.service';
import Swal from 'sweetalert2';
import { UsageService } from 'src/app/service/usage/usage.service';
import { Chat } from '../../userpages/message/models/chat';
import { Message } from '../../userpages/message/models/message';
import { CaracteristiqueService } from 'src/app/service/caracteristique/caracteristique.service';
import { Meta } from '@angular/platform-browser';
declare var google: any;

const URL_PHOTO: string = environment.Url_PHOTO;


@Component({
  selector: 'app-detailsbien',
  templateUrl: './detailsbien.component.html',
  styleUrls: ['./detailsbien.component.css'],
  // providers: [ShareThisService] // Ajouter le service dans les providers
})
export class DetailsbienComponent implements AfterViewInit {
  locale!: string;
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
  isCandidatureSent: any = false; // Variable pour suivre l'état de la candidature
  // typeImmo : any
  // adresse : any
  // createdAt : any
  // User : any
  commentaire: any;
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

  senderCheck: any;
  chatId: any = sessionStorage.getItem('chatId');
  chat: any;
  chatObj: Chat = new Chat();
  messageObj: Message = new Message('', '', '');
  public chatData: any;
  lesCommodites: any;
  candidaterWithModal: boolean = false;
  bienPartage: any;
  test: any;
  bienImmoSuivant: any;
  bienImmoPrecedent: any;

  generateQrCodeUrl(qrCodeBase64: string): string {
    return 'data:image/png;base64,' + qrCodeBase64;
  }


  partagerSurNavigateur() {
    //RECUPERER L'ID D'UN BIEN
    this.id = this.route.snapshot.params['id'];

    if (navigator.share) {
      navigator.share({
        title: 'Titre de votre bien',
        text: 'Description de votre bien',
        url: 'http://localhost:4200/details-bien/' + this.id
      }).then(() => {
      }).catch((error) => {
      });
    } else {
    }
  }


  ngAfterViewInit() {
    this.serviceBienImmo.AfficherBienImmoParId(this.id).subscribe(data => {
      this.bien = data;
      this.photos = this.bien.photos;
      this.latitude = this.bien?.adresse?.latitude || null;
      this.longitude = this.bien?.adresse?.longitude || null;
      this.nombien = this.bien?.nom;

      if (this.bien.statut.nom == "A louer") {
        this.candidaterWithModal = true;
      }

      // Options de la carte
      const mapOptions = {
        center: [this.latitude, this.longitude],
        zoom: 15,
      };

      // Récupération de l'élément de la carte dans le DOM
      const mapElement = document.getElementById('mape');

      // Vérification que l'élément de la carte existe dans le DOM
      if (mapElement) {

        // Ajouter des tuiles OpenStreetMap à la carte
        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        });

        // Créer une icône personnalisée pour le marqueur
        var customIcon = L.icon({
          iconUrl: 'assets/img/iconeBien/localisations.svg',
          iconSize: [60, 60], // Taille de l'icône [largeur, hauteur]
          iconAnchor: [19, 38], // Point d'ancrage de l'icône [position X, position Y], généralement la moitié de la largeur et la hauteur de l'icône
          popupAnchor: [0, -38] // Point d'ancrage du popup [position X, position Y], généralement en haut de l'icône
        });
        // Création de la carte Leaflet
        const map = L.map(mapElement).setView([this.longitude, this.latitude], 12).addLayer(tiles);

        tiles.addTo(map);
        // Créer un marqueur pour l'emplacement
        L.marker([this.latitude, this.longitude], { icon: customIcon }).addTo(map)
          .bindPopup(this.nombien)
          .openPopup();
        // Centrer la carte sur le marqueur
        map.setView([this.latitude, this.longitude]);
      } else {
      }
    });
  }



  latitude: any
  longitude: any
  description: any
  status: any = ['A louer', 'A vendre'];
  type: any;
  valuesSelect: any = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  selectedFiles: any;
  isButtonDisabled: boolean = false;
  maxImageCount: number = 0;
  message: string | undefined;
  periode: any;
  caracteristique: any;
  // Déclarer une variable pour suivre l'état du collapse
  isCollapsedModifier: boolean = false;
  isCollapsedRepondre: boolean = false;


  commentaireForm: any = {
    contenu: null,
  };
  reponseForm: any = {
    contenu: null,
  };

  commForm: any = {
    contenu: null
  };
  currentUser: any = false;
  ModifBien: any = false;

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
    this.selectedFiles = event.target.files;
    const reader = new FileReader();

    for (const file of this.selectedFiles) {
      if (this.images.length < 8) {
        reader.onload = (e: any) => {
          this.images.push(file);
          this.image.push(e.target.result);
          this.checkImageCount(); // Appel de la fonction pour vérifier la limite d'images
          this.maxImageCount = this.image.length;
        };
        reader.readAsDataURL(file);
      } // Vérifiez si la limite n'a pas été atteinte
    }
    this.form.photo = this.images;
    this.checkImageCount(); // Assurez-vous de vérifier à nouveau la limite après le traitement
  }

  removeImage(index: number) {
    this.image.splice(index, 1); // Supprime l'image du tableau
    this.images.splice(index, 1); // Supprime le fichier du tableau 'images'
    this.checkImageCount(); // Appelle la fonction pour vérifier la limite d'images après la suppression
  }

  getFullImagePath(imageName: string): string {
    // Assurez-vous que le chemin de base est correctement configuré
    const basePath = 'https://chemin-vers-votre-serveur/';
    return basePath + imageName;
  }
  // Fonction pour vérifier la limite d'images et désactiver le bouton si nécessaire
  checkImageCount(): void {
    if (this.images.length >= 8) {
      this.isButtonDisabled = true;
    } else {
      this.isButtonDisabled = false;
    }
  }

  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src =
      'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
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

  photos: any;

  RdvForm: any = {
    date: null,
    heure: null,
  };

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
    commoditeChecked: false,
    selectedCommodities: [], // Nouveau tableau pour stocker les commodités sélectionnées
  };

  selectedCategory: any = '';
  selectedStatut: string | null = null;
  //METHODE PERMETTANT DE CHANGER LES STATUTS
  onStatutChange(event: any) {
    this.selectedStatut = event.target.value;
    if (this.selectedStatut === '2') {
      this.form.periode = null; // Mettre la période à null si le statut est "A vendre"
    }
  }

  constructor(
    private _lightbox: Lightbox,
    public router: Router,
    private serviceCommodite: CommoditeService,
    private serviceBienImmo: BienimmoService,
    private serviceUser: UserService,
    private serviceUsage: UsageService,
    private caracteristiqueService: CaracteristiqueService,
    private storageService: StorageService,
    private servicecommentaire: commentaireService,
    private route: ActivatedRoute,
    private serviceAdresse: AdresseService,
    private meta: Meta,
    private chatService: MessageService,
    @Inject(LOCALE_ID) private localeId: string,
  ) {
    this.locale = localeId;


    //RECUPERER L'ID D'UN BIEN
    this.id = this.route.snapshot.params['id'];

    //AFFICHER UN BIEN IMMO EN FONCTION DE SON ID
   
 
  }
  open(index: number, albumArray: Array<any>): void {
    this._lightbox.open(albumArray, index);
  }
  openAll(albumArray: Array<any>): void {
    this._lightbox.open(albumArray);
  }

  initMap() {
    const mapOptions = {
      center: { lat: 12.639231999999997, lng: -7.998184000000001 }, // Coordonnées initiales de la carte
      zoom: 15, // Niveau de zoom initial
    };

    const map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }
  close(): void {
    this._lightbox.close();
  }

  // Définissez votre logique pour obtenir l'URL du bien, le titre et la description ici
  // Définissez votre logique pour obtenir l'URL du bien, le titre et la description ici
  getShareUrl(): string {
    const encodedUrl = encodeURIComponent('https://sossara.ml/details-bien/df3d2e3e-32c0-4dfb-9a1d-8a26accfb4d9');
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  }
  ngOnInit(): void {
    this.users = this.storageService.getUser();
    this.senderCheck = this.users.email;
    // this.initMap();
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      // this.roles = this.storageService.getUser().roles;
    } else if (!this.storageService.isLoggedIn()) {
      this.isLoginFailed = false;
    }
    //RECUPERER L'ID D'UN BIEN
   
    // this.serviceBienImmo.AfficherLaListeBienImmo().subscribe(data => {
    //   // Tri des biens immobiliers par ordre décroissant de la date de création
    
    //   // Extraction des trois biens immobiliers les plus récents
    //   this.bienImmoSuivant = data.slice(0, 1);
    //   console.log(this.bienImmoSuivant)
    this. bienparid()
    
    // });

    //AFFICHER LA LISTE DES USAGE
    this.serviceUsage.AfficherListeUsage().subscribe(data => {
      this.usage = data;
    }
    );

    const Users = this.storageService.getUser();
    const token = Users.token;
    this.serviceUser.setAccessToken(token);

    //AFFICHER LA LISTE DES commentaireS EN FONCTION D'UN BIEN
    this.servicecommentaire
      .AffichercommentaireParBien(this.id)
      .subscribe((data) => {
        this.commentaire = data.reverse();
      });
    this.serviceCommodite.AfficherListeCommodite().subscribe((data) => {
      this.les_commodite = data;
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

    //AFFICHER LA LISTE DES COMMODITES
    // this.serviceCommodite.AfficherLaListeCommodite().subscribe((data) => {
    //   this.typebien = data.type;
    // });
  }

  direction() {
    this.router.navigate([routes.servicedetails]);
  }

  // FORMATER LE PRIX
  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  getCurrentDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  //METHODE PERMETTANT DE FAIRE UN commentaire
  Fairecommentaire(id: number): void {
    this.id = this.route.snapshot.params['id'];

    const user = this.storageService.getUser();
    if (user && user.token) {
      // Définissez le token dans le service commentaireService
      this.serviceUser.setAccessToken(user.token);

      // Appelez la méthode Fairecommentaire() avec le contenu et l'ID
      this.servicecommentaire
        .Fairecommentaire(this.commentaireForm.contenu, id)
        .subscribe(
          (data) => {
           

            //AFFICHER LA LISTE DES commentaireS EN FONCTION D'UN BIEN
            this.servicecommentaire
              .AffichercommentaireParBien(this.id)
              .subscribe((data) => {
                this.commentaire = data.reverse();
                this.commentaireForm.contenu = '';
              });
          },
          (error) => {
            // Gérez les erreurs ici
          }
        );
    } else {
    }


  }

  //METHODE PERMETTANT DE REPONDRE A UN commentaire
  Repondrecommentaire(id: number): void {
    const user = this.storageService.getUser();
    if (user && user.token) {
      this.serviceUser.setAccessToken(user.token);
      this.servicecommentaire
        .Repondrecommentaire(this.reponseForm.contenu, id)
        .subscribe(
          (data) => {
            //AFFICHER LA LISTE DES commentaireS EN FONCTION D'UN BIEN
            this.servicecommentaire
              .AffichercommentaireParBien(this.id)
              .subscribe((data) => {
                this.commentaire = data.reverse();
                this.reponseForm.contenu = '';
              });
          },
          (error) => {
            // Gérez les erreurs ici
          }
        );
    } else {
    }

 
  }

  commentaireSelectionne: any;
  afficherCommentaire(commentaireId: any) {
    // this.isCollapsedRepondre = true; // Mettre à jour l'état du collapse
    // Récupérer le commentaire correspondant à l'identifiant
    this.servicecommentaire.AfficherCommentaireParid(commentaireId).subscribe((commentaire) => {
      this.commentaireSelectionne = commentaire;

      this.commForm = {
        contenu: this.commentaireSelectionne?.contenu
      }

    });
  }
  //METHODE PERMETTANT DE MODIFIER UN commentaire
  Modifiercommentaire(id: number): void {
    this.servicecommentaire.Modifiercommentaire(this.commForm.contenu, id)
      .subscribe(
        (data) => {
          if (data.status) {
            let timerInterval = 2000;
            Swal.fire({
              position: 'center',
              text: data.message,
              title: "Modification du commentaire",
              icon: 'success',
              heightAuto: false,
              showConfirmButton: false,
              confirmButtonColor: '#0857b5',
              showDenyButton: false,
              showCancelButton: false,
              allowOutsideClick: false,
              timer: timerInterval,
              timerProgressBar: true,
            }).then(() => {
              this.commForm.contenu === '';
              //AFFICHER LA LISTE DES commentaireS EN FONCTION D'UN BIEN
              this.servicecommentaire
                .AffichercommentaireParBien(this.id)
                .subscribe((data) => {
                  this.commentaire = data.reverse();
                });
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
              confirmButtonColor: '#0857b5',
              showDenyButton: false,
              showCancelButton: false,
              allowOutsideClick: false,
            }).then((result) => { });
          }
        },
        error => {
       
        }
      );
  }

   //METHODE PERMETTANT DE MODIFIER UN commentaire
   SupprimerCommentaire(id: number): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })
    swalWithBootstrapButtons.fire({
      // title: 'Etes-vous sûre de vous déconnecter?',
      text: "Êtes-vous sûr(e) de vouloir supprimer votre commentaire ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicecommentaire.SupprimerCommentaire(id)
          .subscribe(
            (data) => {
              if (data.status) {
                let timerInterval = 2000;
                Swal.fire({
                  position: 'center',
                  text: data.message,
                  title: "Suppression du commentaire",
                  icon: 'success',
                  heightAuto: false,
                  showConfirmButton: false,
                  confirmButtonColor: '#0857b5',
                  showDenyButton: false,
                  showCancelButton: false,
                  allowOutsideClick: false,
                  timer: timerInterval,
                  timerProgressBar: true,
                }).then(() => {
                  this.commForm.contenu === '';
                  //AFFICHER LA LISTE DES commentaireS EN FONCTION D'UN BIEN
                  this.servicecommentaire
                    .AffichercommentaireParBien(this.id)
                    .subscribe((data) => {
                      this.commentaire = data.reverse();
                    });
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
                  confirmButtonColor: '#0857b5',
                  showDenyButton: false,
                  showCancelButton: false,
                  allowOutsideClick: false,
                }).then((result) => { });
              }
            },
            error => {
            
            }
          );
      }
    })
  }

  //METHODE PERMETTANT DE PRENDRE UN RENDEZ-VOUS
  PrendreRvd(id: number): void {
    // this.id = this.route.snapshot.params["id"]
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })
    const user = this.storageService.getUser();
    if (user && user.token) {
      // Définissez le token dans le service serviceUser
      this.serviceUser.setAccessToken(user.token);

      // Appelez la méthode PrendreRdv() avec le contenu et l'ID
      this.serviceUser
        .PrendreRdv(this.RdvForm.date, this.RdvForm.heure, id)
        .subscribe({
          next: (data) => {
            if (data.status) {
              let timerInterval = 2000;
              Swal.fire({
                position: 'center',
                text: data.message,
                title: "Envoie de rendez-vous",
                icon: 'success',
                heightAuto: false,
                showConfirmButton: false,
                confirmButtonColor: '#0857b5',
                showDenyButton: false,
                showCancelButton: false,
                allowOutsideClick: false,
                timer: timerInterval,
                timerProgressBar: true,
              }).then(() => {
                this.reloadPage();
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
                confirmButtonColor: '#0857b5',
                showDenyButton: false,
                showCancelButton: false,
                allowOutsideClick: false,
              }).then((result) => { });
            }
            this.RdvForm.date = null;
            this.RdvForm.heure = null;
          },
          error: (err) => {
            this.errorMessage = err.error.message;
            this.isError = true;
            // Gérez les erreurs ici
            if (this.RdvForm.date == null || this.RdvForm.heure == null) {
              swalWithBootstrapButtons.fire(
                '',
                `<h1 style='font-size: 1em !important; font-weight: bold; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>Date et heure de rendez-vous sont obligatoire</h1>`,
                'error'
              );
              // this.errorMessage =
              //   'Date et heure de rendez-vous sont obligatoire';
            }
          },
        });
    } else {

    }
  }

  formCandidater: any = {
    usage: null,
    date: null,
  };

  //METHODE PERMETTANT DE CANDIDATER UN BIEN
  CandidaterBien(): void {
    this.id = this.route.snapshot.params['id'];
    // const user = this.storageService.getUser();

    const currentUser = this.getCurrentUser();

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })
    swalWithBootstrapButtons.fire({
      // title: 'Etes-vous sûre de vous déconnecter?',
      text: "Veuillez confirmer votre candidature",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        const user = this.storageService.getUser();
        if (user && user.token) {
          // Définissez le token dans le service serviceUser
          this.serviceUser.setAccessToken(user.token);
          //AFFICHER UN BIEN IMMO EN FONCTION DE SON ID
          this.serviceBienImmo.AfficherBienImmoParId(this.id).subscribe(data => {
            this.idBien = data.id;
            // Appelez la méthode PrendreRdv() avec le contenu et l'ID
            this.serviceBienImmo.CandidaterBien(this.idBien, this.formCandidater.usage, this.formCandidater.date).subscribe({
              next: (data) => {
                if (data.status) {
                  let timerInterval = 2000;
                  Swal.fire({
                    position: 'center',
                    text: data.message,
                    title: "Candidature envoyée nous vous reviendrons bientôt",
                    icon: 'success',
                    heightAuto: false,
                    showConfirmButton: false,
                    confirmButtonColor: '#0857b5',
                    showDenyButton: false,
                    showCancelButton: false,
                    allowOutsideClick: false,
                    timer: timerInterval,
                    timerProgressBar: true,
                  }).then(() => {
                    this.reloadPage();
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
                    confirmButtonColor: '#0857b5',
                    showDenyButton: false,
                    showCancelButton: false,
                    allowOutsideClick: false,
                  }).then((result) => { });
                }
              },
              error: (err) => {
                this.errorMessage = err.error.message;
                this.isError = true
                // Gérez les erreurs ici
                const errorMessage =
                  err.error && err.error.message ? err.error.message : 'Erreur inconnue';
                swalWithBootstrapButtons.fire(
                  '',
                  `<h1 style='font-size: 1em !important; font-weight: bold; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>${errorMessage}</h1>`,
                  'error'
                );
              }
            }
            );
          });
        } else {
        }
      }
    });
  }

  // Méthode pour obtenir les informations de l'utilisateur connecté
  getCurrentUser(): any {
    const user = this.storageService.getUser();
    return user ? user.userData : null;
  }

  //POPUP APRES CONFIRMATION DE CANDIDATURE
  popUpConfirmation() {
    let timerInterval = 2000;
    Swal.fire({
      position: 'center',
      text: 'La candidature a été envoyée avec succès.',
      title: 'Candidature envoyée',
      icon: 'success',
      heightAuto: false,
      showConfirmButton: false,
      // confirmButtonText: "OK",
      confirmButtonColor: '#0857b5',
      showDenyButton: false,
      showCancelButton: false,
      allowOutsideClick: false,
      timer: timerInterval, // ajouter le temps d'attente
      timerProgressBar: true, // ajouter la barre de progression du temps
    }).then((result) => {
      this.reloadPage();
      // Après avoir réussi à candidater, mettez à jour l'état de la candidature
    });
  }
  
  //METHODE PERMETTANT D'ACTUALISER LA PAGE
  reloadPage(): void {
    window.location.reload();
  }
  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO;
    return baseUrl + photoFileName;
  }

  //OUVRIR UNE CONVERSATION EN FONCTION DE L'UTILISATEUR
  OuvrirConversation(id: any): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false,
    });
    swalWithBootstrapButtons
      .fire({
        // title: 'Etes-vous sûre de vous déconnecter?',
        text: "Etes-vous sûre d'ouvrir une conversation ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Annuler',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          const user = this.storageService.getUser();
          if (user && user.token) {
            // Définissez le token dans le service serviceUser
            this.serviceUser.setAccessToken(user.token);
            // Appelez la méthode ACCEPTERCANDIDATUREBIEN() avec le contenu et l'ID
            this.serviceBienImmo.OuvrirConversation(id).subscribe({
              next: (data) => {
                this.isSuccess = true;
                // this.errorMessage = 'Conversation ouverte avec succès';
                this.pathConversation();
              },
              error: (err) => {
                this.errorMessage = err.error.message;
                this.isError = true;
                // Gérez les erreurs ici
              },
            });
          } else {
          }
        }
      });
  }

  pathConversation() {
    this.router.navigate([routes.messages]);
  }
  selectedStatutMensuel: string | null = null;
  //METHODE PERMETTANT DE CHANGER LES STATUTS
  onStatutChangeMensuel(event: any) {
    this.selectedStatutMensuel = event.target.value;
    if (this.selectedStatut === '2') {
      this.form.caution = null; // Mettre le caution à null si le statut est "A vendre"
      this.form.avance = null; // Mettre l'avance à null si le statut est "A vendre"
    }
  }

  //MODIFIER UN BIEN
 
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
      confirmButtonColor: '#0857b5',
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
        
        

        const currentUser = this.storageService.getUser();

        if (
          currentUser &&
          this.bien &&
          currentUser.user.id === this.bien.utilisateur.id
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

  goToDettailBi(email: number) {
    return this.router.navigate(['/userpages/messages']);
  }
  MessageForm: any = {
    content: "Bonjour est ce que je peut avoir plus d'information sur ce bien ?",
  }
  goToMessage(username: any) {
    this.messageObj.message = this.MessageForm.content;


    this.chatService
      .getChatByFirstUserNameAndSecondUserName2( this.users.email, username, this.messageObj)
      .subscribe(
        (data) => {
          this.chat = data;

          if (this.chat.length > 0) {
            this.chatId = this.chat[0].chatId;
            sessionStorage.setItem('chatId', this.chatId);
            this.router.navigate(['/userpages/messages']);
          } else {
            // Si le tableau est vide, créez une nouvelle salle de chat
            // Si le tableau est vide, créez une nouvelle salle de chat
            this.chatObj['expediteur'] = this.users.email;
            this.chatObj['destinateur'] = username;
            this.chatService.createChatRoom(this.chatObj).subscribe((data) => {
              this.chatData = data;
              this.chatId = this.chatData.chatId;
              sessionStorage.setItem('chatId', this.chatData.chatId);
              this.router.navigate(['/userpages/messages']);
            });
          }
        },
        (error) => { }
      );
  }


  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE MODIFICATION BIEN
  goToModifierBien(id: number) {
    return this.router.navigate(['userpages/modifier-bien', id])
  }
  goToDettailBien(id: number) {
    return this.router.navigate(['details-bien', id]).then(() => {
        this.bienparid();
        window.location.reload();    });
}



  bienparid(){
    this.id = this.route.snapshot.params['id'];

    //AFFICHER UN BIEN IMMO EN FONCTION DE SON ID
    this.serviceBienImmo.AfficherBienImmoParId(this.id).subscribe((data) => {
      this.bien = data;
   
    this.serviceBienImmo.AfficherLaListeBienImmo().subscribe(data => {
      // Trier les biens par date de création décroissante
      data.sort((a: any, b: any) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    
      // Filtrer les biens par date de création supérieure à this.bien.createdAt
      const biensFiltres = data.filter((bien: { createdAt: string | number | Date; }) => {
        return new Date(bien.createdAt) > new Date(this.bien.createdAt);
      });
      const biensFiltres2 = data.filter((bien: { createdAt: string | number | Date; }) => {
        return new Date(bien.createdAt) < new Date(this.bien.createdAt);
      });
    
      // Afficher la liste des biens filtrés
     // Inverser l'ordre de la liste filtrée
     biensFiltres.reverse();
     biensFiltres2;

  // Récupérer le premier élément de la liste inversée
      this.bienImmoSuivant = biensFiltres.slice(0, 1);
      this.bienImmoPrecedent = biensFiltres2.slice(0, 1);

      
    });
    
      console.log(this.bien)
      this.lesCommodites = data?.commodites;
      this.photos = this.bien?.photos;
      this.latitude = this.bien.adresse.latitude;
      this.longitude = this.bien.adresse.longitude;
      // Définir les métadonnées Open Graph dynamiquement
      this.meta.updateTag({ property: 'og:title', content: this.bien.nom });
      this.meta.updateTag({ property: 'og:description', content: this.bien.description });
      this.meta.updateTag({ property: 'og:image', content: this.generateImageUrl(this.bien.photos[0].nom) });

      const currentUser = this.storageService.getUser();

      if (
        currentUser &&
        this.bien &&
        currentUser?.id === this.bien?.utilisateur?.id
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
      // Initialiser la carte dans l'élément avec l'ID "map"
      const mapElement = document.getElementById('map');
      const map = new google.maps.Map(mapElement, mapOptions);
      // Créer un marqueur initial au centre de la carte
      const initialMarker = new google.maps.Marker({
        position: mapOptions.center,
        map: map,
        draggable: true, // Rend le marqueur draggable
      });
      // Attachez un gestionnaire d'événements pour mettre à jour les coordonnées lorsque le marqueur est déplacé
      google.maps.event.addListener(
        initialMarker,
        'dragend',
        (markerEvent: { latLng: { lat: () => any; lng: () => any } }) => {
          this.form.latitude = markerEvent.latLng.lat();
          this.form.longitude = markerEvent.latLng.lng();
        }
      );

      // Attachez un gestionnaire d'événements pour déplacer le marqueur lorsqu'il est cliqué
      google.maps.event.addListener(
        initialMarker,
        'click',
        (markerEvent: { latLng: { lat: () => any; lng: () => any } }) => {
          const newLatLng = new google.maps.LatLng(
            initialMarker.getPosition().lat() + 0.001, // Déplacez le marqueur d'une petite quantité en latitude
            initialMarker.getPosition().lng() + 0.001 // Déplacez le marqueur d'une petite quantité en longitude
          );

          initialMarker.setPosition(newLatLng);

          // Mettez à jour les coordonnées dans votre formulaire
          this.form.latitude = newLatLng.lat();
          this.form.longitude = newLatLng.lng();
        }
      );
    });
  }
}
