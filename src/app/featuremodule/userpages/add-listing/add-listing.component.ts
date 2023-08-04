import { Component, OnInit } from '@angular/core';
import { routes } from 'src/app/core/helpers/routes/routes';
import { StorageService } from 'src/app/service/auth/storage.service';
import { AuthService } from 'src/app/service/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
interface Food {
  value: string |any;
  viewValue: string ;
}
interface price {
  value: string |any;
  viewValue: string ;
}

@Component({
  selector: 'app-add-listing',
  templateUrl: './add-listing.component.html',
  styleUrls: ['./add-listing.component.css']
})
export class AddListingComponent implements OnInit {

  User : any
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router, 
    private storageService: StorageService
    ) {
    this.User = this.storageService.getUser();
    console.log(this.User);
  }
  ngOnInit(): void {
    // if (!this.storageService.isLoggedIn()) {
    //   this.router.navigateByUrl("/auth/connexion")
    // }
  }
  public routes=routes;
  selectedValue: string | any;
 

  foods: Food[] = [
    {value: 'steak-0', viewValue: '65'},
    {value: 'pizza-1', viewValue: '75'},
    {value: 'tacos-2', viewValue: '85'},
    {value: 'steak-0', viewValue: '95'},
    {value: 'pizza-1', viewValue: '105'},
    {value: 'tacos-2', viewValue: '110'},
    {value: 'tacos-2', viewValue: '115'},
  ];

  prices:price[]=[
    
      {value: 'steak-0', viewValue: '120'},
      {value: 'pizza-1', viewValue: '130'},
      {value: 'tacos-2', viewValue: '140'},
      {value: 'steak-0', viewValue: '150'},
      {value: 'pizza-1', viewValue: '160'},
      {value: 'tacos-2', viewValue: '170'},
      {value: 'tacos-2', viewValue: '180'},
      {value: 'tacos-2', viewValue: '190'},
    
  ];
  
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
