import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { AuthService } from 'src/app/service/auth/auth.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { DataService } from 'src/app/service/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {
  public routes = routes;
  rdv: any;
  User: any;
  candidature: any;
  errorMessage: any = '';
  isSuccess: any = false;
  isError: any = false;


  public reviewdata: any = []
  constructor(
    private dataservice: DataService,
    private authService: AuthService,
    private storageService: StorageService,
    private serviceBienImmo: BienimmoService,
    private serviceUser: UserService,
    private router: Router,
  ) {
    this.reviewdata = this.dataservice.reviewdata
  }
  ngOnInit(): void {
    console.log(this.storageService.getUser());
    this.User = this.storageService.getUser().user.id;
    const Users = this.storageService.getUser();
    console.log(this.User);
    const token = Users.token;
    this.serviceUser.setAccessToken(token);

    //AFFICHER LA LISTE DES RDV
    this.serviceUser.AfficherLaListeRdv().subscribe(data => {
      this.rdv = data.reverse();
      // this.nombreRdvUser = data.length;
      console.log(this.rdv);
    }
    );

    //AFFICHER LA LISTE DES CANDIDATURE PAR USER
    this.serviceUser.AfficherLaListeCandidature().subscribe(data => {
      this.candidature = data.candidature.reverse();
      // this.nombreRdvUser = data.length;
      console.log(this.candidature);
    }
    );
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

  //ACCEPTER LA CANDIDATURE D'UN BIEN
  AccepterCandidaterBien(id: any): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })
    swalWithBootstrapButtons.fire({
      // title: 'Etes-vous sûre de vous déconnecter?',
      text: "Etes-vous sûre de valider cette candidature?",
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



          // Appelez la méthode ACCEPTERCANDIDATUREBIEN() avec le contenu et l'ID
          this.serviceBienImmo.AccepterCandidaterBien(id).subscribe({
            next: (data) => {
              console.log("Candidature acceptée avec succès:", data);
              this.isSuccess = true;
              this.errorMessage = 'Candidature acceptée avec succès';

              // Afficher le premier popup de succès
              this.popUpConfirmation();
            },
            error: (err) => {
              console.error("Erreur lors de l'envoi de la candidature :", err);
              this.errorMessage = err.error.message;
              this.isError = true
              // Gérez les erreurs ici
            }
          }
          );
        } else {
          console.error("Token JWT manquant");
        }
      }
    })
  }

  //ANNULER LA CANDIDATURE D'UN BIEN
  AnnulerCandidaterBien(id: any): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })
    swalWithBootstrapButtons.fire({
      // title: 'Etes-vous sûre de vous déconnecter?',
      text: "Etes-vous sûre d'annuler cette candidature?",
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



          // Appelez la méthode ANNULERCANDIDATUREBIEN() avec le contenu et l'ID
          this.serviceBienImmo.AccepterCandidaterBien(id).subscribe({
            next: (data) => {
              console.log("Candidature annulée avec succès:", data);
              this.isSuccess = true;
              this.errorMessage = 'Candidature annulée avec succès';
              // Afficher le premier popup d'annulation
              this.popUpAnnulation();
            },
            error: (err) => {
              console.error("Erreur lors de l'annulation de la candidature :", err);
              this.errorMessage = err.error.message;
              this.isError = true
              // Gérez les erreurs ici
            }
          }
          );
        } else {
          console.error("Token JWT manquant");
        }
      }
    })
  }

  //POPUP APRES CONFIRMATION DE CANDIDATURE
  popUpConfirmation() {
    let timerInterval = 2000;
    Swal.fire({
      position: 'center',
      text: 'La candidature a été acceptée avec succès.',
      title: 'Candidature acceptée',
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
      //AFFICHER LA LISTE DES CANDIDATURE PAR USER
      this.serviceUser.AfficherLaListeCandidature().subscribe(data => {
        this.candidature = data.candidature.reverse();
        // this.nombreRdvUser = data.length;
        console.log(this.candidature);
      }
      );
    })

  }

  //POPUP APRES ANNULATION DE CANDIDATURE
  popUpAnnulation() {
    let timerInterval = 2000;
    Swal.fire({
      position: 'center',
      text: 'La candidature a été annulée avec succès.',
      title: 'Candidature annulée',
      icon: 'error',
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
      //AFFICHER LA LISTE DES CANDIDATURE PAR USER
      this.serviceUser.AfficherLaListeCandidature().subscribe(data => {
        this.candidature = data.candidature.reverse();
        // this.nombreRdvUser = data.length;
        console.log(this.candidature);
      }
      );
    })

  }
}
