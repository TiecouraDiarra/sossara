import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { StorageService } from 'src/app/service/auth/storage.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-my-listing',
  templateUrl: './my-listing.component.html',
  styleUrls: ['./my-listing.component.css']
})
export class MyListingComponent implements OnInit {
  public routes=routes;
  User : any;
  searchText: any;
  bienImmo : any;
  public electronics:any=[]

  constructor(
    private DataService:DataService,
    private storageService: StorageService,
    public router: Router,
    private serviceBienImmo: BienimmoService,
    ){
    this.electronics=this.DataService.electronicsList,
    this.User = this.storageService.getUser();
    console.log(this.User);
  }
  ngOnInit(): void {
    this.User = this.storageService.getUser().user.id;
    console.log(this.User);

    //AFFICHER LA LISTE DES BIENS PAR UTILISATEUR
    this.serviceBienImmo.AfficherBienImmoParUser(this.User).subscribe(data => {
      this.bienImmo = data.biens;
      console.log(this.bienImmo);
    });

  }
    
  sortData(sort: Sort) {
    const data = this.electronics.slice();

    if (!sort.active || sort.direction === '') {
      this.electronics = data;
    } else {
      this.electronics = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

   //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS BIEN
   goToDettailBien(id: number) {
    console.log(id);
    return this.router.navigate(['pages/service-details', id])
  }

}
