import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import Swal from 'sweetalert2';
const URL_PHOTO: string = environment.Url_PHOTO;


@Component({
  selector: 'app-processus-lances',
  templateUrl: './processus-lances.component.html',
  styleUrls: ['./processus-lances.component.scss']
})
export class ProcessusLancesComponent implements OnInit {
  reclamationProcessusLance: any;
  selectedBienImmoProcessusId: any;
  selectedReclamationId: any;
  maxImageCount: number = 0; // Limite maximale d'images
  selectedFiles: any;
  image: File[] = [];
  images: File[] = [];
  isButtonDisabled: boolean = false; // Variable pour désactiver le bouton si la limite est atteinte
  locale!: string;

  constructor(
    private storageService: StorageService,
    public router: Router,
    private serviceBienImmo: BienimmoService,
    private serviceUser: UserService,
    @Inject(LOCALE_ID) private localeId: string,

  ) {
    this.locale = localeId;

  }
  form: any = {
    contenu: null,
    type: null,
    prix_estimatif: null,
    photos: null,
  };
  ngOnInit(): void {
    //AFFICHER LA LISTE DES RECLAMATIONS DONT LES PROCESSUS SONT LANCES
    this.serviceBienImmo.AfficherLIsteReclamationProcessusLance().subscribe(data => {
      this.reclamationProcessusLance = data.reverse();
      // console.log(this.reclamationProcessusLance);
      
    });
  }
  //FORMATER LE PRIX
  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }


  //METHODE PERMETTANT D'ARRETER LE PROCESSUS DE REPARATION
  ArreterProcessus(): void {
    const { photo } = this.form;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })

    swalWithBootstrapButtons.fire({
      text: "Etes-vous sûre de bien vouloir arreter le processus de reclamation ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        const user = this.storageService.getUser();
        if (user && user.token) {
          // Définissez le token dans le service commentaireService
          this.serviceUser.setAccessToken(user.token);
          // Appelez la méthode ArreterProcessus() avec l'ID

          this.serviceBienImmo.ArreterProcessusNew(this.selectedReclamationId, this.selectedBienImmoProcessusId, photo).subscribe(
            data => {
              // this.isSuccess = false;
              this.popUpConfirmationArreteProcessus();
            },
            error => {

            }
          );
        } else {

        }
      }
    })
  }


  //POPUP APRES CONFIRMATION ARRET PROCESSUS
  popUpConfirmationArreteProcessus() {
    let timerInterval = 2000;
    Swal.fire({
      position: 'center',
      text: 'Processus arreté avec succès.',
      title: 'Processus arreté ',
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
      //AFFICHER LA LISTE DES RECLAMATIONS DONT LES PROCESSUS SONT LANCES
      this.serviceBienImmo.AfficherLIsteReclamationProcessusLance().subscribe(data => {
        this.reclamationProcessusLance = data.reverse();
      });
    })
  }

  //CHARGER L'IMAGE
  onFileSelected(event: any): void {
    const selectedFiles = event.target.files;

    for (const file of selectedFiles) {
      if (this.images.length < 8) {
        const reader = new FileReader(); // Créez un nouvel objet FileReader pour chaque fichier

        reader.onload = (e: any) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, img.width, img.height);
              canvas.toBlob((blob) => {
                if (blob) {
                  const webpFile = new File([blob], 'photo.webp', { type: 'image/webp' });
                  this.images.push(webpFile);
                  this.image.push(e.target.result);
                  this.checkImageCount(); // Appel de la fonction pour vérifier la limite d'images
                  this.maxImageCount = this.image.length;
                }
              }, 'image/webp', 0.8);
            }
          };
          img.src = e.target.result;
        };

        reader.readAsDataURL(file);
      } // Vérifiez si la limite n'a pas été atteinte
    }

    this.form.photo = this.images;
    this.checkImageCount(); // Assurez-vous de vérifier à nouveau la limite après le traitement
  }



  // Fonction pour vérifier la limite d'images et désactiver le bouton si nécessaire
  checkImageCount(): void {
    if (this.images.length >= 8) {
      this.isButtonDisabled = true;
    } else {
      this.isButtonDisabled = false;
    }
  }
  removeImage(index: number) {
    this.image.splice(index, 1); // Supprime l'image du tableau
    this.images.splice(index, 1); // Supprime le fichier du tableau 'images'
    this.checkImageCount(); // Appelle la fonction pour vérifier la limite d'images après la suppression
  }

  // Fonction pour ouvrir le modal avec l'ID du BienImmo
  openProcessusModal(bienImmoId: number, ReclamationId: number) {
    // Stockez l'ID du BienImmo sélectionné dans la variable
    this.selectedBienImmoProcessusId = bienImmoId;
    this.selectedReclamationId = ReclamationId;

  }

  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO;
    return baseUrl + photoFileName;
  }
  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }

}
