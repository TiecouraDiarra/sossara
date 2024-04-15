import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { AuthService } from 'src/app/service/auth/auth.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { DataService } from 'src/app/service/data.service';
import { ModepaiementService } from 'src/app/service/modepaiement/modepaiement.service';
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
  nombreMoisChoisi: number = 0;
  nombreJourChoisi: number = 0;
  nombreSemaineChoisi: number = 0;
  isAgence = false;
  isProprietaire= false;
  roles: string[] = [];
  nombreMois: any = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  modepaiement: any;
  CandidatureUser: any;
  selectedPaymentMode: any;
  idCandidature: any;
  onNombreMoisChange(): void {
     // const selectElement = event.target as HTMLSelectElement;
    // this.nombreMoisChoisi = parseInt(selectElement.value, 10);
  }
  onNombreJourChange(): void {
   
  }

  onNombreSemaineChange(): void {
    
  }

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
  bien: any;
  // bienVendu: any[] = [];

  // Fonction pour ouvrir le modal avec l'ID de la transaction
  openFactureModal(bienImmoId: number) {
    // Stockez l'ID du BienImmo sélectionné dans la variable
    this.selectedFactureId = bienImmoId;
  
    // Incrémentez le numéro de facture à chaque fois que cette fonction est appelée
    this.factureNumber++;
    //AFFICHER LA LISTE DES BIENS PAR UTILISATEUR
    this.serviceBienImmo.AfficherCandidatureAccepter(this.selectedFactureId).subscribe(data => {
      this.transaction = data.biens[0];
     });

  }

  // Fonction pour ouvrir le modal avec l'ID du BienImmo
  openPaiementModal(candidatureId: number) {
    // Stockez l'ID du BienImmo sélectionné dans la variable
    this.selectedBienImmoId = candidatureId;
     //AFFICHER UNE CANDIDATURE EN FONCTION DE SON ID
    this.serviceBienImmo.AfficherCandidatureParUuId(this.selectedBienImmoId).subscribe(data => {
      this.CandidatureUser = data;
     })
  }



  public reviewdata: any = []
  constructor(
    private dataservice: DataService,
    private authService: AuthService,
    private storageService: StorageService,
    private modepaiementService: ModepaiementService,
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
       if (this.roles.includes("ROLE_LOCATAIRE")) {
        this.isLocataire = true
      } else if (this.roles.includes("ROLE_AGENCE")) {
        this.isAgence = true
      } else if (this.roles.includes("ROLE_AGENT")) {
        // this.isAgent = true
      } else if (this.roles.includes("ROLE_PROPRIETAIRE")) {
        this.isProprietaire = true
      }
    }
     this.User = this.storageService.getUser().id;
    const Users = this.storageService.getUser();
     const token = Users.token;
    this.serviceUser.setAccessToken(token);

    //AFFICHER LA LISTE DES RDV
    // FAIT
    this.serviceUser.AfficherLaListeRdv().subscribe(data => {
      this.rdv = data.reverse();
      // this.nombreRdvUser = data.length;
     }
    );

    //AFFICHER LA LISTE DES MODES DE PAIEMENTS
    this.modepaiementService.AfficherListeModePaiement().subscribe(data => {
      this.modepaiement = data.reverse();
     }
    );

    //AFFICHER LA LISTE DES CANDIDATURE PAR USER
    //FAIT
    this.serviceUser.AfficherLaListeCandidature().subscribe(data => {
      // this.candidature = data.reverse();
      // this.nombreRdvUser = data.length;
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

    //AFFICHER LA LISTE DES BIENS LOUES DONT LES CANDIDATURES SONT ACCEPTEES EN FONCTION DES LOCATAIRES
    //fait
    this.serviceBienImmo.AfficherBienImmoLoueCandidatureAccepter().subscribe(data => {
      this.bienImmoLoueCandidatureAccepter = data.reverse();
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
             this.storageService.clean();
            this.router.navigateByUrl("/auth/connexion")
          },
          error: err => {
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
               this.isSuccess = true;
              this.errorMessage = 'Candidature acceptée avec succès';

              // Afficher le premier popup de succès
              this.popUpConfirmation();
            },
            error: (err) => {
              this.errorMessage = err.error.message;
              this.isError = true
              // Gérez les erreurs ici
            }
          }
          );
        } else {
        }
      }
    })
  }

  //ID DE LA CANDIDATURE D'UN BIEN
  IdCandidaterBien(id: any): void {
    sessionStorage.removeItem("idCandidature");
    this.idCandidature = id;
    sessionStorage.setItem('idCandidature', id)
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
               this.isSuccess = true;
              this.errorMessage = 'Candidature annulée avec succès';
              // Afficher le premier popup d'annulation
              this.popUpAnnulation();
            },
            error: (err) => {
            
              this.errorMessage = err.error.message;
              this.isError = true
              // Gérez les erreurs ici
            }
          }
          );
        } else {
          
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
    return price?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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

  selectPaymentMode(mode: any) {
    // Enregistrez le mode de paiement sélectionné dans une variable ou envoyez-le directement à la méthode goToPaymentPage
    this.selectedPaymentMode = mode; // Vous pouvez stocker le mode sélectionné dans une variable
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE PAIMENT
  goToPagePaiement(uuid: number) {
    if (this.selectedPaymentMode) {
      switch (this.selectedPaymentMode.nom) {
        case "Orange Money":
          this.router.navigate(['/userpages/paiement-orangemoney', uuid]).then(() => {
            window.location.reload();
          });
          break;
        case "Visa":
          this.router.navigate(['/userpages/paiement-visa', uuid]).then(() => {
            window.location.reload();
          });
          break;
        case "GIM":
          this.router.navigate(['/userpages/paiement-gim', uuid]).then(() => {
            window.location.reload();
          });
          break;
        default:
           break;
      }
    } else {
     }
  }


  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE CONTRAT
  goToPageContrat(id: number) {
     return this.router.navigate(['userpages/contrat', id])
  }
}
