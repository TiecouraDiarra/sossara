import { Component, Inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { AuthService } from 'src/app/service/auth/auth.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { DataService } from 'src/app/service/data.service';
import { ModepaiementService } from 'src/app/service/modepaiement/modepaiement.service';
import { NotificationService } from 'src/app/service/notification/notification.service';
import Swal from 'sweetalert2';

const URL_PHOTO: string = environment.Url_PHOTO;


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  public routes = routes;
  locale!: string;
  isLocataire = false;
  isAgence = false;
  isProprietaire = false;
  profil: any;
  today: Date;
  candidature: any[] = [];
  paiement: any[] = [];
  rdv: any[] = [];
  message: any[] = [];
  notifications: any
  senderCheck: any;
  users: any;
  errorMessage: any = '';
  loadingPage = false;
  loadingCandidature: boolean = true;
  loadingRdv: boolean = true;
  loadingMessage: boolean = true;
  loadingPaiement: boolean = true;
  intervalSubscription!: Subscription;


  ngOnDestroy(): void {
    // Arrêtez l'intervalle lorsqu'on quitte la page
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }




  public reviewdata: any = []
  constructor(
    private dataservice: DataService,
    private authService: AuthService,
    private storageService: StorageService,
    private notificationService: NotificationService,
    @Inject(LOCALE_ID) private localeId: string,
    private serviceUser: UserService,
    private router: Router,
  ) {
    this.locale = localeId;
    this.reviewdata = this.dataservice.reviewdata;
    this.today = new Date();

  }
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.serviceUser.AfficherUserConnecter().subscribe((data) => {
        this.users = data && data.length > 0 ? data[0] : null;
        this.senderCheck = this.users?.email;
        this.profil = data[0]?.profil;
        if (this.profil == 'LOCATAIRE') {
          this.isLocataire = true;
        } else if (this.profil == 'AGENCE') {
          this.isAgence = true;
        } else if (this.profil == 'AGENT') {
          // this.isAgent = true
        } else if (this.profil == 'PROPRIETAIRE') {
          this.isProprietaire = true
        }
      })
    }

    //AFFICHER LA LISTE DES NOTIFICATIONS DE USER CONNECTE
    // this.AfficherLesNotifi();
    this.checkNotifications();
    // Vérifiez les notifications toutes les 5 secondes
    this.intervalSubscription = interval(30000).subscribe(() => this.checkNotifications());
  }

  checkNotifications(): void {
    this.notificationService.AfficherListeNotification().subscribe(data => {
      this.loadingCandidature = true;
      this.loadingRdv = true;
      this.loadingMessage = true;
      this.loadingPaiement = true;

      // Réinitialiser les tableaux
      this.notifications = [];
      this.rdv = [];
      this.message = [];
      this.paiement = [];
      this.candidature = [];

      this.notifications = data.reverse().slice(0, 3);
      this.notifications.forEach((Notification: any) => {
        if (Notification.rdv) {
          this.rdv.push(Notification);
        }
        if (Notification.message) {
          this.message.push(Notification);
        }
        if (Notification.paiement) {
          this.paiement.push(Notification);
        }
        if (Notification.candidature) {
          this.candidature.push(Notification);
        }
      });

      this.loadingCandidature = false;
      this.loadingRdv = false;
      this.loadingMessage = false;
      this.loadingPaiement = false;
    }, err => {
      this.loadingCandidature = false;
      this.loadingRdv = false;
      this.loadingMessage = false;
      this.loadingPaiement = false;
    });
  }

  AfficherLesNotifi(): void {
    this.notificationService.AfficherListeNotification().subscribe(data => {
      this.notifications = data.reverse().slice(0, 3);
      this.loadingPage = true;
      data.forEach((Notification: any) => {
        if (Notification.rdv) {
          this.rdv?.push(Notification);
        }
        // Vérifier message
        if (Notification.message) {
          this.message?.push(Notification);
        }

        // Vérifier paiement
        if (Notification.paiement) {
          this.paiement?.push(Notification);
        }

        // Vérifier candidature
        if (Notification.candidature) {
          this.candidature?.push(Notification);
        }

        //   // Le reste de votre logique pour traiter les favoris...
      });
      
      
    }
    );
  }

  //METHODE PERMETTANT DE SUPPRIMER UNE NOTIFICATION
  Supprimer(id: any): void {
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
        text: 'Etes-vous sûre de suppimer cette notification?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          const user = this.storageService.getUser();
          if (user && user.token) {
            // Définissez le token dans le service serviceUser
            this.serviceUser.setAccessToken(user.token);

            // Appelez la méthode PrendreRdv() avec le contenu et l'ID
            this.notificationService.SupprimerNotification(id).subscribe({
              next: (data) => {
                if (data.status) {
                  let timerInterval = 2000;
                  Swal.fire({
                    position: 'center',
                    text: data.message,
                    title: "Suppression d'une notification",
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
                    //AFFICHER LA LISTE DES NOTIFICATIONS DE USER CONNECTE
                    this.AfficherLesNotifi();
                    window.location.reload();
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

              },
            });
          } else {

          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // L'utilisateur a annulé l'action
          const cancelNotification = Swal.fire({
            title: 'Action annulée',
            text: "Vous avez annulé la suppression.",
            icon: 'info',
            showConfirmButton: false, // Supprime le bouton "OK"
            timer: 2000, // Durée en millisecondes (par exemple, 3000 ms pour 3 secondes)
          });

          // Vous n'avez pas besoin de setTimeout pour fermer cette notification, car "timer" le fait automatiquement après la durée spécifiée.
        }
      });
  }

  //METHODE PERMETTANT DE SE DECONNECTER
  logout(): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'swal2-confirm btn',
        cancelButton: 'swal2-cancel btn',
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

  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }

  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO;
    return baseUrl + photoFileName;
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS BIEN
  goToDettailBien(id: number) {
    return this.router.navigate(['details-bien', id]);
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS MESSAGES
  goToDetailMessage(id: any) {
    window.sessionStorage.setItem("chatUuid", id);
    return this.router.navigate(['userpages/chat']);
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE CONTRAT
  goToPageContrat(id: number) {
    return this.router.navigate(['userpages/contrat', id])
  }
}
