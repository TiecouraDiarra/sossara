import { Component, Inject, LOCALE_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { ModepaiementService } from 'src/app/service/modepaiement/modepaiement.service';
import Swal from 'sweetalert2';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-recu',
  templateUrl: './recu.component.html',
  styleUrls: ['./recu.component.scss']
})
export class RecuComponent {
  public routes = routes;
  id: any
  locale!: string;
  paiement: any;
  bien: any;
  photoImmo: any;
  transaction: any;
  locataire: any;
  proprietaire: any;
  modePaiement: any;

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
    //AFFICHER UN PAIEMENT EN FONCTION DE SON ID
    this.paiementService.AfficherPaiementParUuId(this.id).subscribe(data => {
      this.paiement = data;
      this.modePaiement = data?.modePaiement;
      this.bien = data?.transaction?.bien;
      this.locataire = data?.utilisateur;
      this.proprietaire = data?.transaction?.bien?.proprietaire;
      this.transaction = data?.transaction;
      this.photoImmo = data?.transaction?.bien?.photoImmos;
      console.log(this.paiement);
    })
  }
  //FORMATER LE PRIX
  formatPrice(price: number): string {
    return price?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  //METHODE PERMETTANT D'ENREGISTRER OU NON
  EnregistrerOuNon(id: number): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })
    swalWithBootstrapButtons.fire({
      // title: 'Etes-vous sûre de vous déconnecter?',
      text: "Etes-vous sûre de vouloir effectuer cette operation?",
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

          // Appelez la méthode PrendreRdv() avec le contenu et l'ID
          this.paiementService.EnregistrerOuNon(id).subscribe({
            next: (data) => {
              let timerInterval = 2000;
              Swal.fire({
                position: 'center',
                text: 'Operation a été effectuée avec succès.',
                // title: 'Recherche enregistrée',
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
                this.paiementService.AfficherPaiementParUuId(this.id).subscribe(data => {
                  this.paiement = data;
                  this.modePaiement = data?.modePaiement;
                  this.bien = data?.transaction?.bien;
                  this.locataire = data?.utilisateur;
                  this.proprietaire = data?.transaction?.bien?.proprietaire;
                  this.transaction = data?.transaction;
                  this.photoImmo = data?.transaction?.bien?.photoImmos;
                  console.log(this.paiement);
                })
              })
            },
            error: (err) => {
              swalWithBootstrapButtons.fire(
                'Token expiré',
                `<p style='font-size: 1em; font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;'>Erreur lors de l'enregistrement</p>`,
                'error'
              );
              //   console.error("Erreur lors de l'enregistrement :", err);
            }
          }
          );
        } else {
          swalWithBootstrapButtons.fire(
            'Token expiré',
            `<p style='font-size: 1em; font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;'>Votre session a expiré en raison d'un token périmé. Veuillez vous reconnecter pour continuer à utiliser notre application.</p>`,
            'error'
          );
          // console.error("Token JWT manquant");
        }
      }
    })
  }


}
