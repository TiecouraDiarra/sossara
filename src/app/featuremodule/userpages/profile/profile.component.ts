import {
  ChangeDetectorRef,
  Component,
  Inject,
  LOCALE_ID,
  OnInit,
  Renderer2,
} from '@angular/core';
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
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  public routes = routes;
  public Toggledata = true;
  public Toggledataold = true;
  public Toggle = true;
  User: any;
  documents: any;

  ChangeMdpForm: any = {
    oldPassword: null,
    newPassword: null,
    confirmPassword: null,
  };

  formModif: any;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  locale!: string;
  isLocataire = false;
  isAgence = false;
  isProprietaire = false;
  roles: string[] = [];
  formModifadress: any;

  form: any = {
    photo: null,
  };
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

  public typepiciesUser = ['Type de pieces', 'CarteIN', 'NINA', 'Passport'];
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
  photo: any;

  onChange(typeUser: any) {
    if (
      typeUser.value === 'LOCATAIRE OU ACHETEUR' ||
      typeUser.value === 'PROPRIETAIRE'
    ) {
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
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    @Inject(LOCALE_ID) private localeId: string,
    private serviceUser: UserService,
    private serviceAdresse: AdresseService
  ) {
    this.locale = localeId;
    this.User = this.storageService.getUser();

    this.formModif = {
      nom: '',
      telephone: '',
      email: '',
      dateNaissance: '',
    };
    this.formModifadress = {
      quartier: '',
      rue: '',
      porte: '',
      communeform: '',
    };
  }

  getRoleLabel(): string {
    if (this.User?.roles?.includes('ROLE_LOCATAIRE')) {
      return 'LOCATAIRE';
    } else if (this.User?.roles?.includes('ROLE_PROPRIETAIRE')) {
      return 'PROPRIETAIRE';
    } else if (this.User?.roles?.includes('ROLE_AGENT')) {
      return 'AGENT';
    } else if (this.User?.roles?.includes('ROLE_AGENCE')) {
      return 'AGENCE';
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
  // generateImageUrl(photoFileName: string): string {
  //   const baseUrl = URL_PHOTO;
  //   // this.cdr.detectChanges();
  //   const timestamp = new Date().getTime(); // Obtenez un horodatage unique
  //   return `${baseUrl}${photoFileName}?timestamp=${timestamp}`;
  // }

  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src =
      'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      // this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
      if (this.roles.includes('ROLE_LOCATAIRE')) {
        this.isLocataire = true;
      } else if (this.roles.includes('ROLE_AGENCE')) {
        this.isAgence = true;
      } else if (this.roles.includes('ROLE_AGENT')) {
        // this.isAgent = true
      } else if (this.roles.includes('ROLE_PROPRIETAIRE')) {
        this.isProprietaire = true;
      }
    }

    //AFFICHER LA PHOTO DE USER CONNECTER
    this.serviceUser.AfficherPhotoUserConnecter().subscribe((data) => {
      this.photo = data;
    });

    //AFFICHER LA LISTE DES COMMUNES
    this.serviceAdresse.AfficherListeCommune().subscribe((data) => {
      this.commune = data;
    });
    //AFFICHER LA LISTE DES Pays
    this.serviceAdresse.AfficherListePays().subscribe((data) => {
      this.pays = data;
    });
    //AFFICHER LA LISTE DES CERCLE
    this.serviceAdresse.AfficherListeCercle().subscribe((data) => {
      this.cercle = data;
    });

    //AFFICHER LA LISTE DES REGIONS
    this.serviceAdresse.AfficherListeRegion().subscribe((data) => {
      this.region = data;
      this.nombreZone = data?.length;
    });

    // Récupérer les données de l'utilisateur connecté
    this.serviceUser.AfficherUserConnecter().subscribe((data) => {
      this.users = data[0];
      this.formModif = {
        nom: this.users?.nom || '', // Assurez-vous de gérer les cas où les données peuvent être nulles
        telephone: this.users.telephone || '',
        email: this.users.email || '',
        dateNaissance: this.users.dateNaissance || '',
      };
      this.selectedValue =
        this.users.adresse?.commune?.cercle?.region.pays?.nompays;

      this.formModifadress = {
        quartier: this.users.adresse?.quartier || '', // Assurez-vous de gérer les cas où les données peuvent être nulles
        rue: this.users.adresse?.rue || '',
        porte: this.users.adresse?.porte || '',
        communeform: this.users.adresse?.commune?.nomcommune || '',
      };
    });
  }
  // Méthode pour charger la liste des pays

  onChange2(newValue: any) {
    this.regions1 = this.region.filter(
      (el: any) =>
        el.pays.id == newValue.value || el.pays.nompays == newValue.value
    );
    this.regions1.forEach((el: any) => {});
  }
  onChangeRegion(newValue: any) {
    this.cercles = this.cercle.filter(
      (el: any) =>
        el.region.id == newValue.value || el.region.nomregion == newValue.value
    );
    this.cercles.forEach((el: any) => {
      this.form.regionForm = el.region.id;
    });
  }
  onChangeCercle(newValue: any) {
    this.communes1 = this.commune.filter(
      (el: any) =>
        el.cercle.id == newValue.value || el.cercle.nomcercle == newValue.value
    );
    this.communes1.forEach((el: any) => {
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
      heightAuto: false,
    });
    swalWithBootstrapButtons
      .fire({
        // title: 'Etes-vous sûre de vous déconnecter?',
        text: 'Etes-vous sûre de vous déconnecter?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Annuler',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.authService.logout().subscribe({
            next: (res) => {
              this.storageService.clean();
              this.router.navigate(['/auth/connexion']).then(() => {
                window.location.reload();
              });
            },
            error: (err) => {},
          });
        }
      });
  }

  //METHODE PERMETTANT DE CHANGER SON MOT DE PASSE
  ChangerMotDePasse(): void {
    const { oldPassword, newPassword } = this.ChangeMdpForm;
    if (this.ChangeMdpForm.newPassword !== this.ChangeMdpForm.confirmPassword) {
      Swal.fire({
        text: 'La confirmation du mot de passe ne correspond pas au nouveau mot de passe.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return; // Sortir de la fonction si les mots de passe ne correspondent pas
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false,
    });
    swalWithBootstrapButtons
      .fire({
        text: 'Etes-vous sûre de changer votre mot de passe ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Annuler',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          const user = this.storageService.getUser();
          if (user && user.token) {
            // Définissez le token dans le service notificationService
            this.serviceUser.setAccessToken(user.token);

            // Appelez la méthode ChangerMotDePasse() avec le oldPassword et newPassword
            this.serviceUser
              .ChangerMotDePasse(oldPassword, newPassword)
              .subscribe(
                (data) => {
                  if (data.status) {
                    let timerInterval = 2000;
                    Swal.fire({
                      position: 'center',
                      text: data.message,
                      title: 'Mot de passe modifié',
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
                      this.router.navigate(['/auth/connexion']).then(() => {
                        window.location.reload();
                      });
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
                    }).then((result) => {});
                  }
                },
                (error) => {}
              );
          } else {
          }
        }
      });
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
      timerProgressBar: true, // ajouter la barre de progression du temps
    }).then((result) => {
      //REDIRECTION ET DECONNECTION APRES LE CHANGEMENT DE MOT DE PASSE
      this.authService.logout().subscribe({
        next: (res) => {
          this.storageService.clean();
          this.router.navigateByUrl('/auth/connexion');
        },
        error: (err) => {},
      });
    });
  }

  //METHODE PERMETTANT DE REDIRIGER VERS LA PAGE LOGIN
  path() {
    this.router.navigate([routes.login]);
  }

  onPhotoChange(event: any): void {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const maxSize = 5 * 1024 * 1024; // Taille maximale en octets (5 Mo)

      if (selectedFile.size <= maxSize) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target) {
            // Vérification de nullité pour event.target
            // Convertir l'image en WebP
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, img.width, img.height);
                canvas.toBlob(
                  (blob) => {
                    if (blob) {
                      // Vérification de nullité pour blob
                      const webpFile = new File([blob], 'photo.webp', {
                        type: 'image/webp',
                      });
                      // Ajouter le fichier WebP au formulaire et exécuter votre logique d'ajout ici
                      this.form.photo = webpFile;
                      this.onAdd();
                    }
                  },
                  'image/webp',
                  0.8
                );
              }
            };
            img.src = event.target.result as string;
          }
        };
        reader.readAsDataURL(selectedFile);
      } else {
        // Réinitialiser la sélection de fichier
        event.target.value = '';
      }
    }
  }

  //AJOUTER LA PHOTO DE PROFIL
  onAdd(): void {
    const { photo } = this.form;
    const user = this.storageService.getUser();
    if (this.users && photo) {
      this.serviceUser.changerPhoto(photo).subscribe(
        (successResponse) => {
          this.reloadPage();
        },
        (error) => {}
      );
    } else {
    }
  }

  //METHODE PERMETTANT DE MODIFIER LE PROFIL D'UN UTILISATEUR
  ModifierProfilUser() {
    const { nom, telephone, email, dateNaissance } = this.formModif;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false,
    });
  
    swalWithBootstrapButtons
      .fire({
        // title: 'Etes-vous sûre de vous déconnecter?',
        text: 'Etes-vous sûre de modifier votre profile?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Annuler',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          const user = this.storageService.getUser();
          if (user && user.token) {
            // Définissez le token dans le service serviceUser
            this.serviceUser.setAccessToken(user.token);
            // alert(dateNaissance)
            this.serviceUser
              .modifierProfil(nom, telephone, email, dateNaissance)
              .subscribe({
                next: (data) => {
                  // Mise à jour des données utilisateur dans le sessionStorage
                  // const updatedUser = this.storageService.getUser(); // Récupérez l'utilisateur du sessionStorage
                  // if (updatedUser) {
                  //   // Mise à jour des données de l'utilisateur avec les données mises à jour du serveur
                  //   // updatedUser.user.username = data.user.username;
                  //   // updatedUser.user.email = data.user.email;
                  //   // updatedUser.user.telephone = data.user.telephone;
                  //   // updatedUser.user.dateNaissance = data.user.dateNaissance;

                  //   // Mise à jour des données dans le sessionStorage avec les données mises à jour
                  //   this.storageService.setUser(updatedUser); // Utilisez l'utilisateur mis à jour
                  // }

                  this.isSuccessful = true;
                  this.isSignUpFailed = false;
                  this.popUpModification();
                  console.log(this.storageService.getUser().email);

                  if (this.storageService.getUser().email !== email) {
                    // Utilisation correcte de la comparaison
                    console.log(this.storageService.getUser().email);

                    this.storageService.clean();
                    this.router.navigate(['/auth/connexion']).then(() => {
                      window.location.reload();
                    });
                    this.popUpModification();
                  } else {
                    window.location.reload();
                  }
                },
                error: (err) => {
                  this.errorMessage = err.error.message;
                  this.isSignUpFailed = true;
                },
              });
          } else {
          }
        }
      });
  }

  ModifierAdressUser() {
    const { quartier, rue, porte, communeform } = this.formModifadress;

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false,
    });

    swalWithBootstrapButtons
      .fire({
        text: 'Etes-vous sûre de modifier votre profil?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Annuler',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          const user = this.storageService.getUser();

          if (user && user.token) {
            this.serviceUser.setAccessToken(user.token);
            this.serviceUser
              .modifierAdress(quartier, rue, porte, communeform)
              .subscribe({
                next: (data) => {
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
                                  nompays:
                                    data.commune.cercle.region.pays.nompays,
                                },
                              },
                            },
                          },
                          status: true,
                        };
                      } else {
                        user.adresse.quartier = quartier;
                        user.adresse.rue = rue;
                        user.adresse.porte = porte;
                        user.adresse.commune.id = data.commune.id;
                        user.adresse.commune.nomcommune =
                          data.commune.nomcommune;
                        user.adresse.commune.cercle.id = data.commune.cercle.id;
                        user.adresse.commune.cercle.nomcercle =
                          data.commune.cercle.nomcercle;
                        user.adresse.commune.cercle.region.id =
                          data.commune.cercle.region.id;
                        user.adresse.commune.cercle.region.nomregion =
                          data.commune.cercle.region.nomregion;
                        user.adresse.commune.cercle.region.pays.id =
                          data.commune.cercle.region.pays.id;
                        user.adresse.commune.cercle.region.pays.nompays =
                          data.commune.cercle.region.pays.nompays;
                      }
                      this.storageService.setUser(user);
                    }
                    this.isSuccessful = true;
                    this.isSignUpFailed = false;
                    this.popUpModification();
                  } else {
                  }
                },
                error: (err) => {
                  this.errorMessage = err.error.message;
                  this.isSignUpFailed = true;
                },
              });
          } else {
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
      timerProgressBar: true, // ajouter la barre de progression du temps
    }).then(() => {
      this.formModifadress.communeform; // Réinitialisez la valeur de formModif.username
      this.formModifadress.quartier; // Réinitialisez la valeur de formModif.telephone
      this.formModifadress.rue; // Réinitialisez la valeur de formModif.email
      this.formModifadress.porte; // Réinitialisez la valeur de formModif.dateNaissance
    });
  }

  //TAILLE MAXIMUM DE LA PHOTO DE PROFIL
  onFileSelected(event: any): void {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files[0]) {
      const file = inputElement.files[0];
      const maxSize = 5 * 1024 * 1024; // Taille maximale en octets (5 Mo)

      if (file.size > maxSize) {
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

  iconold() {
    this.Toggledataold = !this.Toggledataold;
  }

  
  validatePassword(newPassword: string): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(newPassword);
  }
  
  passwordsMatch(): boolean {
    return this.ChangeMdpForm.newPassword === this.ChangeMdpForm.confirmPassword;
  }
  

}
