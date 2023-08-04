import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { AuthService } from 'src/app/service/auth/auth.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import Swal from 'sweetalert2';

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
  private storageService: StorageService,
  private authService: AuthService,
  private router: Router,
  ){
  this.User = this.storageService.getUser();
    console.log(this.User);
}

ngOnInit(): void {}

   //METHODE PERMETTANT DE SE DECONNECTER
   logout(): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })
    swalWithBootstrapButtons.fire({
      // title: 'Etes-vous sûre de vous déconnecter?',
      text: "Etes-vous sûre de vous déconnecter?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout().subscribe({
          next: res => {
            console.log(res);
            this.storageService.clean();
            this.router.navigateByUrl("/auth/connexion")
          },
          error: err => {
            console.log(err);
          }
        });
      }
    })

  }



iconLogle() {
  this.Toggledata = !this.Toggledata;
 

}
icon(){
  this.Toggle = !this.Toggle;
}
}
