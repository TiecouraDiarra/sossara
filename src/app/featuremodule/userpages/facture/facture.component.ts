import { Component, HostListener, Inject, LOCALE_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { FactureService } from 'src/app/service/facture/facture.service';
import { ModepaiementService } from 'src/app/service/modepaiement/modepaiement.service';
import Swal from 'sweetalert2';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.scss']
})
export class FactureComponent {
  public routes = routes;
  id: any
  locale!: string;
  paiement: any;
  modepaiement: any;
  bien: any;
  photoImmo: any;
  transaction: any;
  locataire: any;
  proprietaire: any;
  modePaiement: any;
  facture: any;
  // Déclarez une variable pour stocker l'ID du BienImmo sélectionné
  selectedFactureId: any;
  selectedPaymentMode: any;
  selectedBienImmoId: any;
  CandidatureUser: any;
  isAgenceProprietaire = false;
  roles: string[] = [];

  // Supposons que vous avez une image par défaut dans votre projet
  defaultImageUrl: string = 'assets/img/typebien/villa.png';
  emailProprietaire: any;
  users: any;
 
  setDefaultImage(event: any): void {
    // Si le chargement de l'image échoue, utilisez l'image par défaut
    event.target.src = this.defaultImageUrl;
  }
  isMobile= false;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 767;
   
  }

  constructor(
    private paiementService: ModepaiementService,
    @Inject(LOCALE_ID) private localeId: string,
    private serviceUser: UserService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private serviceBienImmo: BienimmoService,
    private router: Router,
    private modepaiementService: ModepaiementService,
    private serviceFacture: FactureService,

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
    if (this.storageService.isLoggedIn()) {
      
    }

    //RECUPERER L'UUID D'UN BLOG 
    this.id = this.route.snapshot.params["uuid"]
    //AFFICHER UN PAIEMENT EN FONCTION DE SON ID
    this.serviceFacture.AfficherFactureParUuId(this.id).subscribe(data => {
      this.facture = data;
      
      this.modePaiement = data?.modePaiement;
      this.bien = data?.bien;
      this.locataire = data?.locataire;
      this.proprietaire = data?.bien?.proprietaire;
      this.transaction = data?.transaction;
      this.serviceUser.AfficherUserConnecter().subscribe((data) => {
        this.users = data && data.length > 0 ? data[0] : null;
        this.emailProprietaire = this.users.email
        if (this.emailProprietaire == this.proprietaire.email) {
          this.isAgenceProprietaire = true;
        }
      })
      // this.photoImmo = data?.bien?.photoImmos;
    })

    //AFFICHER LA LISTE DES MODES DE PAIEMENTS
    this.modepaiementService.AfficherListeModePaiement().subscribe(data => {
      this.modepaiement = data.reverse();
    }
    );
  }
  //FORMATER LE PRIX
  formatPrice(price: number): string {
    return price?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  //METHODE PERMETTANT D'ENREGISTRER OU NON
  EnregistrerOuNon(id: number): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'swal2-confirm btn',
        cancelButton: 'swal2-cancel btn',
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
                confirmButtonColor: '#e98b11',
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
                })
              })
            },
            error: (err) => {
              swalWithBootstrapButtons.fire(
                'Token expiré',
                `<p style='font-size: 1em; font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;'>Erreur lors de l'enregistrement</p>`,
                'error'
              );
            }
          }
          );
        } else {
          swalWithBootstrapButtons.fire(
            'Token expiré',
            `<p style='font-size: 1em; font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;'>Votre session a expiré en raison d'un token périmé. Veuillez vous reconnecter pour continuer à utiliser notre application.</p>`,
            'error'
          );
        
        }
      }
    })
  }


  selectPaymentMode(mode: any) {
    // Enregistrez le mode de paiement sélectionné dans une variable ou envoyez-le directement à la méthode goToPaymentPage
    this.selectedPaymentMode = mode; // Vous pouvez stocker le mode sélectionné dans une variable
  }

  // Fonction pour ouvrir le modal avec l'ID du BienImmo
  openPaiementModal(candidatureId: number) {
    // Stockez l'ID du BienImmo sélectionné dans la variable
    this.selectedBienImmoId = candidatureId;

  }


  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE PAIMENT
  goToPagePaiement(uuid: number) {
    if (this.selectedPaymentMode) {
      switch (this.selectedPaymentMode.nom) {
        case "Orange Money":
          this.router.navigate(['/userpages/paiement-orangemoney', uuid]).then(() => {
            window.location.reload();
          });
          break;
        case "Visa":
          this.router.navigate(['/userpages/paiement-visa', uuid]).then(() => {
            window.location.reload();
          });
          break;
        case "GIM":
          this.router.navigate(['/userpages/paiement-gim', uuid]).then(() => {
            window.location.reload();
          });
          break;
        default:
          break;
      }
    } else {
    }
  }


  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE RECU
  goToPageRecu(id: number) {
    return this.router.navigate(['userpages/recufacture', id])
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE LISTE RECU
  goToListeRecu(id: number) {
    return this.router.navigate(['userpages/liste_recu', id])
  }

   //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE LISTE RECU
   goToContrat(id: any) {
    return this.router.navigate(['userpages/contrat', id])
  }

}
