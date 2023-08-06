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
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';

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
  agence: any
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
  nombreAgence: number = 0
  nombreZone: number = 0
  nombreBienLoue: number = 0
  nombreBienVendre: number = 0

  constructor(
    private DataService: DataService,
    private router: Router,
    private storageService: StorageService,
    private serviceCommodite: CommoditeService,
    private serviceBienImmo: BienimmoService,
    private serviceUser : UserService
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
      this.nombreZone = data.region.length;
      this.commune = data.commune;
      this.typebien = data.type;
      console.log(this.adresse);
    });

    //AFFICHER LA LISTE DES BIENS IMMO
    this.serviceBienImmo.AfficherLaListeBienImmo().subscribe(data => {
      // for (let index = 0; index < 7; index++) {
      //   this.bienImmo.push(data.biens.reverse()[index])
      // }
       this.bienImmo = [data.biens.reverse()[0], data.biens.reverse()[1],data.biens.reverse()[2],data.biens.reverse()[3],data.biens.reverse()[4],data.biens.reverse()[5]];
      console.log(this.bienImmo);
    }
    );
     //AFFICHER LA LISTE DES AGENCES
     this.serviceUser.AfficherLaListeAgence().subscribe(data => {
       this.agence = data.agences.reverse();
       this.nombreAgence = data.length;
      console.log(this.nombreAgence);
      console.log(this.agence);
    }
    );

    //AFFICHER LA LISTE DES BIENS IMMO RECENTS A LOUER
    this.serviceBienImmo.AfficherLaListeBienImmoRecentAlouer().subscribe(data => {
      // for (let index = 0; index < 4; index++) {
      //   this.BienLoueRecens.push(data.biens.reverse()[index])
      // }
      //this.BienLoueRecens.push(data.biens.reverse()[index])
      this.nombreBienLoue = data.biens.length;
      this.BienLoueRecens = [data.biens.reverse()[0], data.biens.reverse()[1],data.biens.reverse()[2],data.biens.reverse()[3]]
      console.log(this.BienLoueRecens);
    }
    );
     //AFFICHER LA LISTE DES BIENS IMMO RECENTS A LOUER
     this.serviceBienImmo.AfficherLaListeBienImmoAvendre().subscribe(data => {
      this.nombreBienVendre = data.biens.length;
    }
    )
  }

   //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS BIEN
   goToDettailBien(id: number) {
    console.log(id);
    return this.router.navigate(['pages/service-details', id])
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS BIEN EN FONCTION D'UNE COMMUNE
  goToDettailCommune(id: number) {
    console.log(id);
    return this.router.navigate(['bienparcommune', id])
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
