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
      // this.roles = this.storageService.getUser().roles;
    }

  }
  path() {
    this.router.navigate([routes.dashboard]);
  }

  pathProfilCompleter() {
    this.router.navigate(['/auth/completer-profil']);
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
        this.roles = this.storageService.getUser().roles;
        this.reloadPage();
        // this.path();
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      },
    });
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

    // Appel du service AuthService pour gérer la connexion de l'utilisateur
    this.authService.login(email, password).subscribe(
      (data) => {
        // Enregistrez les données de l'utilisateur dans le service de stockage (session storage ou autre)
        this.storageService.saveUser(data);


        // Réinitialisez les indicateurs d'erreur et définissez isLoggedIn à true
        this.isLoginFailed = false;
        this.isLoggedIn = true;

        // Obtenez les rôles de l'utilisateur à partir des données
        this.roles = this.storageService.getUser().roles;
        // this.path();

        // this.reloadPage();

        // Vérifiez si l'attribut profilcompleter est false
        if (data.profilcompleter === false) {
          // Redirigez l'utilisateur vers la page de complétion de profil
          this.pathProfilCompleter();
          // this.reloadPage();
        } else {
          // Redirigez l'utilisateur vers la page d'accueil
          this.router.navigate(['/userpages/dashboard']).then(() => {
            window.location.reload();
          });

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
  reloadPage(): void {
    window.location.reload();
  }
}
