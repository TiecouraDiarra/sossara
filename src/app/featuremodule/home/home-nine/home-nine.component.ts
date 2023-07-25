import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { routes } from 'src/app/core/helpers/routes/routes';
import { DataService } from 'src/app/service/data.service';
import * as AOS from 'aos';
import { CommoditeService } from 'src/app/service/commodite/commodite.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { BienImmo } from 'src/app/modele/bien-immo';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-home-nine',
  templateUrl: './home-nine.component.html',
  styleUrls: ['./home-nine.component.scss']
})
export class HomeNineComponent {
  public routes = routes;
  public listing: any = [];
  public Bookmark: any = [];
  public managementcomponies: any = [];
  public hoildayCabin: any = [];
  public bestrooms: any = [];
  public recentproperties: any = [];
  public ourtestimonials: any = [];
  public recentarticle: any = [];


  commodite: any
  adresse: any
  region: any
  commune: any
  typebien: any
  bienImmo: any;
  BienLoueRecens: any
  searchInputCategory: any;
  public categories: any = [];
  categoriesDataSource = new MatTableDataSource();
  selectedCategory: any = '';

  constructor(
    private DataService: DataService,
    public router: Router,
    private serviceCommodite: CommoditeService,
    private serviceBienImmo: BienimmoService
  ) {

    (this.listing = this.DataService.listing),
      (this.managementcomponies = this.DataService.managementcomponies),
      (this.hoildayCabin = this.DataService.hoildayCabin),
      (this.bestrooms = this.DataService.bestrooms),
      (this.recentproperties = this.DataService.recentproperties),
      (this.ourtestimonials = this.DataService.ourtestimonials),
      (this.Bookmark = this.DataService.bookmarkList),
      (this.recentarticle = this.DataService.recentarticle)


  }
  searchCategory(value: any): void {
    const filterValue = value;
    this.categoriesDataSource.filter = filterValue.trim().toLowerCase();
    this.categories = this.categoriesDataSource.filteredData;
  }
  public listingOwlOptions: OwlOptions = {
    margin: 24,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: [
      "<i class='fa-solid fa-angle-left'></i>",
      "<i class='fa-solid fa-angle-right'></i>",
    ],
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 3
      },
      1170: {
        items: 5,
        loop: true
      }
    },
    nav: false,
  };
  public managementcomponiesOwlOptions: OwlOptions = {
    margin: 24,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: [
      "<i class='fa-solid fa-angle-left'></i>",
      "<i class='fa-solid fa-angle-right'></i>",
    ],
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 4
      },
      1170: {
        items: 5,
        loop: true
      }
    },
    nav: false,
  };
  public hoildayCabinOwlOptions: OwlOptions = {
    margin: 24,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: [
      "<i class='fa-solid fa-angle-left'></i>",
      "<i class='fa-solid fa-angle-right'></i>",
    ],
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 1
      },
      1170: {
        items: 1,
        loop: false
      }
    },
    nav: true,
  };
  public bestroomsOwlOptions: OwlOptions = {
    margin: 24,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: [
      "<i class='fa-solid fa-angle-left'></i>",
      "<i class='fa-solid fa-angle-right'></i>",
    ],
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 4
      },
      1170: {
        items: 1,
        loop: true
      }
    },
    nav: false,
  };
  public recentpropertiesOwlOptions: OwlOptions = {
    margin: 24,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: [
      "<i class='fa-solid fa-angle-left'></i>",
      "<i class='fa-solid fa-angle-right'></i>",
    ],
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 2
      },
      1170: {
        items: 1,
        loop: true
      }
    },
    nav: false,
  };
  public ourtestimonialsOwlOptions: OwlOptions = {
    margin: 24,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: [
      "<i class='fa-solid fa-angle-left'></i>",
      "<i class='fa-solid fa-angle-right'></i>",
    ],
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 3
      },
      1170: {
        items: 1,
        loop: true
      }
    },
    nav: false,
  };
  public recentarticleOwlOptions: OwlOptions = {
    margin: 24,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: [
      "<i class='fa-solid fa-angle-left'></i>",
      "<i class='fa-solid fa-angle-right'></i>",
    ],
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 3
      },
      1170: {
        items: 1,
        loop: true
      }
    },
    nav: false,
  };

  ngOnInit(): void {
    AOS.init({ disable: 'mobile' }
    );
    //AFFICHER LA LISTE DES COMMODITES
    this.serviceCommodite.AfficherLaListeCommodite().subscribe(data => {
      this.commodite = data.commodite;
      this.adresse = data;
      this.region = data.region;
      this.commune = data.commune;
      this.typebien = data.type;
      console.log(this.adresse);
    });

    //AFFICHER LA LISTE DES BIENS IMMO
    this.serviceBienImmo.AfficherLaListeBienImmo().subscribe(data => {
      this.bienImmo = data.biens;
      console.log(this.bienImmo);
    }
    )

    //AFFICHER LA LISTE DES BIENS IMMO RECENTS A LOUER
    this.serviceBienImmo.AfficherLaListeBienImmo().subscribe(data => {
      this.BienLoueRecens = data.biens;
      console.log(this.BienLoueRecens);
    }
    )
  }
}
