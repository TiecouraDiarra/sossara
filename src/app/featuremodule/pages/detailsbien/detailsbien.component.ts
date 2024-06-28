import { AfterViewInit, Component, HostListener, Inject, LOCALE_ID } from '@angular/core';
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
import { ChatMessage } from '../../userpages/chat/model/chat-message';
import { ChatserviceService } from '../../userpages/chat/chatservice/chatservice.service';
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
  messageInput: string = 'Bonjour est ce que je peut avoir plus d\'information sur ce bien ?';
  public routes = routes;
  public albumsOne: any = [];
  public albumsTwo: any = [];
  bien: any;
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
  bienJournalier: boolean = false;
  bienHebdomadaire: boolean = false;
  bienJournalierHebdomadaire: boolean = false;
  bienPartage: any;
  test: any;
  bienImmoSuivant: any;
  bienImmoPrecedent: any;
  currentUser2: any;
  profil: any;
  NomSender: any;
  uuidChat: any;

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

      if (this.bien.periode.nom == "Journalier" || this.bien.periode.nom == "Hebdomadaire") {
        this.bienJournalierHebdomadaire = true;
      }

      if (this.bien.periode.nom == "Journalier") {
        this.bienJournalier = true;
      }

      if (this.bien.periode.nom == "Hebdomadaire") {
        this.bienHebdomadaire = true;
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
  valuesSelectHebdo: any = ['1', '2', '3', '4', '5'];
  valuesSelectJourn: any = ['1', '2', '3', '4', '5', '6', '7'];
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









  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src =
      'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }



  photos: any;

  RdvForm: any = {
    date: null,
    heure: null,
  };



  selectedCategory: any = '';
  selectedStatut: string | null = null;
  //METHODE PERMETTANT DE CHANGER LES STATUTS


  isMobile = false;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 991;

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
    private chatService2: ChatserviceService,
    @Inject(LOCALE_ID) private localeId: string,
  ) {
    this.locale = localeId;
    //RECUPERER L'ID D'UN BIEN
    this.id = this.route.snapshot.params['id'];
    this.bienparid()
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
    // this.users = this.storageService.getUser();
    // this.senderCheck = this.users.email;
    // this.initMap();
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      //AFFICHER LA LISTE DES USAGE
      this.serviceUsage.AfficherListeUsage().subscribe(data => {
        this.usage = data;
      });
      this.serviceUser.AfficherUserConnecter().subscribe(
        (data) => {
          this.users = data[0];

          this.currentUser2 = this.users;
          this.uuidChat = window.sessionStorage.getItem("chatUuid")
          this.chatService2.joinRoom(this.uuidChat);
          this.senderCheck = this.users.email
        })

    } else if (!this.storageService.isLoggedIn()) {
      this.isLoginFailed = false;
    }

    this.bienparid()
    const Users = this.storageService.getUser();
    const token = Users.token;
    this.serviceUser.setAccessToken(token);


    //AFFICHER LA LISTE DES commentaireS EN FONCTION D'UN BIEN
    this.servicecommentaire.AffichercommentaireParBien(this.id).subscribe((data) => {
      this.commentaire = data.reverse();
    });

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
              confirmButtonColor: '#e98b11',
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
              confirmButtonColor: '#e98b11',
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
        confirmButton: 'swal2-confirm btn',
        cancelButton: 'swal2-cancel btn',
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
                  confirmButtonColor: '#e98b11',
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
                  confirmButtonColor: '#e98b11',
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

  isLoadingRdv: boolean = false;

  //METHODE PERMETTANT DE PRENDRE UN RENDEZ-VOUS
  PrendreRvd(id: any): void {
    // Activer le chargement
    this.isLoadingRdv = true;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'swal2-confirm btn',
        cancelButton: 'swal2-cancel btn',
      },
      heightAuto: false
    });

    // Vérifier que la date et l'heure sont renseignées
    if (!this.RdvForm.date || !this.RdvForm.heure) {
      if (!this.RdvForm.date && !this.RdvForm.heure) {
        swalWithBootstrapButtons.fire({
          position: 'center',
          text: "Tous les champs sont obligatoires !",
          title: 'Erreur',
          icon: 'error',
          heightAuto: false,
          showConfirmButton: true,
          confirmButtonText: 'OK',
          confirmButtonColor: '#e98b11',
          showDenyButton: false,
          showCancelButton: false,
          allowOutsideClick: false,
        });
      } else if (!this.RdvForm.date) {
        swalWithBootstrapButtons.fire({
          position: 'center',
          text: "Veuillez saisir une date valide !",
          title: 'Erreur',
          icon: 'error',
          heightAuto: false,
          showConfirmButton: true,
          confirmButtonText: 'OK',
          confirmButtonColor: '#e98b11',
          showDenyButton: false,
          showCancelButton: false,
          allowOutsideClick: false,
        });
      } else if (!this.RdvForm.heure) {
        swalWithBootstrapButtons.fire({
          position: 'center',
          text: "L'heure du rendez-vous est obligatoire !",
          title: 'Erreur',
          icon: 'error',
          heightAuto: false,
          showConfirmButton: true,
          confirmButtonText: 'OK',
          confirmButtonColor: '#e98b11',
          showDenyButton: false,
          showCancelButton: false,
          allowOutsideClick: false,
        });
      }
      return; // Arrêter l'exécution si la date ou l'heure est manquante
    }

    // Vérification de la validité de la date
    const dateRdv = new Date(this.RdvForm.date);
    const currentDate = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    // Ajouter un jour à currentDate pour inclure la date d'aujourd'hui
    currentDate.setDate(currentDate.getDate() - 1);

    if (dateRdv < currentDate || dateRdv > oneMonthFromNow) {
      swalWithBootstrapButtons.fire({
        position: 'center',
        text: "La date du rendez-vous doit être dans le mois en cours.",
        title: 'Date invalide',
        icon: 'error',
        heightAuto: false,
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#e98b11',
        showDenyButton: false,
        showCancelButton: false,
        allowOutsideClick: false,
      });
      return; // Arrêter la fonction si la date est invalide
    }

    const user = this.storageService.getUser();
    if (user && user.token) {
      // Définissez le token dans le service serviceUser
      this.serviceUser.setAccessToken(user.token);

      // Appelez la méthode PrendreRdv() avec le contenu et l'ID
      this.serviceUser
        .PrendreRdv(this.RdvForm.date, this.RdvForm.heure, id)
        .subscribe({
          next: (data) => {
            // Désactiver le chargement après la réponse de l'API
            this.isLoadingRdv = false;
            if (data.status) {
              // Désactiver le chargement après la réponse de l'API
              this.isLoadingRdv = false;
              let timerInterval = 2000;
              Swal.fire({
                position: 'center',
                text: data.message,
                title: "Envoie de rendez-vous",
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
                this.reloadPage();
              });
            } else {
              // Désactiver le chargement après la réponse de l'API
              this.isLoadingRdv = false;
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
            // Réinitialisez les champs après l'appel
            this.RdvForm.date = null;
            this.RdvForm.heure = null;
          },
          error: (err) => {
            this.errorMessage = err.error.message;
            this.isError = true;
            // Gérez les erreurs ici
          },
        });
    } else {
      // Gérez le cas où l'utilisateur n'est pas connecté
    }
  }



  formCandidater: any = {
    usage: null,
    date: null,
    nombreJours: null,
    nombreSemaine: null,
  };

  //METHODE PERMETTANT DE CANDIDATER UN BIEN
  CandidaterBien(): void {
    this.id = this.route.snapshot.params['id'];
    // const user = this.storageService.getUser();

    this.currentUser2;

    if (this.candidaterWithModal) {
      const dateEntree = new Date(this.formCandidater.date);
      const currentDate = new Date();
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      // Ajouter un jour à currentDate pour inclure la date d'aujourd'hui
      currentDate.setDate(currentDate.getDate() - 1);

      if (dateEntree < currentDate || dateEntree > oneYearFromNow) {
        Swal.fire({
          position: 'center',
          text: "La date d'entrée doit être comprise entre aujourd'hui et un an à partir d'aujourd'hui.",
          title: 'Date invalide',
          icon: 'error',
          heightAuto: false,
          showConfirmButton: true,
          confirmButtonText: 'OK',
          confirmButtonColor: '#e98b11',
          showDenyButton: false,
          showCancelButton: false,
          allowOutsideClick: false,
        });
        return; // Arrêter la fonction si la date est invalide
      }
      this.serviceBienImmo.AfficherBienImmoParId(this.id).subscribe(data => {
        // Modifier l'usage en fonction de la période et du type du bien
        if (data?.periode?.nom === "Journalier" || data?.periode?.nom === "Hebdomadaire") {
          this.formCandidater.usage = 3;
        } else if (data?.typeImmo?.nom === "Terrain") {
          this.formCandidater.usage = 5;
        }

        // Vérification si le champ d'usage est nul pour la période "Mensuel"
        if (data?.periode?.nom === "Mensuel" && !this.formCandidater.usage) {
          Swal.fire({
            position: 'center',
            text: "Veuillez sélectionner un usage.",
            title: 'Erreur',
            icon: 'error',
            heightAuto: false,
            showConfirmButton: true,
            confirmButtonText: 'OK',
            confirmButtonColor: '#e98b11',
            showDenyButton: false,
            showCancelButton: false,
            allowOutsideClick: false,
          });
          return; // Arrêter la fonction si le champ usage est null
        }
      })
    }

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'swal2-confirm btn',
        cancelButton: 'swal2-cancel btn',
      },
      heightAuto: false,
      buttonsStyling: false,
      // confirmButtonColor: '#e98b11', // Définir la couleur du bouton de confirmation
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
            this.idBien = data.uuid;
            // Appelez la méthode PrendreRdv() avec le contenu et l'ID
            this.serviceBienImmo.CandidaterBien(this.idBien, this.formCandidater.usage, this.formCandidater.date, this.formCandidater.nombreJours, this.formCandidater.nombreSemaine).subscribe({
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
                    confirmButtonColor: '#e98b11',
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
                    confirmButtonColor: '#e98b11',
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

  messageList: any[] = [];




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
        confirmButton: 'swal2-confirm btn',
        cancelButton: 'swal2-cancel btn',
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


  //MODIFIER UN BIEN



  goToDettailBi(email: number) {
    return this.router.navigate(['/userpages/messages']);
  }
  MessageForm: any = {
    content: "Bonjour est ce que je peut avoir plus d'information sur ce bien ?",
  }
  goToMessage(username: any) {
    this.messageObj.message = this.MessageForm.content;


    this.chatService
      .getChatByFirstUserNameAndSecondUserName2(this.users.email, username, this.messageObj)
      .subscribe(
        (data) => {
          this.chat = data;

          if (this.chat?.length > 0) {
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

  joinRoom(roomId: string) {
    return this.chatService2.joinRoom(roomId);
  }

  ContacterOrLogin(id: any) {
    const user = this.storageService.getUser();
    if (user && user.token) {
      // Définissez le token dans le service serviceUser
      this.serviceUser.setAccessToken(user.token);

      // Appelez la méthode ACCEPTERCANDIDATUREBIEN() avec le contenu et l'ID
      this.serviceBienImmo.OuvrirConversationN(id).subscribe({
        next: (data) => {

          if (data.status) {
            window.sessionStorage.setItem("chatUuid", data.message);
            this.chatService2.joinRoom(data.message);


            this.router.navigate([routes.messages]);

            this.serviceUser.AfficherUserConnecter().subscribe(
              (data) => {
                this.users = data && data.length > 0 ? data[0] : null;
                this.profil = data[0]?.profil;
                if (this.profil == 'AGENCE') {
                  this.NomSender = this.users?.nomAgence;
                } else {
                  this.NomSender = this.users?.nom;
                }

                const chatMessage = {
                  message: this.messageInput,
                  senderEmail: this.users?.email,
                  senderNom: this.NomSender,
                  time: new Date(),
                } as ChatMessage
                this.uuidChat = window.sessionStorage.getItem("chatUuid")
                this.lisenerMessage();
                this.loadMessages(this.uuidChat);
                this.chatService2.sendMessage(this.uuidChat, chatMessage);
                this.messageInput = '';
              })
          }
          // this.isSuccess = true;
          // this.errorMessage = 'Conversation ouverte avec succès';
          // this.pathConversation();
        },
        error: (err) => {
          this.errorMessage = err.error.message;
          // this.isError = true
          // Gérez les erreurs ici
        }
      }
      );
    } else {
      this.router.navigateByUrl("/auth/connexion")
    }
    // if (this.storageService.isLoggedIn()) {
    //   this.router.navigate([routes.messages]);
    // } else {
    //   this.router.navigateByUrl("/auth/connexion")
    // }
  }

  goToLogin() {
    return this.router.navigate(['auth/connexion'])
  }

  lisenerMessage() {
    if (this.storageService.isLoggedIn()) {
      this.serviceUser.AfficherUserConnecter().subscribe(
        (data) => {
          this.users = data && data.length > 0 ? data[0] : null;
          this.chatService2.getMessageSubject().subscribe((messages: any) => {

            this.messageList = messages.map((item: any) => ({
              ...item,
              message_side: item.senderEmail === this.users.email ? 'sender' : 'receiver',
            }))
          });
        })
    }
  }

  loadMessages(uuid: any): void {
    // Implémente la logique pour charger les messages de la conversation sélectionnée
    // Par exemple, en appelant un service pour récupérer les messages
    // Exemple hypothétique :
    window.sessionStorage.setItem("chatUuid", uuid);
  }


  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE MODIFICATION BIEN
  goToModifierBien(id: number) {
    return this.router.navigate(['userpages/modifier-bien', id])
  }
  goToDettailBien(id: number) {
    return this.router.navigate(['details-bien', id]).then(() => {
      this.bienparid();
      window.location.reload();
    });
  }

  userRoles: { id: number; name: string }[] = [];

  bienparid() {
    this.id = this.route.snapshot.params['id'];

    //AFFICHER UN BIEN IMMO EN FONCTION DE SON ID
    this.serviceBienImmo.AfficherBienImmoParId(this.id).subscribe((data) => {
      this.bien = data;

      this.lesCommodites = data?.commodites;



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

      this.lesCommodites = data?.commodites;
      this.photos = this.bien?.photos;
      this.latitude = this.bien.adresse.latitude;
      this.longitude = this.bien.adresse.longitude;
      // Définir les métadonnées Open Graph dynamiquement
      this.meta.updateTag({ property: 'og:title', content: this.bien.nom });
      this.meta.updateTag({ property: 'og:description', content: this.bien.description });
      this.meta.updateTag({ property: 'og:image', content: this.generateImageUrl(this.bien.photos[0].nom) });


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
      // Initialiser la carte dans l'élément avec l'ID "map"
      // const mapElement = document.getElementById('map');
      // const map = new google.maps.Map(mapElement, mapOptions);
      // Créer un marqueur initial au centre de la carte
      // const initialMarker = new google.maps.Marker({
      //   position: mapOptions.center,
      //   map: map,
      //   draggable: true, // Rend le marqueur draggable
      // });
      // Attachez un gestionnaire d'événements pour mettre à jour les coordonnées lorsque le marqueur est déplacé
      // google.maps.event.addListener(
      //   initialMarker,
      //   'dragend',
      //   (markerEvent: { latLng: { lat: () => any; lng: () => any } }) => {
      //     // this.form.latitude = markerEvent.latLng.lat();
      //     // this.form.longitude = markerEvent.latLng.lng();
      //   }
      // );

      // Attachez un gestionnaire d'événements pour déplacer le marqueur lorsqu'il est cliqué
      // google.maps.event.addListener(
      //   initialMarker,
      //   'click',
      //   (markerEvent: { latLng: { lat: () => any; lng: () => any } }) => {
      //     const newLatLng = new google.maps.LatLng(
      //       initialMarker.getPosition().lat() + 0.001, // Déplacez le marqueur d'une petite quantité en latitude
      //       initialMarker.getPosition().lng() + 0.001 // Déplacez le marqueur d'une petite quantité en longitude
      //     );

      //     initialMarker.setPosition(newLatLng);

      //     // Mettez à jour les coordonnées dans votre formulaire
      //     // this.form.latitude = newLatLng.lat();
      //     // this.form.longitude = newLatLng.lng();
      //   }
      // );
    });
  }

  hasRole(roleName: string): boolean {
    if (this.bien && this.bien.utilisateur && Array.isArray(this.bien.utilisateur.roles)) {
      return this.bien.utilisateur.roles.some((role: { name: string }) => role.name === roleName);
    }
    return false;
  }
}
