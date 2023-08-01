import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { AuthService } from 'src/app/service/auth/auth.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  public routes = routes;
  public Toggledata = true;
  public ToggledataC = true;
  public typePieces: any = [];
  public isdisabled = false;
  public currentUser = 'Utilisateur';
  public typeUser = [
    "Type d'Utilisateur",
    'Visiteur',
    'Proprietaire',
    'Agence',
  ];

  userName: any = {
    lastName: null,
    firstName: null,
  };

  form: any = {
    nom: null,
    email: null,
    password: null,
    telephone: null,
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  public typepiciesUser = [
    'Type de pieces',
    "Carte d'identite",
    'NINA ou Biometrique',
    'Passport',
  ];

  public typepiciesAgence = ['Type de pieces', 'RCCM', 'NIF'];

  constructor(public router: Router, 
    private authService: AuthService) {}
  path() {
    this.router.navigate([routes.login]);
  }

  onSubmit(): void {
    const { nom, email, password, telephone } = this.form;

    this.authService.register(nom, email, password, telephone).subscribe({
      next: (data) => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      },
    });
    console.log('nom: ', nom);
    console.log('email: ', email);
    console.log('password: ', password);
    console.log('telephone: ', telephone);
  }
  onChange(typeUser: any) {
    if (typeUser.value === 'Visiteur' || typeUser.value === 'Proprietaire') {
      this.typePieces = this.typepiciesUser;
      this.currentUser = typeUser.value;
    } else if (typeUser.value === 'Agence') {
      this.typePieces = this.typepiciesAgence;
      this.currentUser = typeUser.value;
    } else {
      this.typePieces = [];
      this.currentUser = 'Utilisateur';
    }
  }
  iconLogle() {
    this.Toggledata = !this.Toggledata;
  }

  iconLogleC() {
    this.ToggledataC = !this.ToggledataC;
  }
}
