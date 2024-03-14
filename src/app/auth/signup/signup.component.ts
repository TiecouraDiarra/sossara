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
  // public typeUser = [
  //   "Type d'Utilisateur",
  //   'LOCATAIRE OU ACHETEUR',
  //   'PROPRIETAIRE',
  //   'AGENCE',
  // ];

  public typeUser: any[] = [
    // { nom: "Type d'Utilisateur", },
    { nom: 'LOCATAIRE OU ACHETEUR', value: 'locataire' },
    { nom: 'PROPRIETAIRE', value: 'proprietaire' },
    { nom: 'AGENCE', value: 'agence' },
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
    nomDoc : "Type de pieces",
    numDoc : null,
    role : "Choisissez un type d'utilisateur",
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
  onFileSelected1(event: any): void {
    this.selectedFiles = event.target.files;
    const reader = new FileReader();
    for (const file of this.selectedFiles) {
      if (this.images.length < 2) {
        reader.onload = (e: any) => {
          this.images.push(file);
          this.image.push(e.target.result);       
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

  nomPhoto: File | null = null;


 // Fonction pour gérer la sélection de fichiers dans votre composant
onFileSelected(event: any): void {
  // Mettre à jour la propriété "photo" de votre objet formulaire avec le premier fichier sélectionné
  this.form.photo = event.target.files[0] as File;
  // Appeler la fonction pour traiter la sélection de fichiers
  this.handleFileSelection(event);
}

// Fonction pour traiter la sélection de fichiers
handleFileSelection(event: any): void {
  // Récupérer les fichiers sélectionnés
  this.selectedFiles = event.target.files;
  const reader = new FileReader();
  // Parcourir chaque fichier sélectionné
  for (const file of this.selectedFiles) {
      // Vérifier si le nombre d'images chargées est inférieur à 2
      if (this.images.length < 1) {
          // Définir la fonction de rappel onload pour lire le contenu du fichier
          reader.onload = (e: any) => {
              // Ajouter le fichier à la liste des images
              this.images.push(file);
              // Ajouter les données de l'image à la liste d'URL d'image
              this.image.push(e.target.result);
              // Afficher les URLs des images dans la console
          };
          // Démarrer la lecture du contenu du fichier en tant qu'URL de données
          reader.readAsDataURL(file);
      }
  }
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
    const { nom, email, password, telephone, dateNaissance,  nomDoc,numDoc, role,photo} = this.form;
    
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
      || this.form.nomDoc == "Type de pieces"
      || this.form.numDoc === null
      || this.form.confirmPassword === null
      || this.form.role == "Type d'Utilisateur"
      || this.form.photo === null

      ) {
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
          this.authService.register(nom, email, password, telephone, dateNaissance, nomDoc,numDoc,role,photo).subscribe({
            next: (data) => {
              // this.storageService.saveUser(data);
              this.isSuccessful = true;
              this.isSignUpFailed = false;
              this.popUpConfirmation()
             
            },
            error: (err) => {
              this.errorMessage = err.error.message;
              this.isSignUpFailed = true;
            },
          });
        }
      })

    }
  }
  onChange(typeUser: any) {
    if (typeUser.value === "locataire" || typeUser.value === 'proprietaire') {
      this.typePieces = this.typepiciesUser;
      this.currentUser = typeUser.value;
      // this.currentType = typeUser.value
    } else if (typeUser.value === 'agence') {
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
  }).then((result) => {
    if (result.isConfirmed) {
      // Réinitialisation des valeurs du formulaire après confirmation
      this.form.nom = '';
      this.form.email = '';
      this.form.password = '';
      this.form.telephone = '';
      this.form.dateNaissance = '';
      this.form.nomDoc = "Type de pieces";
      this.form.numDoc = '';
      this.form.confirmPassword = '';
      this.form.role = "Type d'Utilisateur";
      this.form.photo = null;
  
      // Naviguer vers la page de connexion et recharger la page
      this.router.navigate(['/auth/connexion']).then(() => {
        window.location.reload();
      });
    }
  });
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
