import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { routes } from 'src/app/core/helpers/routes/routes';
import { SidebarService } from 'src/app/service/sidebar.service';
import { CommonService } from 'src/app/service/common.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/service/auth/auth.service';

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

  isLoggedIn = false;
  isLoginFailed = true;
  errorMessage = '';

  public nav: boolean = false;
  header: Array<any> = [];
  sidebar: Array<any> = [];


  constructor(
    private data: DataService,
    private router: Router,
    private common: CommonService,
    private sidebarService: SidebarService,
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
    console.log(this.User);
  }
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      // this.roles = this.storageService.getUser().roles;
    } else if (!this.storageService.isLoggedIn()) {
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

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE AJOUTER BIEN SI TU ES CONNECTE DANS LE CAS CONTRAIRE LOGIN
  AjouterBienOrLogin() {
    if (this.storageService.isLoggedIn()) {
      this.router.navigateByUrl("/userpages/ajouter-propriete")
    } else {
      this.router.navigateByUrl("/auth/connexion")
    }
  }

}
