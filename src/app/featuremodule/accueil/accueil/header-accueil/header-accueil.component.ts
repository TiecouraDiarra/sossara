import { Component, HostListener } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { AuthService } from 'src/app/service/auth/auth.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { CommonService } from 'src/app/service/common.service';
import { DataService } from 'src/app/service/data.service';
import { SidebarService } from 'src/app/service/sidebar.service';
import Swal from 'sweetalert2';

const URL_PHOTO: string = environment.Url_PHOTO;


@Component({
  selector: 'app-header-accueil',
  templateUrl: './header-accueil.component.html',
  styleUrls: ['./header-accueil.component.scss']
})
export class HeaderAccueilComponent {
//   public routes = routes;
//   public base: string = '';
//   public page: string = '';
//   public last: string = '';

//   isLoggedIn = false;
//   isLoginFailed = true;
//   errorMessage = '';
//   User: any
//   isLocataire = false;
//   roles: string[] = [];

//   public tittle: string = 'Home';
//   public nav: boolean = false;
//   users: any;
//   profil: any;

//   // IMAGE PAR DEFAUT USER
//   handleAuthorImageError(event: any) {
//     event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
//   }
//   //IMAGE
//   generateImageUrl(photoFileName: string): string {
//     const baseUrl = URL_PHOTO;
//     return baseUrl + photoFileName;
//   }

//   header: Array<any> = [];
//   sidebar: Array<any> = [];
//   constructor(
//     private data: DataService,
//     private router: Router,
//     private authService: AuthService,
//     private serviceUser: UserService,
//     private storageService: StorageService,
//     private sidebarService: SidebarService
//   ) {
//     this.header = this.data.header;
//     this.router.events.subscribe((event: any) => {
//       if (event instanceof NavigationStart) {
//         this.getroutes(event);
//       }
//     });
//     this.getroutes(this.router);
//   }
//   ngOnInit(): void {
//     if (this.storageService.isLoggedIn()) {
//       this.isLoggedIn = true;
//       // Récupérer les données de l'utilisateur connecté
//       // this.serviceUser.AfficherUserConnecter().subscribe((data) => {
//       //   this.users = data[0];
//       //   this.profil = this.users?.profil;
//       //   if (this.profil == 'LOCATAIRE') {
//       //     this.isLocataire = true
//       //   }
//       // })
//     } else if (!this.storageService.isLoggedIn()) {
//       this.isLoginFailed = false;
//     }

//   }

//   //METHODE PERMETTANT DE SE DECONNECTER
//   logout(): void {
//     const swalWithBootstrapButtons = Swal.mixin({
//       customClass: {
//         confirmButton: 'swal2-confirm btn',
//         cancelButton: 'swal2-cancel btn',
//       },
//       heightAuto: false
//     })
//     swalWithBootstrapButtons.fire({
//       // title: 'Etes-vous sûre de vous déconnecter?',
//       text: "Etes-vous sûre de vous déconnecter?",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Confirmer',
//       cancelButtonText: 'Annuler',
//       reverseButtons: true
//     }).then((result) => {
//       if (result.isConfirmed) {
//         this.authService.logout().subscribe({
//           next: res => {
//             this.storageService.clean();
//             this.router.navigateByUrl("/auth/connexion")
//           },
//           error: err => {
//           }
//         });
//       }
//     })

//   }



//   private getroutes(route: any): void {
//     let splitVal = route.url.split('/');
//     this.base = splitVal[1];
//     this.page = splitVal[2];
//     this.last = splitVal[3];

//     if (this.base == 'userpages') {
//       this.nav = false;
//     } else {
//       this.nav = true;
//     }
//   }
//   public toggleSidebar(): void {
//     this.sidebarService.openSidebar();
//   }
//   public hideSidebar(): void {
//     this.sidebarService.closeSidebar();
//   }

//   //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE AJOUTER BIEN SI TU ES CONNECTE DANS LE CAS CONTRAIRE LOGIN
//   AjouterBienOrLogin() {
//     if (this.storageService.isLoggedIn()) {
//       this.router.navigateByUrl("/userpages/ajouter-bien")
//     } else {
//       this.router.navigateByUrl("/auth/connexion")
//     }
//   }
// }







public routes = routes;
base: string = '';
page: string = '';
last: string = '';
User: any
isLocataire = false;
nomAgence : any;
isAgence = false;
nom : any;
isCompletedProfil = false;
roles: string[] = [];
// Dans votre composant TypeScript
isMobile: boolean = false; // Initialisez-la à false par défaut ou déterminez-la dynamiquement
profil: any;
completer= false;
@HostListener('window:resize', ['$event'])
onResize(event: any) {
  this.checkScreenWidth();
}

checkScreenWidth() {
  this.isMobile = window.innerWidth < 992; // Vous pouvez ajuster la valeur (768) selon vos besoins
}


public somme: number = 0
nombreCandidatureBienUser: number = 0
nombreCandidatureAccepter: number = 0
filteredData : number = 0

nombreRdvUser: number = 0

isLoggedIn = false;
isLoginFailed = true;
errorMessage = '';
isLoggedIn2=false
isLoginFailed2 =false 



public nav: boolean = false;
header: Array<any> = [];
sidebar: Array<any> = [];
users: any;

// IMAGE PAR DEFAUT USER
handleAuthorImageError(event: any) {
  event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
}
//IMAGE
generateImageUrl(photoFileName: string): string {
  const baseUrl = URL_PHOTO;
  return baseUrl + photoFileName;
}

constructor(
  private data: DataService,
  private router: Router,
  private common: CommonService,
  private serviceUser: UserService,
  private sidebarService: SidebarService,
  private serviceBienImmo: BienimmoService,
  private authService: AuthService,
  private storageService: StorageService
) {
  this.header = this.data.header;
  this.router.events.subscribe((event: any) => {
    if (event instanceof NavigationStart) {
      this.getroutes(event);
    }
  });
  this.getroutes(this.router);
  this.User = this.storageService.getUser();
}
ngOnInit(): void {
  this.checkScreenWidth();
  this.checkUserStatus();



}

checkUserStatus(): void {
  if (this.storageService.isLoggedIn()) {
   
    this.serviceUser.AfficherUserConnecter().subscribe(
      (data) => {
        this.users = data && data.length > 0 ? data[0] : null;
        this.completer = this.users?.profilCompleter;
        this.profil = this.users?.profil;
        if (!this.users) {
          window.localStorage.clear();
          return; // Sortir de la méthode si l'utilisateur n'est pas connecté
        }
        if(this.users){
          this.isLoggedIn2=true
          this.isLoginFailed2=false
        }
       
        
        if (this.profil === 'LOCATAIRE') {
          this.isLocataire = true;
        }
        if (this.profil === 'LOCATAIRE' || this.profil === 'PROPRIETAIRE' || this.profil === 'ADMIN' || this.profil === 'SUPERADMIN' || this.profil === 'AGENT') {
          this.isAgence = false
          this.nom = this.users?.nom
        }else{
          this.isAgence = true;
          this.nomAgence = this.users?.nomAgence
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des données de l\'utilisateur', error);
        this.isLoginFailed = true;
      }
    );
  } else {
    this.isLoginFailed = false;
  }
}
private getroutes(route: any): void {
  let splitVal = route.url.split('/');
  this.base = splitVal[1];
  this.page = splitVal[2];
  this.last = splitVal[3];



  if (
    this.base == 'userpages'
  ) {
    this.nav = false;
  }
  else {
    this.nav = true;
  }

}
public toggleSidebar(): void {
  this.sidebarService.openSidebar();
}
public hideSidebar(): void {
  this.sidebarService.closeSidebar();
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
          // this.router.navigateByUrl("/auth/connexion")
          this.router.navigate(['/auth/connexion']).then(() => {
            window.location.reload();
          })
        },
        error: err => {

        }
      });
    }
  })

}

//LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE AJOUTER BIEN SI TU ES CONNECTE DANS LE CAS CONTRAIRE LOGIN
AjouterBienOrLogin() {
  if (this.isLoggedIn2) {
    this.router.navigateByUrl("/userpages/ajouter-bien")
  } else {
    this.router.navigateByUrl("/auth/connexion")
  }
}

reloadPage(): void {
  window.location.reload();
}

}
