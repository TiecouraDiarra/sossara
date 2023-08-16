import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { AuthService } from 'src/app/service/auth/auth.service';
import Swal from 'sweetalert2';


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
  public PiecesCIN: any = [];
  public isdisabled = false;
  public NINABio = false;
  selectedTypePiece: string | null = null; // Variable pour stocker le type de pièce sélectionné
  public currentUser = 'Utilisateur';
  public currentType = 'Type';
  public TYpePie = 'TypePiece';
  public typeUser = [
    "Type d'Utilisateur",
    'LOCATAIRE OU ACHETEUR',
    'PROPRIETAIRE',
    'AGENCE',
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
    confirmPassword: null,
    dateNaissance: null,
    nom_doc : "Type de pieces",
    num_doc : null,
    roles : "Type d'Utilisateur",
    photo:null,
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  message: string | undefined;
  selectedFiles : any;
  image: File[] = [];
  images: File[] = [];


  //CHARGER L'IMAGE
  onFileSelected(event: any): void {
    this.selectedFiles = event.target.files;
    const reader = new FileReader();
    for (const file of this.selectedFiles) {
      reader.onload = (e: any) => {
        this.image.push(e.target.result);
        console.log(this.image);
      };
      this.images.push(file);
      reader.readAsDataURL(file);
      this.form.photo = this.images;
    }
  }

  public typepiciesUser = [
    'Type de pieces',
    "CarteIN",
    'NINA',
    'Passport',
  ];

  //METHODE PERMETTANT DE CHANGER LES TYPES DE DOC
  onTypePiecesChange(event: any) {
    this.selectedTypePiece = event.target.value;
  }

  //METHODE PERMETTANT DE VERIFIER SI LES DEUX MOTS DE PASSE SONT LES MEMES
  passwordsMatch(): boolean {
    return this.form.password === this.form.confirmPassword;
  }

  public typepiciesAgence = ['Type de pieces', 'RCCM', 'NIF'];

  constructor(public router: Router, 
    private authService: AuthService) {}
  path() {
    this.router.navigate([routes.login]);
  }

  onSubmit(): void {
    if (this.form.photo === null) {
      console.error('La photo est manquante.');
      return;
    }
    const { nom, email, password, telephone, dateNaissance,  nom_doc,num_doc, roles,photo} = this.form;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })
    if (this.form.nom == ""
      || this.form.email == ""
      || this.form.password == ""
      || this.form.telephone == ""
      || this.form.dateNaissance == ""
      || this.form.nom_doc == ""
      || this.form.num_doc == ""
      || this.form.confirmPassword == ""
      || this.form.roles == ""
      || this.form.photo === null) {
      swalWithBootstrapButtons.fire(
        this.message = " Tous les champs sont obligatoires !",
      )
    } else {
      swalWithBootstrapButtons.fire({
        text: "Etes-vous sûre de creer un compte ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Annuler',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.authService.register(nom, email, password, telephone, dateNaissance, nom_doc,num_doc,roles,photo).subscribe({
            next: (data) => {
              console.log(data);
              this.isSuccessful = true;
              this.isSignUpFailed = false;
              this.popUpConfirmation();
            },
            error: (err) => {
              console.log(err);
              this.errorMessage = err.error.message;
              this.isSignUpFailed = true;
            },
          });
        }
      })
  
      console.log('nom: ', nom);
      console.log('email: ', email);
      console.log('password: ', password);
      console.log('telephone: ', telephone);
      console.log('dateNaissance: ', dateNaissance);
      console.log('nom_doc: ', nom_doc);
      console.log('num_doc: ', num_doc);
      console.log('roles: ', roles);
    }
  }
  onChange(typeUser: any) {
    if (typeUser.value === "LOCATAIRE OU ACHETEUR" || typeUser.value === 'PROPRIETAIRE') {
      this.typePieces = this.typepiciesUser;
      this.currentUser = typeUser.value;
      // this.currentType = typeUser.value
    } else if (typeUser.value === 'AGENCE') {
      this.typePieces = this.typepiciesAgence;
      this.currentUser = typeUser.value;
      // this.NINABio = true
    } else {
      this.typePieces = [];
      this.currentUser = 'Utilisateur';
      // this.currentType = 'Type';
    }
  }
  

  onChangeTypeUser(typePiece: any) {
    if (typePiece.value === "Carte d'identite") {
      this.typePieces = this.typepiciesUser;
      this.currentType = typePiece.value;
    }else if (typePiece.value === 'NINA ou Biometrique') {
      this.typePieces = this.typepiciesUser;
      this.currentUser = typePiece.value;
    } else {
      // this.typePieces = [];
      this.currentType = 'Type';
    }
  }
  iconLogle() {
    this.Toggledata = !this.Toggledata;
  }

 //POPUP APRES CONFIRMATION
 popUpConfirmation() {
  let timerInterval = 2000;
  Swal.fire({
    position: 'center',
    text: 'La compte a été envoyé avec succès.',
    title: 'Creation de compte',
    icon: 'success',
    heightAuto: false,
    showConfirmButton: false,
    // confirmButtonText: "OK",
    confirmButtonColor: '#0857b5',
    showDenyButton: false,
    showCancelButton: false,
    allowOutsideClick: false,
    timer: timerInterval, // ajouter le temps d'attente
    timerProgressBar: true // ajouter la barre de progression du temps

  }).then((result) => {
    this.path();
     // Après avoir réussi à candidater, mettez à jour l'état de la candidature
     
  })
}

  iconLogleC() {
    this.ToggledataC = !this.ToggledataC;
  }

  
}
