import { Component, Inject, LOCALE_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { ContratService } from 'src/app/service/contrat/contrat.service';
import { FactureService } from 'src/app/service/facture/facture.service';
import { ModepaiementService } from 'src/app/service/modepaiement/modepaiement.service';
import Swal from 'sweetalert2';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-contrat',
  templateUrl: './contrat.component.html',
  styleUrls: ['./contrat.component.scss']
})
export class ContratComponent {

  public routes = routes;
  id: any
  locale!: string;
  paiement: any;
  modepaiement: any;
  bien: any;
  photoImmo: any;
  transaction: any;
  locataire: any;
  proprietaire: any;
  modePaiement: any;
  contrat: any;
  // Déclarez une variable pour stocker l'ID du BienImmo sélectionné
  selectedFactureId: any;
  selectedPaymentMode: any;
  selectedBienImmoId: any;
  CandidatureUser: any;
  isAgenceProprietaire = false;
  roles: string[] = [];

  errorMessage: any = '';
  isSuccess: any = false;
  isError: any = false;

  constructor(
    private paiementService: ModepaiementService,
    @Inject(LOCALE_ID) private localeId: string,
    private serviceUser: UserService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private serviceContrat: ContratService,
    private router: Router,
    private modepaiementService: ModepaiementService,
    private serviceFacture: FactureService,

  ) {
    this.locale = localeId;
  }

  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src = 'assets/img/gallery/gallery1/gallery-1.jpg';
  }
  handleAuthorImageError1(event: any) {
    event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }
  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO;
    return baseUrl + photoFileName;
  }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.roles = this.storageService.getUser().roles;
      if (this.roles.includes("ROLE_AGENCE") || this.roles.includes("ROLE_PROPRIETAIRE")) {
        this.isAgenceProprietaire = true;
      }
    }


    //RECUPERER L'UUID D'UN CONTRAT 
    this.id = this.route.snapshot.params["uuid"]
    //AFFICHER UN PAIEMENT EN FONCTION DE SON ID
    this.serviceContrat.AfficherContratParUuId(this.id).subscribe(data => {
      this.contrat = data;
      this.bien = data?.bien;
      this.locataire = data?.locataire;
      this.proprietaire = data?.bien?.proprietaire;
      this.photoImmo = data?.bien?.photoImmos;
      console.log(this.contrat);
    })
  }
  //FORMATER LE PRIX
  formatPrice(price: number): string {
    return price?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }


  selectPaymentMode(mode: any) {
    // Enregistrez le mode de paiement sélectionné dans une variable ou envoyez-le directement à la méthode goToPaymentPage
    this.selectedPaymentMode = mode; // Vous pouvez stocker le mode sélectionné dans une variable
  }

  // Fonction pour ouvrir le modal avec l'ID du BienImmo
  openPaiementModal(candidatureId: number) {
    // Stockez l'ID du BienImmo sélectionné dans la variable
    this.selectedBienImmoId = candidatureId;
    console.log(this.selectedBienImmoId);
    //AFFICHER UNE CANDIDATURE EN FONCTION DE SON ID
    // this.serviceBienImmo.AfficherCandidatureParUuId(this.selectedBienImmoId).subscribe(data => {
    //   this.CandidatureUser = data;
    //   console.log(this.CandidatureUser);
    // })
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
          console.log("Mode de paiement non pris en charge.");
          break;
      }
    } else {
      console.log("Veuillez sélectionner un mode de paiement.");
    }
  }


  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE RECU
  goToPageRecu(id: number) {
    // console.log(id);
    return this.router.navigate(['userpages/recufacture', id])
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE LISTE RECU
  goToListeRecu(id: number) {
    // console.log(id);
    return this.router.navigate(['userpages/liste_recu', id])
  }


  //ANNULER LE CONTRAT LOCATAIRE
  AnnulerContratLocataire(id: any): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })
    swalWithBootstrapButtons.fire({
      // title: 'Etes-vous sûre de vous déconnecter?',
      text: "Etes-vous sûre d'annuler le contrat ?",
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
          // Appelez la méthode AnnulerContratLocataire() avec le contenu et l'ID
          this.serviceContrat.AnnulerContratLocataire(id).subscribe({
            next: (data) => {
              this.popUpAnnulation();
            },
            error: (err) => {
              // console.error("Erreur lors de l'annulation de la candidature :", err);
              // this.errorMessage = err.error.message;
              // this.isError = true
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

  //ANNULER LE CONTRAT PROPRIETAIRE
  AnnulerContratProprietaire(id: any): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })
    swalWithBootstrapButtons.fire({
      // title: 'Etes-vous sûre de vous déconnecter?',
      text: "Etes-vous sûre d'annuler le contrat ?",
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
          // Appelez la méthode AnnulerContratLocataire() avec le contenu et l'ID
          this.serviceContrat.AnnulerContratProprietaire(id).subscribe({
            next: (data) => {
              this.popUpAnnulation();
            },
            error: (err) => {
              // console.error("Erreur lors de l'annulation de la candidature :", err);
              // this.errorMessage = err.error.message;
              // this.isError = true
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

  //POPUP APRES ANNULATION DU CONTRAT
  popUpAnnulation() {
    let timerInterval = 2000;
    Swal.fire({
      position: 'center',
      text: 'Le contrat a été annulé avec succès.',
      title: 'Contrat annulée',
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

    })

  }


  //ACCEPTER LA CANDIDATURE D'UN BIEN PROPRIETAIRE C'EST A DIRE VALIDE
  ValiderContratProprietaire(): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })
    swalWithBootstrapButtons.fire({
      // title: 'Etes-vous sûre de vous déconnecter?',
      text: "Etes-vous sûre de valider le contrat ?",
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
          this.serviceContrat.AccepterCandidaterBien(sessionStorage.getItem("idCandidature")).subscribe({
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

  //POPUP APRES CONFIRMATION DE CANDIDATURE
  popUpConfirmation() {
    let timerInterval = 2000;
    Swal.fire({
      position: 'center',
      text: 'Le contrat a été validé avec succès.',
      title: 'Contrat validé',
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
    })

  }

  //VALIDER UN CONTRAT LOCATAIRE C'EST A DIRE VALIDE
  ValiderContratLocataire(id : number): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })
    swalWithBootstrapButtons.fire({
      // title: 'Etes-vous sûre de vous déconnecter?',
      text: "Etes-vous sûre de valider le contrat ?",
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
          this.serviceContrat.ValiderContratBien(id).subscribe({
            next: (data) => {
              // console.log("Candidature acceptée avec succès:", data);
              this.isSuccess = true;
              this.errorMessage = 'Contrat acceptée avec succès';

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
}
