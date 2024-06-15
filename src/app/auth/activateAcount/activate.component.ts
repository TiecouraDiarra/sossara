import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { AuthService } from 'src/app/service/auth/auth.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.css'],
})
export class ActivateComponent implements OnInit {
  public routes = routes;
  public Toggledata = true;
  type = true;
  User: any;
  roles: string[] = [];
  message: string | undefined;

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  form: any = {
    email: null,
    password: null,
  };
  users: any;
  completer: any;
  profil: any;
  token: any;

  constructor(
    public router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: '',
        cancelButton: '',
      },
      heightAuto: false
    })
    this.token = this.route.snapshot.params["token"]
   this.authService.activerMoncompte(this.token).subscribe((data) => {
    if (data.status) {
      let timerInterval = 4000;
      Swal.fire({
        position: 'center',
        text: data.message,
        title: "Activation du compte",
        icon: 'success',
        heightAuto: false,
        showConfirmButton: false,
        confirmButtonColor: '#e98b11',
        showDenyButton: false,
        showCancelButton: false,
        allowOutsideClick: false,
        timer: timerInterval,
        timerProgressBar: true,
      }).then(() => {
        this.path();
      });
    } else {
      Swal.fire({
        position: 'center',
        text: data.message,
        title: 'Erreur',
        icon: 'error',
        heightAuto: false,
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#e98b11',
        showDenyButton: false,
        showCancelButton: false,
        allowOutsideClick: false,
      }).then((result) => {    this.path();});
    }
    
  },(error)=>{
    const errorMessage = error.errorw && error.error.message ? error.error.message : 'Erreur inconnue';
    swalWithBootstrapButtons.fire(
      "",
      `<h1 style='font-size: 1em; font-weight: bold; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>${errorMessage}</h1>`,
      "error"
    );
  }
  )


  }
  path() {
    this.router.navigate([routes.dashboard]);
  }

}
