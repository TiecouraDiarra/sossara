import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { StorageService } from 'src/app/service/auth/storage.service';
import { DataService } from 'src/app/service/data.service';
import { SidebarService } from 'src/app/service/sidebar.service';

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

  public tittle: string = 'Home';
  public nav: boolean = false;

  header: Array<any> = [];
  sidebar: Array<any> = [];
  constructor(
    private data: DataService,
    private router: Router,
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
