import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { AuthService } from 'src/app/service/auth/auth.service';
import { StorageService } from 'src/app/service/auth/storage.service';
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
  maxImageCount: number = 0; // Limite maximale d'images
  isButtonDisabled: boolean = false; // Variable pour désactiver le bouton si la limite est atteinte



  //CHARGER L'IMAGE
  onFileSelected(event: any): void {
    this.selectedFiles = event.target.files;
    const reader = new FileReader();
    for (const file of this.selectedFiles) {
      if (this.images.length < 2) {
        reader.onload = (e: any) => {
          this.images.push(file);
          this.image.push(e.target.result);
          console.log(this.image);
          

        };
        this.maxImageCount =file.length
        reader.readAsDataURL(file);
      }
    }
    this.checkImageCount(); // Assurez-vous de vérifier à nouveau la limite après le traitement
    this.form.photo = this.images;

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
    private authService: AuthService,private storageService: StorageService) {}
  path() {
    this.router.navigate([routes.login]);
  }

  pathSignup() {
    this.router.navigate([routes.signup]);
  }

  onSubmit(): void {
    if (this.form.password !== this.form.confirmPassword) {
      Swal.fire({
        text: "La confirmation du mot de passe ne correspond pas au nouveau mot de passe.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return; // Sortir de la fonction si les mots de passe ne correspondent pas
    }
    const { nom, email, password, telephone, dateNaissance,  nom_doc,num_doc, roles,photo} = this.form;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })
    if (this.form.nom === null
      || this.form.email === null
      || this.form.password === null
      || this.form.telephone === null
      || this.form.dateNaissance === null
      || this.form.nom_doc == "Type de pieces"
      || this.form.num_doc === null
      || this.form.confirmPassword === null
      || this.form.roles == "Type d'Utilisateur"
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
              // this.storageService.saveUser(data);
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
  
      // console.log('nom: ', nom);
      // console.log('email: ', email);
      // console.log('password: ', password);
      // console.log('telephone: ', telephone);
      // console.log('dateNaissance: ', dateNaissance);
      // console.log('nom_doc: ', nom_doc);
      // console.log('num_doc: ', num_doc);
      // console.log('roles: ', roles);
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
  // let timerInterval = 2000;
  // Messages à afficher dans la boîte de dialogue
  const messages = [
    'Le compte a été envoyé avec succès.',
    'Pour vous connecter, allez-y confirmer dans votre mail'
  ];
  // Créez un seul texte en concaténant les messages avec des sauts de ligne
  const messageText = messages.join('\n');
  
  Swal.fire({
    position: 'center',
    text: messageText,
    title: 'Creation de compte',
    icon: 'success',
    heightAuto: false,
    showConfirmButton: true,
    confirmButtonText: "OK",
    confirmButtonColor: '#0857b5',
    showDenyButton: false,
    showCancelButton: false,
    allowOutsideClick: false,
    // timer: timerInterval, // ajouter le temps d'attente
    // timerProgressBar: true // ajouter la barre de progression du temps

  }).then((result) => {
    this.form.nom = '',
    this.form.email ='',
    this.form.password ='',
    this.form.telephone ='',
    this.form.dateNaissance ='',
    this.form.nom_doc = "Type de pieces",
    this.form.num_doc ='',
    this.form.confirmPassword ='',
    this.form.roles = "Type d'Utilisateur",
    this.form.photo = null
  })
}

  iconLogleC() {
    this.ToggledataC = !this.ToggledataC;
  }

  removeImage(index: number) {
    this.image.splice(index, 1); // Supprime l'image du tableau
    this.images.splice(index, 1); // Supprime le fichier du tableau 'images'
    this.checkImageCount(); // Appelle la fonction pour vérifier la limite d'images après la suppression
  }
  
    // Fonction pour vérifier la limite d'images et désactiver le bouton si nécessaire
checkImageCount(): void {
  if (this.images.length >= 3) {
    this.isButtonDisabled = true;
  } else {
    this.isButtonDisabled = false;
  }
}

}
