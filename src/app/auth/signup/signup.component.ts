import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  public routes = routes;
  public Toggledata = false;
  public ToggledataC = false;

  constructor(public router:Router){
    
  }
  path(){
    this.router.navigate([routes.login])
  }

  iconLogle() {
    this.Toggledata = !this.Toggledata;

  }

  iconLogleC() {
    this.ToggledataC = !this.ToggledataC;
    
  }

}
