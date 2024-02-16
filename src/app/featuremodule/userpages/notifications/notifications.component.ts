import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { AuthService } from 'src/app/service/auth/auth.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { DataService } from 'src/app/service/data.service';
import Swal from 'sweetalert2';

const URL_PHOTO: string = environment.Url_PHOTO;


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  public routes = routes;
  rdv: any;
  User: any;
  candidature: any[] = [];
  locale!: string;
  isLocataire = false;
  isAgence = false;
  roles: string[] = [];

  errorMessage: any = '';
  isSuccess: any = false;
  isError: any = false;
  bienImmoLoueCandidatureAccepter: any
  // Déclarez une variable pour stocker l'ID du BienImmo sélectionné
  selectedBienImmoId: any;
  // Déclarez une variable pour stocker l'ID du BienImmo sélectionné
  selectedFactureId: any;
  factureNumber: number = 1; // Numéro de facture initial
  transaction: any
  today: Date;

  candidatureAccepter: any[] = [];
  candidatureAnnuler: any[] = [];
  // bienVendu: any[] = [];

  // Fonction pour ouvrir le modal avec l'ID de la transaction
  openFactureModal(bienImmoId: number) {
    // Stockez l'ID du BienImmo sélectionné dans la variable
    this.selectedFactureId = bienImmoId;
    // console.log(this.selectedFactureId);
    // Générer un numéro aléatoire entre 1 et 1000 (vous pouvez ajuster la plage selon vos besoins)
    // this.factureNumber = Math.floor(Math.random() * 1000) + 1;
    // Incrémentez le numéro de facture à chaque fois que cette fonction est appelée
    this.factureNumber++;
    //AFFICHER LA LISTE DES BIENS PAR UTILISATEUR
    this.serviceBienImmo.AfficherCandidatureAccepter(this.selectedFactureId).subscribe(data => {
      this.transaction = data.biens[0];
      // console.log(this.transaction);
    });

  }


  public reviewdata: any = []
  constructor(
    private dataservice: DataService,
    private authService: AuthService,
    private storageService: StorageService,
    @Inject(LOCALE_ID) private localeId: string,
    private serviceBienImmo: BienimmoService,
    private serviceUser: UserService,
    private router: Router,
  ) {
    this.locale = localeId;
    this.reviewdata = this.dataservice.reviewdata;
    this.today = new Date();

  }
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      // this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
      // console.log(this.roles);
      if (this.roles[0] == "ROLE_LOCATAIRE") {
        this.isLocataire = true
      } else if (this.roles[0] == "ROLE_AGENCE") {
        this.isAgence = true
      }
    }
    // console.log(this.storageService.getUser());
    this.User = this.storageService.getUser().id;
    const Users = this.storageService.getUser();
    // console.log(this.User);
    const token = Users.token;
    this.serviceUser.setAccessToken(token);

    //AFFICHER LA LISTE DES RDV
    // FAIT
    this.serviceUser.AfficherLaListeRdv().subscribe(data => {
      this.rdv = data.reverse();
      // this.nombreRdvUser = data.length;
      // console.log(this.rdv);
    }
    );

    //AFFICHER LA LISTE DES CANDIDATURE PAR USER
    this.serviceUser.AfficherLaListeCandidature().subscribe(data => {
      // this.candidature = data.reverse();
      // this.nombreRdvUser = data.length;
      console.log(this.candidature);
      // Filtrer les biens immobiliers
      data.forEach((Candidature: any) => {
        if (Candidature.isAccepted === false && Candidature.isCancel === false) {
          this.candidature?.push(Candidature);
        }
        // Vérifier si le bien est déjà loué
        if (Candidature.isAccepted === true) {
          this.candidatureAccepter?.push(Candidature);
        }

        // Vérifier si le bien est déjà vendu
        if (Candidature.isCancel === true) {
          this.candidatureAnnuler?.push(Candidature);
        }

        // Le reste de votre logique pour traiter les favoris...
      });
      // Afficher les biens déjà loués et déjà vendus
      console.log('candidatureAccepter :', this.candidatureAccepter);
      console.log('candidatureAnnuler :', this.candidatureAnnuler);
      console.log('candidature :', this.candidature);
    }
    );

    //AFFICHER LA LISTE DES BIENS LOUES DONT LES CANDIDATURES SONT ACCEPTEES EN FONCTION DES LOCATAIRES
    //fait
    this.serviceBienImmo.AfficherBienImmoLoueCandidatureAccepter().subscribe(data => {
      this.bienImmoLoueCandidatureAccepter = data.reverse();
      console.log("candiat",this.bienImmoLoueCandidatureAccepter);
    });
  }

  //METHODE PERMETTANT DE SE DECONNECTER
  logout(): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })
    swalWithBootstrapButtons.fire({
      // title: 'Etes-vous sûre de vous déconnecter?',
      text: "Etes-vous sûre de vous déconnecter?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout().subscribe({
          next: res => {
            // console.log(res);
            this.storageService.clean();
            this.router.navigateByUrl("/auth/connexion")
          },
          error: err => {
            // console.log(err);
          }
        });
      }
    })

  }

  //ACCEPTER LA CANDIDATURE D'UN BIEN
  AccepterCandidaterBien(id: any): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })
    swalWithBootstrapButtons.fire({
      // title: 'Etes-vous sûre de vous déconnecter?',
      text: "Etes-vous sûre de valider cette candidature?",
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
          this.serviceBienImmo.AccepterCandidaterBien(id).subscribe({
            next: (data) => {
              // console.log("Candidature acceptée avec succès:", data);
              this.isSuccess = true;
              this.errorMessage = 'Candidature acceptée avec succès';

              // Afficher le premier popup de succès
              this.popUpConfirmation();
            },
            error: (err) => {
              // console.error("Erreur lors de l'envoi de la candidature :", err);
              this.errorMessage = err.error.message;
              this.isError = true
              // Gérez les erreurs ici
            }
          }
          );
        } else {
          // console.error("Token JWT manquant");
        }
      }
    })
  }

  //ANNULER LA CANDIDATURE D'UN BIEN
  AnnulerCandidaterBien(id: any): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })
    swalWithBootstrapButtons.fire({
      // title: 'Etes-vous sûre de vous déconnecter?',
      text: "Etes-vous sûre d'annuler cette candidature?",
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



          // Appelez la méthode ANNULERCANDIDATUREBIEN() avec le contenu et l'ID
          this.serviceBienImmo.AnnulerCandidaterBien(id).subscribe({
            next: (data) => {
              // console.log("Candidature annulée avec succès:", data);
              this.isSuccess = true;
              this.errorMessage = 'Candidature annulée avec succès';
              // Afficher le premier popup d'annulation
              this.popUpAnnulation();
            },
            error: (err) => {
              // console.error("Erreur lors de l'annulation de la candidature :", err);
              this.errorMessage = err.error.message;
              this.isError = true
              // Gérez les erreurs ici
            }
          }
          );
        } else {
          // console.error("Token JWT manquant");
        }
      }
    })
  }

  //POPUP APRES CONFIRMATION DE CANDIDATURE
  popUpConfirmation() {
    let timerInterval = 2000;
    Swal.fire({
      position: 'center',
      text: 'La candidature a été acceptée avec succès.',
      title: 'Candidature acceptée',
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
      //AFFICHER LA LISTE DES CANDIDATURE PAR USER
    this.serviceUser.AfficherLaListeCandidature().subscribe(data => {
      // this.candidature = data.reverse();
      // this.nombreRdvUser = data.length;
      console.log(this.candidature);
      // Filtrer les biens immobiliers
      data.forEach((Candidature: any) => {
        if (Candidature.isAccepted === false && Candidature.isCancel === false) {
          this.candidature?.push(Candidature);
        }
        // Vérifier si le bien est déjà loué
        if (Candidature.isAccepted === true) {
          this.candidatureAccepter?.push(Candidature);
        }

        // Vérifier si le bien est déjà vendu
        if (Candidature.isCancel === true) {
          this.candidatureAnnuler?.push(Candidature);
        }

        // Le reste de votre logique pour traiter les favoris...
      });
    }
    );
    })

  }

  //POPUP APRES ANNULATION DE CANDIDATURE
  popUpAnnulation() {
    let timerInterval = 2000;
    Swal.fire({
      position: 'center',
      text: 'La candidature a été annulée avec succès.',
      title: 'Candidature annulée',
      icon: 'error',
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
      //AFFICHER LA LISTE DES CANDIDATURE PAR USER
    this.serviceUser.AfficherLaListeCandidature().subscribe(data => {
      // this.candidature = data.reverse();
      // this.nombreRdvUser = data.length;
      console.log(this.candidature);
      // Filtrer les biens immobiliers
      data.forEach((Candidature: any) => {
        if (Candidature.isAccepted === false && Candidature.isCancel === false) {
          this.candidature?.push(Candidature);
        }
        // Vérifier si le bien est déjà loué
        if (Candidature.isAccepted === true) {
          this.candidatureAccepter?.push(Candidature);
        }

        // Vérifier si le bien est déjà vendu
        if (Candidature.isCancel === true) {
          this.candidatureAnnuler?.push(Candidature);
        }

        // Le reste de votre logique pour traiter les favoris...
      });
     
    }
    );
    })

  }

  //FORMATER LE PRIX
  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO;
    return baseUrl + photoFileName;
  }

  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }
}
