import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { DataService } from 'src/app/service/data.service';

const URL_PHOTO: string = environment.Url_PHOTO;


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
  p:number=1;
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
      this.bienImmo=data.biens.reverse();
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

    // IMAGE PAR DEFAUT DES BIENS
    DEFAULT_IMAGE_URL = 'assets/img/gallery/gallery1/gallery-1.jpg';

    // IMAGE PAR DEFAUT USER
    handleAuthorImageError(event: any) {
      event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
    }
  
    //IMAGE
    generateImageUrl(photoFileName: string): string {
      const baseUrl = URL_PHOTO + '/uploads/images/';
      return baseUrl + photoFileName;
    }
}
