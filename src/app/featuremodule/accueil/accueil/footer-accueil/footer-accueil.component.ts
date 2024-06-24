import { Component } from '@angular/core';
import { routes } from 'src/app/core/helpers/routes/routes';

@Component({
  selector: 'app-footer-accueil',
  templateUrl: './footer-accueil.component.html',
  styleUrls: ['./footer-accueil.component.scss']
})
export class FooterAccueilComponent {
  public routes = routes

}
