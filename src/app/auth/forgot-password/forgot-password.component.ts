import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { UserService } from 'src/app/service/auth/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  public routes = routes;

  formEmail: any = {
    email: null,
  };

  constructor(public router: Router,
    private serviceUser: UserService
    ){

  }
  direction(){
    this.router.navigate([routes.login])
  }

  EnvoieMailForChangePassword(){
    const { email} = this.formEmail;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: '',
        cancelButton: '',
      },
      heightAuto: false
    })

    if (this.formEmail.email === null) {
      swalWithBootstrapButtons.fire(
        "",
        `<h1 style='font-size: 1em; font-weight: bold; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>L'email est obligatoire !</h1>`,
        "warning"
      )
    }else{
      this.serviceUser.forgotPassword(email).subscribe((data)=>{
        if (data.status) {
          let timerInterval = 2000;
          Swal.fire({
            position: 'center',
            text: data.message,
            title: "Message envoyé",
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
            this.formEmail.email === ''
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
          }).then((result) => { });
        }
        // swalWithBootstrapButtons.fire(
        //   "",
        //   `<h1 style='font-size: 1em; font-weight: bold; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>${data.message}</h1>`,
        //   "success"
        // );
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

  }
}
