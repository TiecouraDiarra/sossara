import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { routes } from 'src/app/core/helpers/routes/routes';
import { AdresseService } from 'src/app/service/adresse/adresse.service';
import { CommoditeService } from 'src/app/service/commodite/commodite.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  public routes = routes;
  commune: any;
  constructor(
    public router: Router,
    private serviceAdresse : AdresseService,
    private serviceCommodite: CommoditeService
  ) {}
  ngOnInit() {
    AOS.init({ disable: 'mobile' });

    //AFFICHER LA LISTE DES COMMUNES
    this.serviceAdresse.AfficherListeCommune().subscribe((data) => {
      this.commune = [
        data.reverse()[3],
        data.reverse()[4],
        data.reverse()[6],
      ];
    });
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS BIEN EN FONCTION D'UNE COMMUNE
  goToDettailCommune(id: number) {
    return this.router.navigate(['bienparcommune', id]);
  }
}
