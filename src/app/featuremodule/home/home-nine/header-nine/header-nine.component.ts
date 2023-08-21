import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { AuthService } from 'src/app/service/auth/auth.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import { DataService } from 'src/app/service/data.service';
import { SidebarService } from 'src/app/service/sidebar.service';
import Swal from 'sweetalert2';

const URL_PHOTO: string = environment.Url_PHOTO;


@Component({
  selector: 'app-header-nine',
  templateUrl: './header-nine.component.html',
  styleUrls: ['./header-nine.component.scss']
})
export class HeaderNineComponent {
  public routes = routes;
  public base: string = '';
  public page: string = '';
  public last: string = '';

  isLoggedIn = false;
  isLoginFailed = true;
  errorMessage = '';
  User: any


  public tittle: string = 'Home';
  public nav: boolean = false;

    // IMAGE PAR DEFAUT USER
    handleAuthorImageError(event: any) {
      event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
    }
    //IMAGE
    generateImageUrl(photoFileName: string): string {
      const baseUrl = URL_PHOTO + '/uploads/images/';
      return baseUrl + photoFileName;
    }

  header: Array<any> = [];
  sidebar: Array<any> = [];
  constructor(
    private data: DataService,
    private router: Router,
    private authService: AuthService,
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
        // this.roles = this.storageService.getUser().roles;
      }else if (!this.storageService.isLoggedIn()) {
        this.isLoginFailed = false;
      }
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
              console.log(res);
              this.storageService.clean();
              this.router.navigateByUrl("/auth/connexion")
            },
            error: err => {
              console.log(err);
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
  AjouterBienOrLogin(){
    if(this.storageService.isLoggedIn()){
      this.router.navigateByUrl("/userpages/ajouter-propriete")
    }else{
      this.router.navigateByUrl("/auth/connexion")
    }
  }
}
