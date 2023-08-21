import { Component, OnInit } from '@angular/core';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { DataService } from 'src/app/service/data.service';

const URL_PHOTO: string = environment.Url_PHOTO;


declare var google: any;
@Component({
  selector: 'app-listingmap-list',
  templateUrl: './listingmap-list.component.html',
  styleUrls: ['./listingmap-list.component.css'],
})
export class ListingmapListComponent implements OnInit {
  public routes = routes;
  public mapList: any = [];
  bienImmo : any;

  constructor(
    private Dataservice: DataService,
    private serviceBienImmo : BienimmoService
    ) {
    this.mapList = this.Dataservice.mapList;
  }
  ngOnInit(): void {
     //AFFICHER LA LISTE DES BIENS IMMO
     this.serviceBienImmo.AfficherLaListeBienImmo().subscribe(data => {
      this.bienImmo = data.biens;
      console.log(this.bienImmo);
    }
    );
  }
}
