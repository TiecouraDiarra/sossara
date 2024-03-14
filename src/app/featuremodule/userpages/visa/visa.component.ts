import { Component, Inject, LOCALE_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { CommoditeService } from 'src/app/service/commodite/commodite.service';
import { ModepaiementService } from 'src/app/service/modepaiement/modepaiement.service';
import Swal from 'sweetalert2';

const URL_PHOTO: string = environment.Url_PHOTO;
@Component({
  selector: 'app-visa',
  templateUrl: './visa.component.html',
  styleUrls: ['./visa.component.scss']
})
export class VisaComponent {

  public routes = routes;
  id: any
  locale!: string;
  candidature: any;
  bien: any;
  photoImmo: any;
  nombreMoisChoisi: number = 0;
  nombreJourChoisi: number = 0;
  nombreSemaineChoisi: number = 0;
  paiementForm: any = {
    nombreMois: null,
    nombreAnnees: null,
    nombreJours: null,
    sommePayer: null,
    numeroPaiement: null,
    modePaiement: null,
  }
  errorMessage: any;
  isError: any = false;

  constructor(
    private paiementService: ModepaiementService,
    @Inject(LOCALE_ID) private localeId: string,
    private serviceUser: UserService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private serviceBienImmo: BienimmoService,

  ) {
    this.locale = localeId;
  }

  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src = 'assets/img/gallery/gallery1/gallery-1.jpg';
  }
  handleAuthorImageError1(event: any) {
    event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }
  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO;
    return baseUrl + photoFileName;
  }

  ngOnInit(): void {
    //RECUPERER L'UUID D'UN BLOG 
    this.id = this.route.snapshot.params["uuid"]
    //AFFICHER UNE CANDIDATURE EN FONCTION DE SON ID
    this.serviceBienImmo.AfficherCandidatureParUuId(this.id).subscribe(data => {
      this.candidature = data;
      this.bien = data?.bien;
      this.photoImmo = data?.bien?.photoImmos;
    })
  }
  //FORMATER LE PRIX
  formatPrice(price: number): string {
    return price?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
  onNombreMoisChange(): void {
    // const selectElement = event.target as HTMLSelectElement;
    // this.nombreMoisChoisi = parseInt(selectElement.value, 10);
  }
  onNombreJourChange(): void {
    // Vous pouvez accéder à this.nombreMoisChoisi ici pour obtenir la nouvelle valeur

  }

  onNombreSemaineChange(): void {
 
  }

  //FAIRE LE PAIEMENT AVEC ORANGE MONEY
  FairePaiement(id: any): void {
    const {
      contenu,
      nombreMois,
      nombreAnnees,
      nombreJours,
      sommePayer,
      numeroPaiement,
      modePaiement,
    } = this.paiementForm;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })
    swalWithBootstrapButtons.fire({
      // title: 'Etes-vous sûre de vous déconnecter?',
      text: "Etes-vous sûre de faire le paiement?",
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

          if(this.bien?.periode?.nom === 'Mensuel'){
            this.paiementForm.nombreMois = this.bien?.avance + this.bien?.caution;
            this.paiementForm.sommePayer = this.bien?.prix * this.paiementForm.nombreMois
          }else if(this.bien?.periode?.nom === 'Journalier'){
            this.paiementForm.nombreJours = this.nombreJourChoisi;
            this.paiementForm.sommePayer = this.bien?.prix * this.nombreJourChoisi;
          }else if(this.bien?.periode?.nom === 'Hebdomadaire'){
            this.paiementForm.nombreAnnees = this.nombreSemaineChoisi;
            this.paiementForm.sommePayer = this.bien?.prix * this.nombreSemaineChoisi;
          }
          this.paiementForm.modePaiement = 1;
          
          // Appelez la méthode ACCEPTERCANDIDATUREBIEN() avec le contenu et l'ID
          this.paiementService.FairePaiement(id, this.paiementForm.nombreMois ,nombreAnnees, this.paiementForm.nombreJours, this.paiementForm.sommePayer, numeroPaiement, 2).subscribe({
            next: (data) => {
              if(data.status){
                let timerInterval = 2000;
                  Swal.fire({
                    position: 'center',
                    text: data.message,
                    title: "Paiement",
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

                  });
              }else{
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
            },
            error: (err) => {
              // console.error("Erreur lors de l'envoi de la candidature :", err);
              this.errorMessage = err.error.message;
              this.isError = true
              // Gérez les erreurs ici
            }
          }
          );
        } else {
          // console.error("Token JWT manquant");
        }
      }
    })
  }
}
