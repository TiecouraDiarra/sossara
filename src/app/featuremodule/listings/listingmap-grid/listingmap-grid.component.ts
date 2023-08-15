import { Component, OnInit } from '@angular/core';
import { routes } from 'src/app/core/helpers/routes/routes';
import { DataService } from 'src/app/service/data.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { MatTableDataSource } from '@angular/material/table';
import { CommoditeService } from 'src/app/service/commodite/commodite.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-listingmap-grid',
  templateUrl: './listingmap-grid.component.html',
  styleUrls: ['./listingmap-grid.component.css']
})
export class ListingmapGridComponent implements OnInit {
  public routes=routes;
  public mapgrid :any =[];
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
  searchText: any;
  selectedRegion: any;
  selectedCommune: any;
  selectedType: any;
  p:number=1;



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
        //FORMATER LE PRIX
        formatPrice(price: number): string {
          return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }


  constructor(
    private Dataservice :DataService,
    private serviceBienImmo : BienimmoService,
    private router: Router,
    private serviceCommodite: CommoditeService
    ){
    this.mapgrid=this.Dataservice.mapgridList;
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
      return this.router.navigate(['pages/service-details', id])
    }
}
