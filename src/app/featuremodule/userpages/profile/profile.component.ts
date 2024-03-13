import { Component, Inject, LOCALE_ID, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { AdresseService } from 'src/app/service/adresse/adresse.service';
import { AuthService } from 'src/app/service/auth/auth.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import Swal from 'sweetalert2';

const URL_PHOTO: string = environment.Url_PHOTO;


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public routes = routes;
  public Toggledata = true;
  public Toggle = true;
  User: any
  documents: any

  ChangeMdpForm: any = {
    oldPassword: null,
    newPassword: null,
    confirmPassword: null
  }

  formModif: any
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  locale!: string;
  isLocataire = false;
  isAgence = false;
  roles: string[] = [];
  formModifadress:any;


  form: any = {
    photo: null,
  }
  public currentUser = 'Utilisateur';
  public typePieces: any = [];
  public currentType = 'Type';
  public TYpePie = 'TypePiece';
  public typeUser = [
    "Type d'Utilisateur",
    'LOCATAIRE OU ACHETEUR',
    'PROPRIETAIRE',
    'AGENCE',
  ];

  public typepiciesUser = [
    'Type de pieces',
    "CarteIN",
    'NINA',
    'Passport',
  ];
  commune: any;
  pays: any;
  cercle: any;
  region: any;
  nombreZone: any;
  selectedValue: string = '';
  selectedValueR: string | any = 'region';
  selectedValueC: string | any = 'cercle';
  regions: any[] = [];
  cercles: any[] = [];
  communes: any = [];
  communes1: any = [];
  regions1: any = [];
  users: any;



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
    } else if (typePiece.value === 'NINA ou Biometrique') {
      this.typePieces = this.typepiciesUser;
      this.currentUser = typePiece.value;
    } else {
      // this.typePieces = [];
      this.currentType = 'Type';
    }
  }
  public typepiciesAgence = ['Type de pieces', 'RCCM', 'NIF'];


  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router,
    private renderer: Renderer2,
    @Inject(LOCALE_ID) private localeId: string,
    private serviceUser: UserService,
    private serviceAdresse: AdresseService,
    

  ) {
    this.locale = localeId;
    this.User = this.storageService.getUser();
    // console.log(this.User);
   
    this.formModif = {
      nom: '',
      telephone: '',
      email: '',
      date_de_naissance: '',
    };
    this.formModifadress = {
      quartier: '',
      rue:  '',
      porte:  '',
      communeform:  ''
  };
  }

  getRoleLabel(): string {
    if (this.users?.roles?.includes('ROLE_LOCATAIRE')) {
      return 'LOCATAIRE';
    } else if (this.User?.roles?.includes('ROLE_PROPRIETAIRE') || this.User?.roles?.includes('ROLE_AGENCE')) {
      return 'AGENCE';
    } else if (this.User?.roles?.includes('ROLE_AGENT')) {
      return 'AGENT';
    } else {
      return '';
    }
  }
  profileImageUrl: string = ''; // Variable pour stocker le chemin de l'image de profil

  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO;
    return baseUrl + photoFileName;
  }

  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      // this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
      // console.log(this.roles);
      if (this.roles.includes("ROLE_LOCATAIRE")) {
        this.isLocataire = true
      } else if (this.roles.includes("ROLE_AGENCE")) {
        this.isAgence = true
      } else if (this.roles.includes("ROLE_AGENT")) {
        // this.isAgent = true
      }
     
    }



      //AFFICHER LA LISTE DES COMMUNES
      this.serviceAdresse.AfficherListeCommune().subscribe((data) => {
        this.commune = data;
        console.log('commune de test', this.commune);
      });
      //AFFICHER LA LISTE DES Pays
      this.serviceAdresse.AfficherListePays().subscribe((data) => {
        this.pays = data;
        console.log('pays', this.pays);
      });
      //AFFICHER LA LISTE DES CERCLE
      this.serviceAdresse.AfficherListeCercle().subscribe((data) => {
        this.cercle = data;
        console.log('cercle de test', this.cercle);
      });
  
      //AFFICHER LA LISTE DES REGIONS
      this.serviceAdresse.AfficherListeRegion().subscribe((data) => {
        this.region = data;
        this.nombreZone = data?.length;
        console.log('region', this.region);
      });

       // Récupérer les données de l'utilisateur connecté
  this.serviceUser.AfficherUserConnecter().subscribe((data) => {
    this.users = data[0];
    // Attribuer les valeurs de l'utilisateur aux formulaires
    this.formModif = {
      nom: this.users?.nom || '', // Assurez-vous de gérer les cas où les données peuvent être nulles
      telephone: this.users.telephone || '',
      email: this.users.email || '',
      date_de_naissance: this.users.dateNaissance || '',
    };
    this.selectedValue= this.users.adresse?.commune?.cercle?.region.pays?.nompays;

    this.formModifadress = {
      quartier: this.users.adresse?.quartier || '', // Assurez-vous de gérer les cas où les données peuvent être nulles
      rue:  this.users.adresse?.rue || '',
      porte:  this.users.adresse?.porte || '',
      communeform:  this.users.adresse?.commune?.nomcommune || ''
    };
  });
  

  }
   // Méthode pour charger la liste des pays
  
  onChange2(newValue: any) {
    this.regions1 = this.region.filter(
      (el: any) =>
        el.pays.id == newValue.value || el.pays.nompays == newValue.value
    );
    this.regions1.forEach((el: any) => {
      console.log('pays.id', el.pays.id);
      // this.form.regionForm = el.region.id;

    });
  }
  onChangeRegion(newValue: any) {
    this.cercles = this.cercle.filter(
      (el: any) =>
        el.region.id == newValue.value || el.region.nomregion == newValue.value
    );
    this.cercles.forEach((el: any) => {
      console.log('region.id', el.region.id);
      this.form.regionForm = el.region.id;

    });
  }
  onChangeCercle(newValue: any) {
    this.communes1 = this.commune.filter(
      (el: any) =>
        el.cercle.id == newValue.value || el.cercle.nomcercle == newValue.value
    );
    this.communes1.forEach((el: any) => {
      console.log('cercle.id', el.cercle.id);
      this.form.cercleForm = el.cercle.id;

    });
  }

  //METHODE PERMETTANT DE SE DECONNECTER
  logout(): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })
    swalWithBootstrapButtons.fire({
      // title: 'Etes-vous sûre de vous déconnecter?',
      text: "Etes-vous sûre de vous déconnecter?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout().subscribe({
          next: res => {
            // console.log(res);
            this.storageService.clean();
            this.router.navigateByUrl("/auth/connexion")
          },
          error: err => {
            // console.log(err);
          }
        });
      }
    })

  }

  //METHODE PERMETTANT DE CHANGER SON MOT DE PASSE
  ChangerMotDePasse(): void {
    const { oldPassword, newPassword } = this.ChangeMdpForm;
    if (this.ChangeMdpForm.newPassword !== this.ChangeMdpForm.confirmPassword) {
      Swal.fire({
        text: "La confirmation du mot de passe ne correspond pas au nouveau mot de passe.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return; // Sortir de la fonction si les mots de passe ne correspondent pas
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })
    swalWithBootstrapButtons.fire({
      text: "Etes-vous sûre de changer votre mot de passe ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        const user = this.storageService.getUser();
        if (user && user.token) {
          // Définissez le token dans le service notificationService
          this.serviceUser.setAccessToken(user.token);

          // Appelez la méthode ChangerMotDePasse() avec le oldPassword et newPassword
          this.serviceUser.ChangerMotDePasse(oldPassword, newPassword).subscribe(
            data => {
              console.log(data);
              if (data.status) {
                let timerInterval = 2000;
                Swal.fire({
                  position: 'center',
                  text: data.message,
                  title: "Mot de passe modifié",
                  icon: 'success',
                  heightAuto: false,
                  showConfirmButton: false,
                  confirmButtonColor: '#0857b5',
                  showDenyButton: false,
                  showCancelButton: false,
                  allowOutsideClick: false,
                  timer: timerInterval,
                  timerProgressBar: true,
                }).then(() => {
                  this.storageService.clean();
                  this.router.navigateByUrl("/auth/connexion")
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
                  confirmButtonColor: '#0857b5',
                  showDenyButton: false,
                  showCancelButton: false,
                  allowOutsideClick: false,
                }).then((result) => { });
              }
              // console.log("Mot de passe changé avec succès:", data);
              // this.isSuccess = false;
              // Afficher le premier popup de succès
              // this.popUpConfirmation();
            },
            error => {
              // console.error("Erreur lors du changement de mot de passe :", error);
              // Gérez les erreurs ici
            }
          );
        } else {
          // console.error("Token JWT manquant");
        }
      }
    })

    //Faire un notification
    //  this.servicenotification.Fairenotification(this.notificationForm.contenu, this.id).subscribe(data=>{
    //   console.log(data);
    // });
  }


  //POPUP APRES CHANGEMENT DE MOT DE PASSE
  popUpConfirmation() {
    let timerInterval = 2000;
    Swal.fire({
      position: 'center',
      text: 'Le mot de passe a été modifié avec succès.',
      title: 'Mot de passe modifié',
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
      //REDIRECTION ET DECONNECTION APRES LE CHANGEMENT DE MOT DE PASSE
      this.authService.logout().subscribe({
        next: res => {
          // console.log(res);
          this.storageService.clean();
          this.router.navigateByUrl("/auth/connexion")
        },
        error: err => {
          // console.log(err);
        }
      });
    })

  }

  //METHODE PERMETTANT DE REDIRIGER VERS LA PAGE LOGIN
  path() {
    this.router.navigate([routes.login]);
  }


  //CHANGER LA PHOTO DE PROFIL
  // onPhotoChange(event: any): void {
  //   const selectedFile = event.target.files[0];

  //   if (selectedFile) {
  //     this.form.photo = selectedFile;
  //     console.log(this.form.photo);
  //     this.onAdd();
  //   }
  // }
  onPhotoChange(event: any): void {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const maxSize = 5 * 1024 * 1024; // Taille maximale en octets (5 Mo)

      if (selectedFile.size <= maxSize) {
        // Vous pouvez également afficher des informations sur le fichier si nécessaire
        // console.log(`Nom du fichier: ${selectedFile.name}`);
        // console.log(`Type de fichier: ${selectedFile.type}`);
        // console.log(`Taille du fichier: ${selectedFile.size} octets`);

        // Ajoutez le fichier au formulaire et exécutez votre logique d'ajout ici
        this.form.photo = selectedFile;
        this.onAdd();
      } else {
        alert("La taille du fichier est supérieure à 5 Mo. Veuillez choisir un fichier plus petit.");
        // Réinitialiser la sélection de fichier
        event.target.value = '';
      }
    }
  }

  //AJOUTER LA PHOTO DE PROFIL
  onAdd(): void {
    // console.log('Add button clicked');
    const { photo } = this.form;
    const user = this.storageService.getUser();
    if (user && user.token && photo) {
      this.serviceUser.changerPhoto(photo).subscribe(
        successResponse => {
          // console.log('Photo changed successfully', successResponse);
          // this.User.photos[0] = photo.name;
          // user.photos[0].nom = successResponse?.message;
          if (user.utilisateurPhoto?.length > 0) {
            user.utilisateurPhoto.nom = successResponse?.message;
          } else {
            user.utilisateurPhoto = [{ nom: successResponse?.message }];
          }
          this.storageService.setUser(user);
          // console.log(successResponse);
          // this.User.photos[0].nom = photo.name;
          // this.generateImageUrl(photo.name);
          // Mettez à jour le chemin de l'image de profil
          // this.profileImageUrl = this.generateImageUrl(photo.name) + '?timestamp=' + new Date().getTime();
          // const uniqueFileName = photo.name + `?timestamp=${new Date().getTime()}`;
          // if (this.User.photos?.length > 0 || this.User.photos.length === 0) {
          //   this.User.photos[0].nom = uniqueFileName;
          // }
          this.reloadPage();
        },
        error => {
          // console.error('Error while changing photo', error);
        }
      );
    } else {
      // console.error('Token JWT missing or no photo selected');
    }
  }

  //METHODE PERMETTANT DE MODIFIER LE PROFIL D'UN UTILISATEUR
  ModifierProfilUser() {
    const { nom,
      telephone,
      email,
      dateNaissance } = this.formModif;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })
    swalWithBootstrapButtons.fire({
      // title: 'Etes-vous sûre de vous déconnecter?',
      text: "Etes-vous sûre de modifier votre profil?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        const user = this.storageService.getUser();
        if (user && user.token) {
          // Définissez le token dans le service serviceUser
          this.serviceUser.setAccessToken(user.token);
          this.serviceUser.modifierProfil(nom, telephone, email, dateNaissance).subscribe({
            next: data => {
              // console.log(data);

              // Mise à jour des données utilisateur dans le sessionStorage
              // const updatedUser = this.storageService.getUser(); // Récupérez l'utilisateur du sessionStorage
              // if (updatedUser) {
              //   // Mise à jour des données de l'utilisateur avec les données mises à jour du serveur
              //   // updatedUser.user.username = data.user.username;
              //   // updatedUser.user.email = data.user.email;
              //   // updatedUser.user.telephone = data.user.telephone;
              //   // updatedUser.user.date_de_naissance = data.user.date_de_naissance;

              //   // Mise à jour des données dans le sessionStorage avec les données mises à jour
              //   this.storageService.setUser(updatedUser); // Utilisez l'utilisateur mis à jour
              // }

              this.isSuccessful = true;
              this.isSignUpFailed = false;
              this.popUpModification();
              window.location.reload();
            },
            error: err => {
              this.errorMessage = err.error.message;
              // console.log(this.errorMessage);
              this.isSignUpFailed = true;
            }
          });

        } else {
          // console.error("Token JWT manquant");
        }
      }
    })

  }

  ModifierAdressUser() {
    const {
        quartier,
        rue,
        porte,
        communeform
    } = this.formModifadress;

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn',
            cancelButton: 'btn btn-danger',
        },
        heightAuto: false
    });

    swalWithBootstrapButtons.fire({
        text: "Etes-vous sûre de modifier votre profil?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Annuler',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            const user = this.storageService.getUser();

            if (user && user.token) {
                this.serviceUser.setAccessToken(user.token);
                this.serviceUser.modifierAdress(quartier, rue, porte, communeform).subscribe({
                  next: data => {
                      console.log(data);
                      if (data) {
                          const user = this.storageService.getUser();
              
                          if (user) {
                              if (user.adresse === null) {
                                  user.adresse = {
                                      id: data.id,
                                      rue: rue,
                                      porte: porte,
                                      quartier: quartier,
                                      latitude: null,
                                      longitude: null,
                                      commune: {
                                          id: data.commune.id,
                                          nomcommune: data.commune.nomcommune,
                                          cercle: {
                                              id: data.commune.cercle.id,
                                              nomcercle: data.commune.cercle.nomcercle,
                                              region: {
                                                  id: data.commune.cercle.region.id,
                                                  nomregion: data.commune.cercle.region.nomregion,
                                                  pays: {
                                                      id: data.commune.cercle.region.pays.id,
                                                      nompays: data.commune.cercle.region.pays.nompays
                                                  }
                                              }
                                          }
                                      },
                                      status: true
                                  };
                              } else {
                                  user.adresse.quartier = quartier;
                                  user.adresse.rue = rue;
                                  user.adresse.porte = porte;
                                  user.adresse.commune.id = data.commune.id;
                                  user.adresse.commune.nomcommune = data.commune.nomcommune;
                                  user.adresse.commune.cercle.id = data.commune.cercle.id;
                                  user.adresse.commune.cercle.nomcercle = data.commune.cercle.nomcercle;
                                  user.adresse.commune.cercle.region.id = data.commune.cercle.region.id;
                                  user.adresse.commune.cercle.region.nomregion = data.commune.cercle.region.nomregion;
                                  user.adresse.commune.cercle.region.pays.id = data.commune.cercle.region.pays.id;
                                  user.adresse.commune.cercle.region.pays.nompays = data.commune.cercle.region.pays.nompays;
                              }
                              this.storageService.setUser(user);
                          }
                          this.isSuccessful = true;
                          this.isSignUpFailed = false;
                          this.popUpModification();
                           window.location.reload();
                      } else {
                          // console.log("Les données d'adresse sont manquantes ou incorrectes.");
                      }
                  },
                  error: err => {
                      this.errorMessage = err.error.message;
                      this.isSignUpFailed = true;
                  }
              });
              
            } else {
                console.error("Token JWT manquant");
            }
        }
    });
}


  //POPUP APRES MODIFICATION PROFIL
  popUpModification() {
    let timerInterval = 2000;
    Swal.fire({
      position: 'center',
      text: 'Profil modifié avec succès.',
      title: 'Modification de profil',
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

    }).then(() => {
      this.formModifadress.communeform; // Réinitialisez la valeur de formModif.username
      this.formModifadress.quartier; // Réinitialisez la valeur de formModif.telephone
      this.formModifadress.rue; // Réinitialisez la valeur de formModif.email
      this.formModifadress.porte; // Réinitialisez la valeur de formModif.date_de_naissance
    })
  }

  //TAILLE MAXIMUM DE LA PHOTO DE PROFIL
  onFileSelected(event: any): void {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files[0]) {
      const file = inputElement.files[0];
      const maxSize = 5 * 1024 * 1024; // Taille maximale en octets (5 Mo)

      if (file.size > maxSize) {
        alert("La taille du fichier est supérieure à 5 Mo. Veuillez choisir un fichier plus petit.");
        this.renderer.setProperty(inputElement, 'value', ''); // Réinitialiser la sélection de fichier
      }
    }
  }

  reloadPage(): void {
    window.location.reload();
  }

  iconLogle() {
    this.Toggledata = !this.Toggledata;


  }
  icon() {
    this.Toggle = !this.Toggle;
  }
}
