import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ContentChange, SelectionChange } from 'ngx-quill';
import { routes } from 'src/app/core/helpers/routes/routes';
import { AdresseService } from 'src/app/service/adresse/adresse.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-complete-profil',
  templateUrl: './complete-profil.component.html',
  styleUrls: ['./complete-profil.component.css']
})
export class CompleteProfilComponent {
  public routes = routes;
  commune: any;
  pays: any;
  cercle: any;
  region: any;
  nombreZone: any;
  selectedValue: string | any = 'pays';
  selectedValueR: string | any = 'region';
  selectedValueC: string | any = 'cercle';
  regions: any = [];
  cercles: any[] = [];
  communes: any = [];
  isSignUpFailed = false;
  errorMessage = '';
  regions1: any = [];
  selectedCategory: any = '';
  // formModifadress: any;

  formEmail: any = {
    email: null,
  };

  formModifadress: any = {
    quartier: '',
    rue: '',
    porte: '',
    communeform: '',
    description: '',
  };
  profil: any;
  isAgence = false;

  constructor(public router: Router,
    private serviceUser: UserService,
    private storageService: StorageService,
    private serviceAdresse: AdresseService
  ) {

  }
  direction() {
    this.router.navigate([routes.login])
  }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.serviceUser.AfficherUserConnecter().subscribe((data) => {
        this.profil = data[0]?.profil;
        if (this.profil == 'AGENCE') {
          this.isAgence = true
        }
      })
    }
    //AFFICHER LA LISTE DES COMMUNES
    this.serviceAdresse.AfficherListeCommune().subscribe((data) => {
      this.commune = data;
      if (this.selectedValueC) {
        this.communes = this.commune.filter(
          (el: any) => el.cercle.nomcercle == this.selectedValueC
        );
      }
    });
    //AFFICHER LA LISTE DES Pays
    this.serviceAdresse.AfficherListePays().subscribe((data) => {
      this.pays = data;

    });
    //AFFICHER LA LISTE DES CERCLE
    this.serviceAdresse.AfficherListeCercle().subscribe((data) => {
      this.cercle = data;
      if (this.selectedValueR) {
        this.cercles = this.cercle.filter(
          (el: any) => el.region.nomregion == this.selectedValueR
        );
      }
    });

    //AFFICHER LA LISTE DES REGIONS
    this.serviceAdresse.AfficherListeRegion().subscribe((data) => {
      this.region = data;
      this.nombreZone = data.length;
      if (this.selectedValue) {
        this.regions = this.region.filter(
          (el: any) => el.pays.nompays == this.selectedValue
        );
      }
    });

  }

  EnvoieMailForChangePassword() {
    const { email } = this.formEmail;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: '',
        cancelButton: '',
      },
      heightAuto: false
    })

    if (this.formEmail.email === null) {
      swalWithBootstrapButtons.fire(
        "",
        `<h1 style='font-size: 1em; font-weight: bold; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>Tous les champs sont obligatoires !</h1>`,
        "warning"
      )
    } else {
      this.serviceUser.forgotPassword(email).subscribe((data) => {
        if (data.status) {
          let timerInterval = 2000;
          Swal.fire({
            position: 'center',
            text: data.message,
            title: "Message envoyé",
            icon: 'success',
            heightAuto: false,
            showConfirmButton: false,
            confirmButtonColor: '#e98b11',
            showDenyButton: false,
            showCancelButton: false,
            allowOutsideClick: false,
            timer: timerInterval,
            timerProgressBar: true,
          }).then(() => {
            this.formEmail.email === ''
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
            confirmButtonColor: '#e98b11',
            showDenyButton: false,
            showCancelButton: false,
            allowOutsideClick: false,
          }).then((result) => { });
        }
        // swalWithBootstrapButtons.fire(
        //   "",
        //   `<h1 style='font-size: 1em; font-weight: bold; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>${data.message}</h1>`,
        //   "success"
        // );
      }, (error) => {
        const errorMessage = error.errorw && error.error.message ? error.error.message : 'Erreur inconnue';
        swalWithBootstrapButtons.fire(
          "",
          `<h1 style='font-size: 1em; font-weight: bold; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>${errorMessage}</h1>`,
          "error"
        );
      }
      )
    }

  }

  onChange2(newValue: any) {
    // this.selectedValue == newValue.value
    this.regions = this.region.filter(
      (el: any) => el.pays.nompays == newValue.value
    );
  }
  onChangeRegion(newValue: any) {
    this.cercles = this.cercle.filter(
      (el: any) => el.region.nomregion == newValue.value
    );
  }

  onChangeCercle(newValue: any) {
    this.communes = this.commune.filter(
      (el: any) => el.cercle.nomcercle == newValue.value
    );
  }

  path() {
    this.router.navigate([routes.dashboard]);
  }

  CompleterProfil() {
    const { quartier, rue, porte, communeform, description } = this.formModifadress;
    const { selectedValue, selectedValueR, selectedValueC } = this; // Récupérer la valeur sélectionnée dans le champ "pays"

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'swal2-confirm btn',
        cancelButton: 'swal2-cancel btn',
      },
      heightAuto: false,
    });

    if (selectedValue=="pays") {
      swalWithBootstrapButtons.fire({
        text: 'Le pays est obligatoire',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return; // Arrêter l'exécution si le champ commune n'est pas rempli
    }
    if (selectedValueR=="region") {
      swalWithBootstrapButtons.fire({
        text: 'La region est obligatoire',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return; // Arrêter l'exécution si le champ commune n'est pas rempli
    }
    if (selectedValueC=="cercle") {
      swalWithBootstrapButtons.fire({
        text: 'Le cercle est obligatoire',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return; // Arrêter l'exécution si le champ commune n'est pas rempli
    }

    if (!communeform) {
      swalWithBootstrapButtons.fire({
        text: 'La commune est obligatoire',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return; // Arrêter l'exécution si le champ commune n'est pas rempli
    }
    if (!quartier) {
      swalWithBootstrapButtons.fire({
        text: 'Le quartier est obligatoire',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return; // Arrêter l'exécution si le champ quartier n'est pas rempli
    }

    swalWithBootstrapButtons
      .fire({
        text: 'Etes-vous sûre de completer votre profil?',
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
              .modifierAdress(quartier, rue, porte, communeform, description)
              .subscribe({
                next: (data) => {
                  if (data.status) {
                    let timerInterval = 2000;
                    Swal.fire({
                      position: 'center',
                      text: data.message,
                      title: "Mise a jour du profil",
                      icon: 'success',
                      heightAuto: false,
                      showConfirmButton: false,
                      confirmButtonColor: '#e98b11',
                      showDenyButton: false,
                      showCancelButton: false,
                      allowOutsideClick: false,
                      timer: timerInterval,
                      timerProgressBar: true,
                    }).then(() => {
                      this.path();
                      window.location.reload();
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
                      confirmButtonColor: '#e98b11',
                      showDenyButton: false,
                      showCancelButton: false,
                      allowOutsideClick: false,
                    }).then((result) => { });
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

  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['code-block'],
        //  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        //  [{ 'direction': 'rtl' }],                         // text direction

        //  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'align': [] }],

        //  ['clean'],                                         // remove formatting button

        //  ['link'],
        ['link', 'image', 'video']
      ],
    },
  }

  onSelectionChanged = (event: SelectionChange) => {
    if (event.oldRange == null) {
      this.onFocus();
    }
    if (event.range == null) {
      this.onBlur();
    }
  }


  onContentChanged = (event: ContentChange) => {
  }

  onFocus = () => {
  }
  onBlur = () => {
  }

}
