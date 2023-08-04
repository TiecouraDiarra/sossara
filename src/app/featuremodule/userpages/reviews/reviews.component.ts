import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { AuthService } from 'src/app/service/auth/auth.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import { DataService } from 'src/app/service/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent {
  public routes=routes;
  public reviewdata:any=[]
  constructor(
    private dataservice:DataService,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    ){
    this. reviewdata=this.dataservice.reviewdata
  }

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
}
