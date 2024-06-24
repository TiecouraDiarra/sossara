import { Component, HostListener, Inject, LOCALE_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { ModepaiementService } from 'src/app/service/modepaiement/modepaiement.service';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';

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
  loading = false;
  modePaiement: any;

  isMobile= false;
  facture: any;
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
  // Supposons que vous avez une image par défaut dans votre projet
  defaultImageUrl: string = 'assets/img/typebien/villa.png';
  setDefaultImage(event: any): void {
    // Si le chargement de l'image échoue, utilisez l'image par défaut
    event.target.src = this.defaultImageUrl;
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
      
      // this.facture = data?.facture;
      this.modePaiement = data?.modePaiement;
      this.bien = data?.transaction?.bien;
      this.locataire = data?.utilisateur;
      this.proprietaire = data?.transaction?.bien?.proprietaire;
      this.transaction = data?.transaction;
      this.photoImmo = data?.transaction?.bien?.photoImmos;
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

  async genererPDFRecu() {
    try {
      this.loading = true; // Affiche l'indicateur de chargement

      // Créer une instance de jsPDF
      const pdf = new jsPDF();

      // Générer la première page du contrat
      await this.generateFirstPage(pdf);

      // Télécharger le PDF
      pdf.save('recu.pdf');

      // Une fois la génération terminée, masquer l'indicateur de chargement
      this.loading = false;
    } catch (error) {
     
      this.loading = false; // Assurez-vous de masquer l'indicateur de chargement en cas d'erreur
    }
  }

  async generateFirstPage(pdf: jsPDF) {
    return new Promise<void>((resolve, reject) => {
      // Obtenir le contenu HTML de la première partie du contrat
      const firstPageContent = document.querySelector('.recu') as HTMLElement;

      if (firstPageContent) {
        // Convertir le contenu HTML en une image (utilisation de html2canvas)
        html2canvas(firstPageContent).then((canvas) => {
          const imgWidth = 210; // Largeur de l'image (en mm)
          const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculer la hauteur en préservant le ratio

          // Ajouter l'image convertie au PDF (première page)
          const imgData = canvas.toDataURL('image/png');
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

          // Résoudre la promesse une fois la première page générée
          resolve();
        }).catch(reject);
      } else {
        reject(new Error('Le contenu de la première page est introuvable.'));
      }
    });
  }

}

