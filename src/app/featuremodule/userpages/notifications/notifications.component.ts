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
import { NotificationService } from 'src/app/service/notification/notification.service';
import Swal from 'sweetalert2';

const URL_PHOTO: string = environment.Url_PHOTO;


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
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
        console.log(data)
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
    this.notificationService.AfficherListeNotification().subscribe(data => {
      this.notifications = data.reverse().slice(0, 3);
      console.log(data);


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
      console.log(this.rdv);
      console.log(this.message);
    }
    );
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
}
