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
  selectedCategory: any = '';
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
  
  sendRegister = false;


  public typeUser: any[] = [
    // { nom: "Type d'Utilisateur", },
    { nom: 'LOCATAIRE OU ACHETEUR', value: 'locataire' },
    { nom: 'PROPRIETAIRE', value: 'proprietaire' },
    { nom: 'AGENCE', value: 'agence' }
  ];

  userName: any = {
    lastName: null,
    firstName: null,
  };

  form: any = {
    nom: null,
    email: null,
    nomAgence: null,
    emailAgence: null,
    password: null,
    telephone: null,
    confirmPassword: null,
    dateNaissance: null,
    nomDoc: "Type de pieces",
    numDoc: null,
    role: "Choisissez un type d'utilisateur",
    photo: null,
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  message: string | undefined;
  selectedFiles: any;
  image: File[] = [];
  images: File[] = [];
  maxImageCount: number = 0; // Limite maximale d'images
  isButtonDisabled: boolean = false; // Variable pour désactiver le bouton si la limite est atteinte
  dateError: string = '';
validateEmail(email: string): boolean {
  // Option 1: Using built-in Angular email validator
  // return Validators.email(email) !== null;  // Returns true/false

  // Option 2: Using regular expression (more strict validation)
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
}


  //CHARGER L'IMAGE
  onFileSelected1(event: any): void {
    this.selectedFiles = event.target.files;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      // Ajoutez la nouvelle image à la liste des images
      this.images.push(this.selectedFiles[0]);
      // Affichez uniquement la nouvelle image dans la vue
      this.image = [e.target.result];
      this.checkImageCount(); // Assurez-vous de vérifier à nouveau la limite après le traitement
      this.form.photo = this.images;
      this.form.photo = event.target.files[0] as File;
      // Appeler la fonction pour traiter la sélection de fichiers
      this.handleFileSelection(event);
    };
    this.form.photo = event.target.files[0] as File;
    reader.readAsDataURL(this.selectedFiles[0]); // Chargez seulement le premier fichier sélectionné

  }


  

  public typepiciesUser = [

    "CarteIN",
    'NINA',
    'Passport',
  ];

  //METHODE PERMETTANT DE CHANGER LES TYPES DE DOC
  onTypePiecesChange(event: any) {
    this.selectedTypePiece = event.value;
    this.resetNumdoc();
    this.removeImages(); // Appel de la fonction removeImage
  }
  
  removeImages() {
    // Votre logique pour supprimer l'image sans utiliser l'index
    this.image.splice(0, 1); // Supprime la première image du tableau
    this.images.splice(0, 1); // Supprime le premier fichier du tableau 'images'
    this.checkImageCount(); // Appelle la fonction pour vérifier la limite d'images après la suppression
  }
  

  //METHODE PERMETTANT DE VERIFIER SI LES DEUX MOTS DE PASSE SONT LES MEMES
  passwordsMatch(): boolean {
    return this.form.password === this.form.confirmPassword;
  }

  public typepiciesAgence = ['RCCM', 'NIF'];

  constructor(public router: Router,
    private authService: AuthService, private storageService: StorageService) { }
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
    const { nom, email, nomAgence, emailAgence, password, telephone, dateNaissance, nomDoc, numDoc, role, photo } = this.form;
    const numero= telephone.replace(/\-/g, '');

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
          this.sendRegister = true;
          this.authService.register(nom, email, nomAgence, emailAgence, password, numero, dateNaissance, nomDoc, numDoc, role, photo).subscribe({
            next: (data) => {
              

              // this.storageService.saveUser(data);
              this.isSuccessful = true;
              this.isSignUpFailed = false;
         
              if (data.status) {
                this.sendRegister = false;
                Swal.fire({
                  position: 'center',
                  text: data.message,
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
                  this.sendRegister = false;
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
              // this.popUpConfirmation()

            },
            error: (err) => {

              this.errorMessage = err.error.message;
              this.isSignUpFailed = true;
              this.sendRegister = false;

            },
          });
        }
      })

    }
  }
  onChange(typeUser: any) {
    if (typeUser.value === "locataire" || typeUser.value === "admin" || typeUser.value === 'proprietaire') {
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
    this.resetNomAgence(); // Appel de la fonction pour réinitialiser le champ nomAgence

  }


  onChangeTypeUser(typePiece: any) {

    if (typePiece.value === "Carte d'identite") {
      this.typePieces = this.typepiciesUser;
      this.currentType = typePiece.value;
    } else if (typePiece.value === 'NINA ou Biometrique') {
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

  getMaximumDate(): string {
    // Obtenir la date du jour
    const today = new Date();

    // Soustraire 18 ans à la date du jour
    const maximumDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    // Formater la date au format ISO (AAAA-MM-JJ)
    return maximumDate.toISOString().split("T")[0];
  }
  validatePassword(password: string): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }
  validateDate(date: string): boolean {
    if (!date) {
      this.dateError = 'La date de naissance est requise.';
      return false;
    }
    const birthDate = new Date(date);
    const today = new Date();
    // Vérifie si la date est valide
    if (isNaN(birthDate.getTime())) {
      this.dateError = 'Veuillez entrer une date valide.';
      return false;
    }
    if (birthDate >= today) {
      this.dateError = 'La date de naissance doit être dans le passé.';
      return false;
    }
    this.dateError = '';
    return true;
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
    if (this.images.length >= 30) {
      this.isButtonDisabled = true;
    } else {
      this.isButtonDisabled = false;
    }
  }

  onKeyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // Caractère non numérique, empêcher l'entrée
      event.preventDefault();
    }

    // Insérer un tiret après chaque paire de chiffres
    const inputValue = event.target.value.replace(/\-/g, ''); // Supprimer les tirets existants
    let formattedValue = '';
    for (let i = 0; i < inputValue.length; i += 2) {
      formattedValue += inputValue.slice(i, i + 2) + '-';
    }
    // Supprimer le tiret final s'il dépasse la limite de 8 caractères
    formattedValue = formattedValue.slice(0, 10);

    // Mettre à jour la valeur dans l'input
    event.target.value = formattedValue;
  }
  

  // Fonction de validation du numéro de CarteIN
  isValidNumDoc(numDoc: string): boolean {
    // Expression régulière pour valider que numDoc contient exactement 7 chiffres
    const regex = /^\d{7}$/;
    return regex.test(numDoc);
  }
  isValidNumDocNina(numDoc: string): boolean {
    // Expression régulière pour valider que numDoc contient exactement 14 chiffres suivis d'une lettre majuscule
    const regex = /^\d{14}[A-Z]$/;
    return regex.test(numDoc);
  }

  isValidMalianPassport(numDoc: string): boolean {
    // Expression régulière pour valider le numéro de passeport malien
    const regex = /^[A-Z][0-9]{8}$/;
    return regex.test(numDoc);
  }
  isValidNif(numDoc: string): boolean {
    // Expression régulière pour valider le numéro de NIF
    const regex = /^\d{9}[A-Z]$/;
    return regex.test(numDoc);
  }
  isValidRccm(numDoc: string): boolean {
    // Expression régulière pour valider le numéro de RCCM
    const regex = /^[A-Za-z0-9]{15}$/;
    return regex.test(numDoc);
  }
  resetNomAgence() {
    if (this.currentUser !== 'agence') {
      this.form.nomAgence = ''; // Réinitialise le champ nomAgence*
      this.form.emailAgence=''
    }

  }
  resetNumdoc() {
      this.form.numDoc = ''; // Réinitialise le champ nomAgence*
  }
  onCurrentUserChange() {
    this.resetNomAgence(); // Appel de la fonction pour réinitialiser le champ nomAgence
  }

 
  
  islongNom(nom: string): boolean {
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/; // Inclure les lettres accentuées et les espaces
    return nom.length <= 40 && regex.test(nom);
  }

  islongNumero(telephone: string): boolean {
    const regex = /^[0-9-]+$/; // Expression régulière pour vérifier que le numéro contient uniquement des chiffres et des tirets
        return telephone.length === 8 && regex.test(telephone);
  }


  
}
