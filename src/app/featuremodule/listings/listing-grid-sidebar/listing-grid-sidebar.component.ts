import { Component } from '@angular/core';

import { Options } from '@angular-slider/ngx-slider';
import { routes } from 'src/app/core/helpers/routes/routes';
import { DataService } from 'src/app/service/data.service';
import { MatTableDataSource } from '@angular/material/table';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { CommoditeService } from 'src/app/service/commodite/commodite.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listing-grid-sidebar',
  templateUrl: './listing-grid-sidebar.component.html',
  styleUrls: ['./listing-grid-sidebar.component.css'],
})
export class ListingGridSidebarComponent {
  public routes = routes;
  public listsidebar: any = [];
  public categories: any = [];
  categoriesDataSource = new MatTableDataSource();
  searchInputCategory: any;
  selectedCategory: any = '';
  bienImmo: any;
  searchText: any;
  selectedRegion: any;
  selectedCommune: any;
  p: number = 1;
  selectedType: any;
  selectedStatut: any;
  commoditeSelectionnees: string[] = [];
  valuesSelect: any = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];


  regions: any = [];
  communes: any = [];

  commodite: any
  adresse: any
  region: any
  commune: any
  typebien: any

  // IMAGE PAR DEFAUT DES BIENS
  DEFAULT_IMAGE_URL = 'assets/img/gallery/gallery1/gallery-1.jpg';

  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }

  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = 'http://192.168.1.6:8000/uploads/images/';
    return baseUrl + photoFileName;
  }

  //AFFICHER REGION EN FONCTION DU PAYS
  onChange(newValue: any) {
    this.regions = this.region.filter(
      (el: any) => el.pays.nom == newValue.value
    );
  }

  //AFFICHER COMMUNE EN FONCTION DE REGION
  onChangeRegion(newValue: any) {
    this.communes = this.commune.filter(
      (el: any) => el.region.nom == newValue.value
    );
  }
  //FORMATER LE PRIX
  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  //RECHERCHER PAR REGION
  onRegionSelectionChange(event: any) {
    this.selectedRegion = event.value;
  }


  //RECHERCHER PAR COMMUNE
  onCommuneSelectionChange(event: any) {
    this.selectedCommune = event.value;
  }

  //RECHERCHER PAR TYPE
  onTypeSelectionChange(event: any) {
    this.selectedType = event.value;
  }

  //RECHERCHER PAR COMMODITE
  onCommoditeSelectionChange(event: any) {
    this.selectedStatut = event.value;
  }




  slidevalue: number = 55;
  options: Options = {
    floor: 0,
    ceil: 100,
  };

  constructor
    (private Dataservice: DataService,
      private serviceBienImmo: BienimmoService,
      private serviceCommodite: CommoditeService,
      private routerr: Router
    ) {
    this.listsidebar = this.Dataservice.listsidebarList,
      this.categories = this.Dataservice.categoriesList;
    (this.categoriesDataSource = new MatTableDataSource(this.categories));
  }
  searchCategory(value: any): void {
    const filterValue = value;
    this.categoriesDataSource.filter = filterValue.trim().toLowerCase();
    this.categories = this.categoriesDataSource.filteredData;
  }
  ngOnInit(): void {
    //AFFICHER LA LISTE DES BIENS IMMO
    this.serviceBienImmo.AfficherLaListeBienImmo().subscribe(data => {
      this.bienImmo = data.biens.reverse();
      console.log(this.bienImmo);
    }
    );
    //AFFICHER LA LISTE DES COMMODITES
    this.serviceCommodite.AfficherLaListeCommodite().subscribe(data => {
      this.commodite = data.commodite;
      this.adresse = data;
      this.region = data.region.reverse();
      this.commune = data.commune;
      this.typebien = data.type;
      console.log(this.adresse);
    });
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS BIEN
  goToDettailBien(id: number) {
    console.log(id);
    return this.routerr.navigate(['pages/service-details', id])
  }
}
