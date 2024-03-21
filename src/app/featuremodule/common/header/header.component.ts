import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { routes } from 'src/app/core/helpers/routes/routes';
import { SidebarService } from 'src/app/service/sidebar.service';
import { CommonService } from 'src/app/service/common.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/service/auth/auth.service';
import { environment } from 'src/app/environments/environment';
import { UserService } from 'src/app/service/auth/user.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { TranslationService } from 'src/app/service/translation/translation.service';



const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public routes = routes;
  base: string = '';
  page: string = '';
  last: string = '';
  User: any
  isLocataire = false;
  roles: string[] = [];
  // Dans votre composant TypeScript
isMobile: boolean = false; // Initialisez-la à false par défaut ou déterminez-la dynamiquement
@HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenWidth();
  }

  checkScreenWidth() {
    this.isMobile = window.innerWidth < 768; // Vous pouvez ajuster la valeur (768) selon vos besoins
  }

  public somme: number = 0
  nombreCandidatureBienUser: number = 0
  nombreCandidatureAccepter: number = 0
  nombreRdvUser: number = 0

  isLoggedIn = false;
  isLoginFailed = true;
  errorMessage = '';



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
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
      if (this.roles[0] == "ROLE_LOCATAIRE") {
        this.isLocataire = true
      }
      // this.roles = this.storageService.getUser().roles;
    } else if (!this.storageService.isLoggedIn()) {
      this.isLoginFailed = false;
    }



    //AFFICHER LA LISTE DES BIENS LOUES DONT LES CANDIDATURES SONT ACCEPTEES EN FONCTION DES LOCATAIRES
    this.serviceBienImmo.AfficherBienImmoLoueCandidatureAccepter().subscribe(data => {
      this.nombreCandidatureAccepter = data?.length;
      //AFFICHER LA LISTE DES RDV RECU PAR USER CONNECTE
      this.serviceUser.AfficherLaListeRdv().subscribe(data => {
        this.nombreRdvUser = data?.length;
      }
      );
      //AFFICHER LA LISTE DES CANDIDATURE PAR USER
      this.serviceUser.AfficherLaListeCandidature().subscribe(data => {
        this.nombreCandidatureBienUser = data?.length;
        // Calculer la somme des candidatures et des rendez-vous
        this.somme = this.nombreRdvUser + this.nombreCandidatureBienUser + this.nombreCandidatureAccepter;

      });
    });



    this.serviceUser.AfficherUserConnecter().subscribe((data) => {
      this.users = data[0];
    });
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
    if (this.storageService.isLoggedIn()) {
      this.router.navigateByUrl("/userpages/ajouter-bien")
    } else {
      this.router.navigateByUrl("/auth/connexion")
    }
  }

  reloadPage(): void {
    window.location.reload();
  }

}
