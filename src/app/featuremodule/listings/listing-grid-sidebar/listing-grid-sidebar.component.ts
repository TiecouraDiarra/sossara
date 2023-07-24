import { Component } from '@angular/core';

import { Options } from '@angular-slider/ngx-slider';
import { routes } from 'src/app/core/helpers/routes/routes';
import { DataService } from 'src/app/service/data.service';
import { MatTableDataSource } from '@angular/material/table';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { CommoditeService } from 'src/app/service/commodite/commodite.service';

@Component({
  selector: 'app-listing-grid-sidebar',
  templateUrl: './listing-grid-sidebar.component.html',
  styleUrls: ['./listing-grid-sidebar.component.css'],
})
export class ListingGridSidebarComponent  {
  public routes = routes;
  public listsidebar: any = [];
  public categories: any = [];
  categoriesDataSource = new MatTableDataSource();
  searchInputCategory: any;
  selectedCategory: any = '';
  bienImmo : any;

  commodite : any
  adresse : any
  region : any
  commune : any
  typebien : any

  slidevalue: number = 55;
  options: Options = {
    floor: 0,
    ceil: 100,
  };

  constructor
  (private Dataservice: DataService,
    private serviceBienImmo : BienimmoService,
    private serviceCommodite: CommoditeService,
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
      this.bienImmo = data.biens;
      console.log(this.bienImmo);
    }
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
  }
}
