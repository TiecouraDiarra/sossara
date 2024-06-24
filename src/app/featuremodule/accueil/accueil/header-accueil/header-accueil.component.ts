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
  public routes = routes;
  public base: string = '';
  public page: string = '';
  public last: string = '';

  isLoggedIn = false;
  isLoginFailed = true;
  errorMessage = '';
  User: any
  isLocataire = false;
  roles: string[] = [];

  public tittle: string = 'Home';
  public nav: boolean = false;
  users: any;
  profil: any;

  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }
  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO;
    return baseUrl + photoFileName;
  }

  header: Array<any> = [];
  sidebar: Array<any> = [];
  constructor(
    private data: DataService,
    private router: Router,
    private authService: AuthService,
    private serviceUser: UserService,
    private storageService: StorageService,
    private sidebarService: SidebarService
  ) {
    this.header = this.data.header;
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        this.getroutes(event);
      }
    });
    this.getroutes(this.router);
  }
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      // Récupérer les données de l'utilisateur connecté
      // this.serviceUser.AfficherUserConnecter().subscribe((data) => {
      //   this.users = data[0];
      //   this.profil = this.users?.profil;
      //   if (this.profil == 'LOCATAIRE') {
      //     this.isLocataire = true
      //   }
      // })
    } else if (!this.storageService.isLoggedIn()) {
      this.isLoginFailed = false;
    }

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



  private getroutes(route: any): void {
    let splitVal = route.url.split('/');
    this.base = splitVal[1];
    this.page = splitVal[2];
    this.last = splitVal[3];

    if (this.base == 'userpages') {
      this.nav = false;
    } else {
      this.nav = true;
    }
  }
  public toggleSidebar(): void {
    this.sidebarService.openSidebar();
  }
  public hideSidebar(): void {
    this.sidebarService.closeSidebar();
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE AJOUTER BIEN SI TU ES CONNECTE DANS LE CAS CONTRAIRE LOGIN
  AjouterBienOrLogin() {
    if (this.storageService.isLoggedIn()) {
      this.router.navigateByUrl("/userpages/ajouter-bien")
    } else {
      this.router.navigateByUrl("/auth/connexion")
    }
  }
}





