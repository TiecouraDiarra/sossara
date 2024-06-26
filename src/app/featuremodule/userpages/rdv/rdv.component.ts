import { Component, Inject, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { AuthService } from 'src/app/service/auth/auth.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { MessageService } from 'src/app/service/message/message.service';
import { RdvService } from 'src/app/service/rdv/rdv.service';
import Swal from 'sweetalert2';


const URL_PHOTO: string = environment.Url_PHOTO;



@Component({
  selector: 'app-rdv',
  templateUrl: './rdv.component.html',
  styleUrls: ['./rdv.component.scss']
})
export class RdvComponent {
  public routes = routes;
  isLocataire = false;
  isAgence = false;
  isAgent = false;
  roles: string[] = [];
  rdv: any;
  locale!: string;
  isProprietaire = false;
  profil: any;
  errorMessage: any = '';


  constructor(
    private authService: AuthService,
    private router: Router,
    private serviceUser: UserService,
    @Inject(LOCALE_ID) private localeId: string,
    private serviceRdv: RdvService,
    private storageService: StorageService
  ) {
    this.locale = localeId;
  }
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.serviceUser.AfficherUserConnecter().subscribe((data) => {
        this.profil = data[0]?.profil;
        if (this.profil == 'LOCATAIRE') {
          this.isLocataire = true;
        } else if (this.profil == 'AGENCE') {
          this.isAgence = true;
        } else if (this.profil == 'AGENT') {
          this.isAgent = true
        } else if (this.profil == 'PROPRIETAIRE') {
          this.isProprietaire = true
        }
      })
      // if (this.roles.includes("ROLE_LOCATAIRE")) {
      //   this.isLocataire = true
      // } else if (this.roles.includes("ROLE_AGENCE")) {
      //   this.isAgence = true
      // } else if (this.roles.includes("ROLE_AGENT")) {
      //   this.isAgent = true
      // }  else if (this.roles.includes("ROLE_PROPRIETAIRE")) {
      //   this.isProprietaire = true
      // }
    }

    //AFFICHER LA LISTE DES RDV RECU PAR USER CONNECTE
    //FAIT
    this.serviceUser.AfficherLaListeRdv().subscribe(data => {
      this.rdv = data.reverse();
      console.log(this.rdv);
    }
    );
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

  //METHODE PERMETTANT D'ACCEPTER UN RDV
  AccepterRdv(uuid: any): void {
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
        text: 'Etes-vous sûre d\'accepter ce rendez-vous ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Accepter',
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
            this.serviceRdv.AccepterRdv(uuid).subscribe({
              next: (data) => {
                if (data.status) {
                  let timerInterval = 2000;
                  Swal.fire({
                    position: 'center',
                    text: data.message,
                    title: "Acceptation du rendez-vous",
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
                    this.serviceUser.AfficherLaListeRdv().subscribe(data => {
                      this.rdv = data.reverse();
                    }
                    );
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
            text: "Vous avez annulé l'acceptation du rendez-vous.",
            icon: 'info',
            showConfirmButton: false, // Supprime le bouton "OK"
            timer: 2000, // Durée en millisecondes (par exemple, 3000 ms pour 3 secondes)
          });

          // Vous n'avez pas besoin de setTimeout pour fermer cette notification, car "timer" le fait automatiquement après la durée spécifiée.
        }
      });
  }


  //METHODE PERMETTANT D'ANNULER UN RDV
  AnnulerRdv(uuid: any): void {
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
        text: 'Etes-vous sûre d\'annuler ce rendez-vous ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Accepter',
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
            this.serviceRdv.AnnulerRdv(uuid).subscribe({
              next: (data) => {
                if (data.status) {
                  let timerInterval = 2000;
                  Swal.fire({
                    position: 'center',
                    text: data.message,
                    title: "Annulation du rendez-vous",
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
                    this.serviceUser.AfficherLaListeRdv().subscribe(data => {
                      this.rdv = data.reverse();
                    }
                    );
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
            text: "Vous avez annulé l'acceptation du rendez-vous.",
            icon: 'info',
            showConfirmButton: false, // Supprime le bouton "OK"
            timer: 2000, // Durée en millisecondes (par exemple, 3000 ms pour 3 secondes)
          });

          // Vous n'avez pas besoin de setTimeout pour fermer cette notification, car "timer" le fait automatiquement après la durée spécifiée.
        }
      });
  }

}
