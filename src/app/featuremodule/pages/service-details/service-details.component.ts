import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lightbox } from 'ngx-lightbox';
import { routes } from 'src/app/core/helpers/routes/routes';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.css']
})
export class ServiceDetailsComponent {
  public routes=routes;
  public albumsOne: any = [];
  public albumsTwo:any =[];
  bien : any
  id:any
  commodite : any
 
  constructor(
    private _lightbox: Lightbox,
    public router:Router,
    private serviceBienImmo : BienimmoService,
    private route:ActivatedRoute,
    ) {
    for (let i = 5; i <= 12; i++) {
      const src = 'assets/img/gallery/gallery1/gallery-' + i + '.jpg';
      const caption = 'Image ' + i + ' caption here';

      this.albumsOne.push({ src: src });
      this.albumsTwo.push({src:src});  
      
      
    }
    
  }
  open(index: number, albumArray: Array<any>): void {
    this._lightbox.open(albumArray, index);
  }
  openAll( albumArray: Array<any>): void {
    this._lightbox.open(albumArray );
  }
  

  close(): void {
    this._lightbox.close();
  }
  ngOnInit(): void {
    //RECUPERER L'ID D'UN BIEN
    this.id=this.route.snapshot.params["id"]
    this.serviceBienImmo.AfficherBienImmoParId(this.id).subscribe(data=>{
      this.bien=data.biens;
      this.commodite = data.commodite
      console.log(this.bien);
    })
  }
  direction(){
    this.router.navigate([routes.servicedetails])
  }
}
