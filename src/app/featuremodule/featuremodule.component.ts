import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { routes } from '../core/helpers/routes/routes';
import { SidebarService } from '../service/sidebar.service';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-featuremodule',
  templateUrl: './featuremodule.component.html',
  styleUrls: ['./featuremodule.component.css'],
})
export class FeaturemoduleComponent implements OnInit {
  showMiniSidebar: boolean = false;
  public base: string = '';
  public page: string = '';
  public last: string = '';
  public routes = routes;
  public tittle: string = 'Home';

  public strokeValue = 0;
  public progress = 0;
  public firstHeader: boolean = false;
  public hideFooter: boolean = false;
 
  constructor(
    private router: Router,
    private sidebar: SidebarService,
    private common: CommonService
  ) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        // call the function to apply condition in page changes
        this.getRoutes(event);
      }
    });
    this.sidebar.toogleSidebar.subscribe((res: any) => {
      this.showMiniSidebar = res === 'true';
    });
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Vérifiez si l'URL actuelle inclut 'trouverbien'
        this.hideFooter = event.url.includes('/trouverbien');
      }
    });

    this.calculateScrollPercentage();
  }

  // scroll the page to top position
  public scrollToTop(): void {
    window.scrollTo(0, 0);
  }

  // function to calculate the scroll progress
  private calculateScrollPercentage(): void {
    window.addEventListener('scroll', () => {
      var body = document.body,
        html = document.documentElement;
      // gets the total height of page till scroll
      var totalheight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
      // calculates the total stroke value
      this.progress = totalheight;
      var currentDistance = window.scrollY / (totalheight / 3000);
      // calculates the current stroke value
      this.strokeValue = totalheight - currentDistance / 8;
      // condition to hide scroll progress if page in top
      if (window.scrollY == 0) {
        this.strokeValue = totalheight;
      }
      // condition to make scroll progress to 100 if page in bottom
      if (window.innerHeight + window.scrollY >= totalheight) {
        this.strokeValue = 0;
      }

      if (this.tittle.toLowerCase().includes('trouverbien')) {
        this.hideFooter = true;
      } else {
        this.hideFooter = false;
      }
    });
  }

  // function to get the route details and apply condition based on page
  private getRoutes(route: any): void {
    let splitVal = route.url.split('/');
    this.base = splitVal[1];
    this.page = splitVal[2];
    this.last = splitVal[3];
    // case to change the tab name according to route
    switch (splitVal.length) {
      case 2:
        this.tittle = this.base;
        break;
      case 3:
        this.tittle = this.page;
        break;
      case 4:
        this.tittle = this.last;
        break;

      default:
        this.tittle = 'Template';
        break;
    }
    // hide home one in other home pages
    // this.firstHeader = route.url !== routes.home9;

    // hide the footer in list map and grid page
    if (
      route.url === routes.listingmaplist ||
      route.url === routes.listingmapgrid ||
      route.url.includes('/trouverbien')
    ) {
      this.hideFooter = true;
    } else {
      this.hideFooter = false;
    }
  }
}
