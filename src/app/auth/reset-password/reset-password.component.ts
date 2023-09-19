import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { routes } from 'src/app/core/helpers/routes/routes';
import { UserService } from 'src/app/service/auth/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  public routes = routes;
  public Toggledata = true;
  public ToggledataC = true;
  token : any
  constructor(public router: Router,
    private route: ActivatedRoute,
    private serviceUser: UserService
    ){

  }
  direction(){
    this.router.navigate([routes.login])
  }

  form: any = {
    password: null,
    confirmPassword: null,
  };



  iconLogle() {
    this.Toggledata = !this.Toggledata;
  }
  iconLogleC() {
    this.ToggledataC = !this.ToggledataC;
  }

  NewPassword(){
    if (this.form.password !== this.form.confirmPassword) {
      Swal.fire({
        text: "La confirmation du mot de passe ne correspond pas au nouveau mot de passe.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return; // Sortir de la fonction si les mots de passe ne correspondent pas
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: '',
        cancelButton: '',
      },
      heightAuto: false
    })
    this.token = this.route.snapshot.params["token"]
    const { password} = this.form;

    alert(this.token)
    
    if (this.form.password === null || this.form.confirmPassword === null) {
      swalWithBootstrapButtons.fire(
        "",
        `<h1 style='font-size: 1em; font-weight: bold; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>Tous les champs sont obligatoires !</h1>`,
        "warning"
      )
    }else{
      this.serviceUser.ChangerPassword(this.token,password).subscribe((data)=>{
        swalWithBootstrapButtons.fire(
          "",
          `<h1 style='font-size: 1em; font-weight: bold; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>${data.message}</h1>`,
          "error"
        );
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
