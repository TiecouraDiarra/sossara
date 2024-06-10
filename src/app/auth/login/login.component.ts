import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { AuthService } from 'src/app/service/auth/auth.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
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

  constructor(
    public router: Router,
    private authService: AuthService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.path();
    }

  }
  path() {
    this.router.navigate([routes.dashboard]);
  }

  pathProfilCompleter() {
    // this.router.navigate(['/auth/completer-profil']);
    this.router.navigate(['/auth/completer-profil']).then(() => {
      window.location.reload();
    });
  }

  iconLogle() {
    this.Toggledata = !this.Toggledata;
  }

  onSubmit(form: NgForm): void {
    const { email, password } = this.form;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: '',
        cancelButton: '',
      },
      heightAuto: false,
    });

    this.authService.login(email, password).subscribe({
      next: (data) => {
        this.storageService.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.reloadPage();
        // this.path();
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      },
    });
  }

  uppercaseRegex = /[A-Z]/;
  lowercaseRegex = /[a-z]/;
  digitRegex = /\d/;
  specialCharacterRegex = /[@$!%*?&]/;

  validatePassword(password: string): boolean {
    // Vérifier la longueur du mot de passe
    if (password.length < 8) {
      return false;
    }

    // Vérifier s'il y a au moins une majuscule
    if (!/[A-Z]/.test(password)) {
      return false;
    }

    // Vérifier s'il y a au moins une minuscule
    if (!/[a-z]/.test(password)) {
      return false;
    }

    // Vérifier s'il y a au moins un chiffre
    if (!/\d/.test(password)) {
      return false;
    }

    // Vérifier s'il y a au moins un caractère spécial
    if (!/[@$!%*?&]/.test(password)) {
      return false;
    }

    return true;
  }


  seConnecter(): void {
    const { email, password } = this.form;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: '',
        cancelButton: '',
      },
      heightAuto: false,
    });

    if (this.form.email === null && this.form.password === null) {
      // swalWithBootstrapButtons.fire(
      //   this.message = "Tous les champs sont obligatoires !",
      // );
      Swal.fire({
        position: 'center',
        text: "Tous les champs sont obligatoires !",
        title: 'Erreur',
        icon: 'error',
        heightAuto: false,
        showConfirmButton: true,
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'swal2-ok' // Ajoutez une classe personnalisée
        },
        // confirmButtonColor: '#e98b11',
        showDenyButton: false,
        showCancelButton: false,
        allowOutsideClick: false,
      });
      return;
    } else if (this.form.email === null) {
      swalWithBootstrapButtons.fire(
        this.message = "L'email est obligatoire !",
      );
    } else if (this.form.password === null) {
      // swalWithBootstrapButtons.fire(
      //   this.message = "Mot de passe est obligatoire !",
      // );
      Swal.fire({
        position: 'center',
        text: "Mot de passe est obligatoire !",
        title: 'Erreur',
        icon: 'error',
        heightAuto: false,
        showConfirmButton: true,
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'swal2-ok' // Ajoutez une classe personnalisée
        },
        // confirmButtonColor: '#e98b11',
        showDenyButton: false,
        showCancelButton: false,
        allowOutsideClick: false,
      });
      return;
    } else {
      // Appel du service AuthService pour gérer la connexion de l'utilisateur
      this.authService.login(email, password).subscribe(
        (data) => {
          // Enregistrez les données de l'utilisateur dans le service de stockage (session storage ou autre)
          this.storageService.saveUser(data);


          // Réinitialisez les indicateurs d'erreur et définissez isLoggedIn à true
          this.isLoginFailed = false;
          this.isLoggedIn = true;

          // this.path();

          // this.reloadPage();

          // Vérifiez si l'attribut profilcompleter est false
          if (data.profilcompleter === false) {
            // Redirigez l'utilisateur vers la page de complétion de profil
            this.pathProfilCompleter();
            // this.reloadPage();
          } else {
            // Redirigez l'utilisateur vers la page d'accueil
            window.history.back();
            setTimeout(() => {
              window.location.reload();
            }, 100); // 500 ms devrait être suffisant, ajustez si nécessaire


            if (this.storageService.isLoggedIn()) {
              this.isLoggedIn = true;
            } else if (!this.storageService.isLoggedIn()) {
              this.isLoginFailed = false;
            }
            //  this.reloadPage();
          }
        },
        (error) => {
          // Gestion des erreurs en cas d'échec de la connexion
          const errorMessage =
            error.error && error.error.message
              ? error.error.message
              : 'Erreur inconnue';

          // Affichage d'une notification d'erreur à l'aide de la bibliothèque SweetAlert (Swal)
          swalWithBootstrapButtons.fire(
            '',
            `<h1 style='font-size: 1em !important; font-weight; bold; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>${errorMessage}</h1>`,
            'error'
          );

          // Définissez isLoginFailed à true pour indiquer que la connexion a échoué
          this.isLoginFailed = true;
        }
      );
    }

  }
  reloadPage(): void {
    window.location.reload();
  }
}
