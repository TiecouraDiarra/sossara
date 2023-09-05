import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lightbox } from 'ngx-lightbox';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { commentaireService } from 'src/app/service/commentaire/commentaire.service';


import { CommoditeService } from 'src/app/service/commodite/commodite.service';
import Swal from 'sweetalert2';
declare var google: any;

const URL_PHOTO: string = environment.Url_PHOTO;


@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.css']
})
export class ServiceDetailsComponent implements AfterViewInit {
  public routes = routes;
  public albumsOne: any = [];
  public albumsTwo: any = [];
  bien: any
  les_commodite: any[] = [];
  pays: any;
  commune: any;
  nombien: any;
  typebien: any;
  bienImmo: any;
  region: any;
  adresse: any;
  id: any
  commodite: any
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
  commentaire: any
  regions: any = [];
  communes: any = [];
  selectedValue: string | any = 'pays';
  selectedValueR: string | any = 'region';
  image: File[] = [];
  images: File[] = [];



  ngAfterViewInit() {
    //AFFICHER UN BIEN IMMO EN FONCTION DE SON ID
    this.serviceBienImmo.AfficherBienImmoParId(this.id).subscribe(data => {
      this.bien = data.biens[0];
      this.photos = this.bien.photos;
      this.latitude = this.bien.adresse.latitude || null;
      this.longitude = this.bien.adresse.longitude || null;
      this.nombien = this.bien.nom;

      // Reste du code pour récupérer d'autres données...

      // Options de la carte
      const mapOptions = {
        center: { lat: this.latitude, lng: this.longitude },
        zoom: 15,
      };

      // Attendre que le DOM soit chargé pour initialiser la carte
      setTimeout(() => {
        const mapElement = document.getElementById("map");
        const map = new google.maps.Map(mapElement, mapOptions);

        // URL de l'image de l'icône personnalisée
        const customIconUrl = 'assets/img/icons/marker7.png';

        // Options de l'icône du marqueur
        const markerIcon = {
          url: customIconUrl, // URL de l'image
          scaledSize: new google.maps.Size(50, 50), // Taille de l'image (largeur x hauteur)
          origin: new google.maps.Point(0, 0), // Point d'origine de l'image
          anchor: new google.maps.Point(20, 40), // Point d'ancrage de l'image par rapport au marqueur
        };

        // Créer un marqueur pour l'emplacement
        const marker = new google.maps.Marker({
          position: { lat: this.latitude, lng: this.longitude },
          map: map,
          title: this.nombien,
          icon: markerIcon, // Utilisation de l'icône personnalisée
        });
      }, 0); // Utilisation d'un délai de 0 millisecondes pour s'assurer que le DOM est prêt
    });
  }

  latitude: any
  longitude: any
  description: any
  status: any = ['A louer', 'A vendre'];
  type: any
  valuesSelect: any = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  selectedFiles: any;
  isButtonDisabled: boolean = false;
  maxImageCount: number = 0;
  message: string | undefined;
  periode: any




  commentaireForm: any = {
    contenu: null,
  }
  currentUser: any = false;
  ModifBien: any = false;

  onChange(newValue: any) {
    this.regions = this.region.filter(
      (el: any) => el.pays.nom == newValue.value
    );
  }

  onChangeRegion(newValue: any) {
    this.communes = this.commune.filter(
      (el: any) => el.region.nom == newValue.value
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
          console.log(this.image);
          this.maxImageCount = this.image.length
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
    event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
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
      console.log(this.form.commodite);
    }
  }

  photos: any;

  RdvForm: any = {
    date: null,
    heure: null
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
    commoditeChecked: false,
    selectedCommodities: [], // Nouveau tableau pour stocker les commodités sélectionnées
  };

  selectedStatut: string | null = null;
  //METHODE PERMETTANT DE CHANGER LES STATUTS
  onStatutChange(event: any) {
    this.selectedStatut = event.target.value;
    if (this.selectedStatut === 'A vendre') {
      this.form.periode = null; // Mettre la période à null si le statut est "A vendre"
    }
  }

  constructor(
    private _lightbox: Lightbox,
    public router: Router,
    private serviceCommodite: CommoditeService,
    private serviceBienImmo: BienimmoService,
    private serviceUser: UserService,
    private storageService: StorageService,
    private servicecommentaire: commentaireService,
    private route: ActivatedRoute,
  ) {
    //RECUPERER L'ID D'UN BIEN
    this.id = this.route.snapshot.params["id"];
    //AFFICHER UN BIEN IMMO EN FONCTION DE SON ID
    this.serviceBienImmo.AfficherBienImmoParId(this.id).subscribe(data => {
      this.bien = data.biens[0];
      console.log(this.bien);
      this.form = {
        nom: this.bien.nom,
        description: this.bien.description,
        type: this.bien.typeImmo.nom,
        surface: this.bien.surface,
        periode: this.bien.periode.nom,
        porte: this.bien.adresse.porte,
        rue: this.bien.adresse.rue,
        quartier: this.bien.adresse.quartier,
        // statut: this.bien.statut,
        prix: this.bien.prix,
        toilette: this.bien.toilette,
        cuisine: this.bien.cuisine,
        chambre: this.bien.chambre,
        commodite: this.bien.commodite.nom,
      };
    });
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
      zoom: 15 // Niveau de zoom initial
    };

    const map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }
  close(): void {
    this._lightbox.close();
  }
  ngOnInit(): void {
    // this.initMap();
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      // this.roles = this.storageService.getUser().roles;
    } else if (!this.storageService.isLoggedIn()) {
      this.isLoginFailed = false;
    }
    //RECUPERER L'ID D'UN BIEN
    this.id = this.route.snapshot.params["id"]


    //AFFICHER UN BIEN IMMO EN FONCTION DE SON ID
    this.serviceBienImmo.AfficherBienImmoParId(this.id).subscribe(data => {
      this.bien = data.biens[0];
      this.photos = this.bien.photos;
      this.latitude = this.bien.adresse.latitude;
      this.longitude = this.bien.adresse.longitude;
      // this.nombien = this.bien.nom;
      // this.description = this.bien.description;
      // this.status = this.bien.statut;
      // this.type = this.bien.statut;
      this.commodite = data.commodite
      console.log(this.bien);
      console.log(this.latitude);
      console.log(this.longitude);
      console.log(this.photos);
      // console.log(this.storageService.getUser().user.id);
      // console.log(this.bien.utilisateur.id);

      const currentUser = this.storageService.getUser();

  

      if (currentUser && this.bien && currentUser.user.id === this.bien.utilisateur.id) {
        this.currentUser = true;
        this.ModifBien = true;
      }

      for (const photo of this.photos) {
        const src = this.generateImageUrl(photo.nom); // Utilisez 'this.generateImageUrl'
        const caption = 'Caption for ' + photo.nom;

        this.albumsOne.push({ src: src, caption: caption });
        this.albumsTwo.push({ src: src, caption: caption });
      }
      // Options de la carte
      const mapOptions = {
        center: { lat: this.latitude, lng: this.longitude }, // Coordonnées du centre de la carte
        zoom: 15, // Niveau de zoom initial
      };
      // Initialiser la carte dans l'élément avec l'ID "map"
      const mapElement = document.getElementById("map");
      const map = new google.maps.Map(mapElement, mapOptions);

      // Créer un marqueur pour l'emplacement
      const marker = new google.maps.Marker({
        position: { lat: this.latitude, lng: this.longitude },
        map: map,
        title: "Adresse", // Titre du marqueur (optionnel)
      });

    });

    const Users = this.storageService.getUser();
    console.log(Users);
    const token = Users.token;
    // console.log(token);
    this.serviceUser.setAccessToken(token);

    //AFFICHER LA LISTE DES commentaireS EN FONCTION D'UN BIEN
    this.servicecommentaire.AffichercommentaireParBien(this.id).subscribe(data => {
      this.commentaire = data.reverse();
      console.log(this.commentaire);
    });

    //AFFICHER LA LISTE DES COMMODITES
    this.serviceCommodite.AfficherLaListeCommodite().subscribe((data) => {
      this.les_commodite = data.commodite;
      this.adresse = data;
      this.pays = data.pays;
      this.region = data.region.reverse();
      this.commune = data.commune;
      this.periode = data.periode;
      this.typebien = data.type;
      console.log(data);
    });



  }
  direction() {
    this.router.navigate([routes.servicedetails])
  }

  // FORMATER LE PRIX 
  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  getCurrentDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  //METHODE PERMETTANT DE FAIRE UN commentaire 
  Fairecommentaire(): void {
    this.id = this.route.snapshot.params["id"]
    // const Users = this.storageService.getUser();
    // console.log(Users);
    // const token = Users.token;
    // this.serviceUser.setAccessToken(token);

    const user = this.storageService.getUser();
    if (user && user.token) {
      // Définissez le token dans le service commentaireService
      this.serviceUser.setAccessToken(user.token);



      // Appelez la méthode Fairecommentaire() avec le contenu et l'ID
      this.servicecommentaire.Fairecommentaire(this.commentaireForm.contenu, this.id).subscribe(
        data => {
          console.log("commentaire envoyé avec succès:", data);
          // this.isSuccess = false;

          //AFFICHER LA LISTE DES commentaireS EN FONCTION D'UN BIEN
          this.servicecommentaire.AffichercommentaireParBien(this.id).subscribe(data => {
            this.commentaire = data.reverse();
            console.log(this.commentaire);
            this.commentaireForm.contenu = '';
          });
        },
        error => {
          console.error("Erreur lors de l'envoi du commentaire :", error);
          // Gérez les erreurs ici
        }
      );
    } else {
      console.error("Token JWT manquant");
    }

    //Faire un commentaire
    //  this.servicecommentaire.Fairecommentaire(this.commentaireForm.contenu, this.id).subscribe(data=>{
    //   console.log(data);
    // });
  }

  //METHODE PERMETTANT DE PRENDRE UN RENDEZ-VOUS
  PrendreRvd(): void {
    this.id = this.route.snapshot.params["id"]
    const user = this.storageService.getUser();
    if (user && user.token) {
      // Définissez le token dans le service serviceUser
      this.serviceUser.setAccessToken(user.token);



      // Appelez la méthode PrendreRdv() avec le contenu et l'ID
      this.serviceUser.PrendreRdv(this.RdvForm.date, this.RdvForm.heure, this.id).subscribe({
        next: (data) => {
          console.log("Rendez-vous envoyé avec succès:", data);
          this.isSuccess = true;
          this.errorMessage = 'Rendez-vous envoyé avec succès'
        },
        error: (err) => {
          console.error("Erreur lors de l'envoi du rdv :", err);
          this.errorMessage = err.error.message;
          this.isError = true
          // Gérez les erreurs ici
          if (this.RdvForm.date == null || this.RdvForm.heure == null) {
            this.errorMessage = 'Date et heure de rendez-vous sont obligatoire'
          }
        }
      }
      );
    } else {
      console.error("Token JWT manquant");
    }
  }


  //METHODE PERMETTANT DE CANDIDATER UN BIEN
  CandidaterBien(): void {
    this.id = this.route.snapshot.params["id"]
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
      text: "Etes-vous sûre de candidater ce bien?",
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

          // Appelez la méthode PrendreRdv() avec le contenu et l'ID
          this.serviceBienImmo.CandidaterBien(this.id).subscribe({
            next: (data) => {
              console.log("Candidature envoyée avec succès:", data);
              this.isSuccess = true;
              this.errorMessage = 'Candidature envoyée avec succès';
              // this.isCandidatureSent = true;
              // Afficher le premier popup de succès
              this.popUpConfirmation();
            },
            error: (err) => {
              console.error("Erreur lors de l'envoi du rdv :", err);
              this.errorMessage = err.error.message;
              this.isError = true
              // Gérez les erreurs ici
            }
          }
          );
        } else {
          console.error("Token JWT manquant");
        }
      }
    })
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
      timerProgressBar: true // ajouter la barre de progression du temps

    }).then((result) => {
      this.reloadPage();
      // Après avoir réussi à candidater, mettez à jour l'état de la candidature

    })
  }

  //METHODE PERMETTANT D'ACTUALISER LA PAGE
  reloadPage(): void {
    window.location.reload();
  }
  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO + '/uploads/images/';
    return baseUrl + photoFileName;
  }


  //OUVRIR UNE CONVERSATION EN FONCTION DE L'UTILISATEUR
  OuvrirConversation(id: any): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })
    swalWithBootstrapButtons.fire({
      // title: 'Etes-vous sûre de vous déconnecter?',
      text: "Etes-vous sûre d'ouvrir une conversation ?",
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



          // Appelez la méthode ACCEPTERCANDIDATUREBIEN() avec le contenu et l'ID
          this.serviceBienImmo.OuvrirConversation(id).subscribe({
            next: (data) => {
              console.log("Conversation ouverte avec succès:", data);
              this.isSuccess = true;
              // this.errorMessage = 'Conversation ouverte avec succès';
              this.pathConversation();
            },
            error: (err) => {
              console.error("Erreur lors de l'ouverture de la conversation:", err);
              this.errorMessage = err.error.message;
              this.isError = true
              // Gérez les erreurs ici
            }
          }
          );
        } else {
          console.error("Token JWT manquant");
        }
      }
    })
  }

  pathConversation() {
    this.router.navigate([routes.messages]);
  }

  //MODIFIER UN BIEN 
  ModifierBien(): void {
    //RECUPERER L'ID D'UN BIEN
    this.id = this.route.snapshot.params["id"]
    const {
      commodite,
      type,
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
      longitude,
      latitude,
      photo
    } = this.form;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })

    if (this.form.commodite === null
      || this.form.type === null
      || this.form.commune === null
      || this.form.nb_piece === null
      || this.form.nom === null
      || this.form.chambre === null
      || this.form.cuisine === null
      || this.form.toilette === null
      || this.form.surface === null
      || this.form.prix === null
      || this.form.statut === null
      || this.form.description === null
      || this.form.quartier === null
      || this.form.rue === null
      || this.form.porte === null
      || this.form.photo === null) {
      swalWithBootstrapButtons.fire(
        this.message = " Tous les champs sont obligatoires !",
      )
      // console.error('Tous les champs sont obligatoires !');

    } else {
      swalWithBootstrapButtons.fire({
        text: "Etes-vous sûre de bien vouloir modifier ce bien ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Annuler',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          const user = this.storageService.getUser();
          if (user && user.token) {
            this.serviceBienImmo.setAccessToken(user.token);
            this.serviceBienImmo
              .ModifierBien(
                commodite,
                type,
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
                longitude,
                latitude,
                photo,
                this.id
              )
              .subscribe({
                next: (data) => {
                  console.log(data);
                  this.isSuccess = false;
                  console.log(this.form);
                  this.popUpConfirmationModification();
                },
                error: (err) => {
                  console.log(err);
                  this.errorMessage = err.error.message;
                  this.isSuccess = true;
                },
              });
          } else {
            console.error('Token JWT manquant');
          }
        }
      })
    }

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
      confirmButtonColor: '#0857b5',
      showDenyButton: false,
      showCancelButton: false,
      allowOutsideClick: false,
      timer: timerInterval, // ajouter le temps d'attente
      timerProgressBar: true // ajouter la barre de progression du temps

    }).then((result) => {
      // Après avoir réussi à candidater, mettez à jour l'état de la candidature
      //RECUPERER L'ID D'UN BIEN
      this.id = this.route.snapshot.params["id"]

      //AFFICHER UN BIEN IMMO EN FONCTION DE SON ID
      this.serviceBienImmo.AfficherBienImmoParId(this.id).subscribe(data => {
        this.bien = data.biens[0];
        this.photos = this.bien.photos;
        this.commodite = data.commodite
        console.log(this.bien);
        console.log(this.photos);
        console.log(this.storageService.getUser().user.id);
        console.log(this.bien.utilisateur.id);

        const currentUser = this.storageService.getUser();

        if (currentUser && this.bien && currentUser.user.id === this.bien.utilisateur.id) {
          this.currentUser = true;
          this.ModifBien = true;
        }

        for (const photo of this.photos) {
          const src = this.generateImageUrl(photo.nom); // Utilisez 'this.generateImageUrl'
          const caption = 'Caption for ' + photo.nom;

          this.albumsOne.push({ src: src, caption: caption });
          this.albumsTwo.push({ src: src, caption: caption });
        }
        // console.log(this.bien.nb_piece);
      });
      return this.router.navigate(['pages/service-details', this.id])

    })
  }

}
