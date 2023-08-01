import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-listing-grid',
  templateUrl: './listing-grid.component.html',
  styleUrls: ['./listing-grid.component.css']
})
export class ListingGridComponent {
  public routes=routes;
  public Bookmark :any =[];
  bienImmo : any
  commune : any
  id:any

  constructor(
    private Dataservice:DataService,
    private router : Router,
    private serviceBienImmo : BienimmoService,
    private route:ActivatedRoute,
    ){
    this.Bookmark=this.Dataservice.bookmarkList

  }
  ngOnInit(): void {
    //RECUPERER L'ID D'UNE COMMUNE
    this.id=this.route.snapshot.params["id"]
    this.serviceBienImmo.AfficherBienImmoParCommune(this.id).subscribe(data=>{
      this.bienImmo=data.biens;
      console.log(this.bienImmo);
      this.commune = this.bienImmo[0].adresse.commune.nom;
      console.log(this.bienImmo);
    })
 }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS BIEN
  goToDettailBien(id: number) {
    console.log(id);
    return this.router.navigate(['pages/service-details', id])
  }
}
