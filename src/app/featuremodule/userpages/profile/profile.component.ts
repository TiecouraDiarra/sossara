import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
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
    old_password: null,
    password: null,
    confirmPassword: null,
  }

  form: any = {
    photo: null,
  }



  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router,
    private serviceUser: UserService
  ) {
    this.User = this.storageService.getUser();
    console.log(this.User);
  //   this.documents = this.User.user.documents
  //   console.log(this.documents[0].photo[0].nom);
  }

  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO + '/uploads/images/';
    return baseUrl + photoFileName;
  }

  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }

  ngOnInit(): void { }

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
            console.log(res);
            this.storageService.clean();
            this.router.navigateByUrl("/auth/connexion")
          },
          error: err => {
            console.log(err);
          }
        });
      }
    })

  }

  //METHODE PERMETTANT DE CHANGER SON MOT DE PASSE
  ChangerMotDePasse(): void {
    if (this.ChangeMdpForm.password !== this.ChangeMdpForm.confirmPassword) {
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

          // Appelez la méthode ChangerMotDePasse() avec le old_password et password
          this.serviceUser.ChangerMotDePasse(this.ChangeMdpForm.old_password, this.ChangeMdpForm.password).subscribe(
            data => {
              console.log("Mot de passe changé avec succès:", data);
              // this.isSuccess = false;
              // Afficher le premier popup de succès
              this.popUpConfirmation();
            },
            error => {
              console.error("Erreur lors du changement de mot de passe :", error);
              // Gérez les erreurs ici
            }
          );
        } else {
          console.error("Token JWT manquant");
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
          console.log(res);
          this.storageService.clean();
          this.router.navigateByUrl("/auth/connexion")
        },
        error: err => {
          console.log(err);
        }
      });
    })

  }

  //METHODE PERMETTANT DE REDIRIGER VERS LA PAGE LOGIN
  path() {
    this.router.navigate([routes.login]);
  }


  //CHANGER LA PHOTO DE PROFIL
  onPhotoChange(event: any): void {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      this.form.photo = selectedFile;
      // const imageUrl = this.generateImageUrl(selectedFile.name);
      console.log(this.form.photo);
      this.onAdd();
    }
  }

  //AJOUTER LA PHOTO DE PROFIL
  onAdd(): void {
    console.log('Add button clicked');
    const { photo } = this.form;
    const user = this.storageService.getUser();
    if (user && user.token && photo) {
      this.serviceUser.changerPhoto(photo).subscribe(
        successResponse => {
          console.log('Photo changed successfully', successResponse);
          this.User.user.photo = photo.name;
          user.user.photo = this.User.user.photo;
          this.storageService.setUser(user);
          console.log(this.User.user.photo);
          this.User.user.photo = photo.name;
          const uniqueFileName = photo.name + `?timestamp=${new Date().getTime()}`;
          this.User.user.photo = uniqueFileName;
          this.generateImageUrl(photo.name);

          // Actualisez automatiquement la page après avoir changé la photo
          location.reload();
        },
        error => {
          console.error('Error while changing photo', error);
        }
      );
    } else {
      console.error('Token JWT missing or no photo selected');
    }
  }



  iconLogle() {
    this.Toggledata = !this.Toggledata;


  }
  icon() {
    this.Toggle = !this.Toggle;
  }
}
