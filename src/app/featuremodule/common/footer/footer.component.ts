import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { routes } from 'src/app/core/helpers/routes/routes';
import { CommoditeService } from 'src/app/service/commodite/commodite.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  public routes = routes;
  commune: any
  constructor(
    public router: Router,
    private serviceCommodite: CommoditeService){

  }
  ngOnInit() {
    AOS.init({disable:'mobile'});
    
    //AFFICHER LA LISTE DES COMMODITES
    this.serviceCommodite.AfficherLaListeCommodite().subscribe(data => {
      this.commune = [data.commune.reverse()[0], data.commune.reverse()[1], data.commune.reverse()[2]];
      console.log(this.commune);
      
    });
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS BIEN EN FONCTION D'UNE COMMUNE
  goToDettailCommune(id: number) {
    console.log(id);
    return this.router.navigate(['bienparcommune', id])
  }
  
}
