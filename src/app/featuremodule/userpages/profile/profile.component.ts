import { Component, OnInit } from '@angular/core';
import { routes } from 'src/app/core/helpers/routes/routes';
import { StorageService } from 'src/app/service/auth/storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
public routes=routes;
public Toggledata = true;
public Toggle = true;
User: any

constructor(
  private storageService: StorageService
  ){
  this.User = this.storageService.getUser();
    console.log(this.User);
}

ngOnInit(): void {}



iconLogle() {
  this.Toggledata = !this.Toggledata;
 

}
icon(){
  this.Toggle = !this.Toggle;
}
}
