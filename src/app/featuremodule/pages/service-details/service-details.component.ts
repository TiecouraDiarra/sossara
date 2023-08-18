import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lightbox } from 'ngx-lightbox';
import { routes } from 'src/app/core/helpers/routes/routes';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { CommentaireService } from 'src/app/service/commentaire/commentaire.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.css']
})
export class ServiceDetailsComponent {
  public routes = routes;
  public albumsOne: any = [];
  public albumsTwo: any = [];
  bien: any
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

  CommentaireForm: any = {
    contenu: null,
  }

  getFullImagePath(imageName: string): string {
    // Assurez-vous que le chemin de base est correctement configuré
    const basePath = 'https://chemin-vers-votre-serveur/';
    return basePath + imageName;
  }

    // IMAGE PAR DEFAUT USER
    handleAuthorImageError(event: any) {
      event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
    }

  photos: any;

  RdvForm: any = {
    date: null,
    heure: null
  }

  constructor(
    private _lightbox: Lightbox,
    public router: Router,
    private serviceBienImmo: BienimmoService,
    private serviceUser: UserService,
    private storageService: StorageService,
    private serviceCommentaire: CommentaireService,
    private route: ActivatedRoute,
  ) {
    for (let i = 5; i <= 12; i++) {
      const src = 'assets/img/gallery/gallery1/gallery-' + i + '.jpg';
      const caption = 'Image ' + i + ' caption here';

      this.albumsOne.push({ src: src });
      this.albumsTwo.push({ src: src });


    }

  }
  open(index: number, albumArray: Array<any>): void {
    this._lightbox.open(albumArray, index);
  }
  openAll(albumArray: Array<any>): void {
    this._lightbox.open(albumArray);
  }


  close(): void {
    this._lightbox.close();
  }
  ngOnInit(): void {

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
      this.commodite = data.commodite
      console.log(this.bien);
      console.log(this.photos);
      // console.log(this.bien.nb_piece);
    });

    const Users = this.storageService.getUser();
    console.log(Users);
    const token = Users.token;
    // console.log(token);
    this.serviceUser.setAccessToken(token);

    //AFFICHER LA LISTE DES COMMENTAIRES EN FONCTION D'UN BIEN
    this.serviceCommentaire.AfficherCommentaireParBien(this.id).subscribe(data => {
      this.commentaire = data.reverse();
      console.log(this.commentaire);
    });


  }
  direction() {
    this.router.navigate([routes.servicedetails])
  }
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

  //METHODE PERMETTANT DE FAIRE UN COMMENTAIRE 
  FaireCommentaire(): void {
    this.id = this.route.snapshot.params["id"]
    // const Users = this.storageService.getUser();
    // console.log(Users);
    // const token = Users.token;
    // this.serviceUser.setAccessToken(token);

    const user = this.storageService.getUser();
    if (user && user.token) {
      // Définissez le token dans le service CommentaireService
      this.serviceUser.setAccessToken(user.token);



      // Appelez la méthode FaireCommentaire() avec le contenu et l'ID
      this.serviceCommentaire.FaireCommentaire(this.CommentaireForm.contenu, this.id).subscribe(
        data => {
          console.log("Commentaire envoyé avec succès:", data);
          // this.isSuccess = false;

          //AFFICHER LA LISTE DES COMMENTAIRES EN FONCTION D'UN BIEN
          this.serviceCommentaire.AfficherCommentaireParBien(this.id).subscribe(data => {
            this.commentaire = data.reverse();
            console.log(this.commentaire);
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

    //Faire un Commentaire
    //  this.serviceCommentaire.FaireCommentaire(this.CommentaireForm.contenu, this.id).subscribe(data=>{
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
              this.isCandidatureSent = true;
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
    const baseUrl = 'http://192.168.1.6:8000/uploads/images/';
    return baseUrl + photoFileName;
  }

}
