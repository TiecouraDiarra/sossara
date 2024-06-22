import { Component, ElementRef, Inject, LOCALE_ID, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { ContratService } from 'src/app/service/contrat/contrat.service';
import { FactureService } from 'src/app/service/facture/facture.service';
import { ModepaiementService } from 'src/app/service/modepaiement/modepaiement.service';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import { ContentChange, SelectionChange } from 'ngx-quill';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-contrat',
  templateUrl: './contrat.component.html',
  styleUrls: ['./contrat.component.scss']
})
export class ContratComponent {

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
  contrat: any;
  // Déclarez une variable pour stocker l'ID du BienImmo sélectionné
  selectedFactureId: any;
  selectedPaymentMode: any;
  selectedBienImmoId: any;
  CandidatureUser: any;
  isAgenceProprietaire = false;
  // isProprietaire = false;
  // isAgence = false;
  roles: string[] = [];
  users: any;

  isProprietaire(roles: any[]): boolean {
    return roles?.some(role => role.name === 'PROPRIETAIRE');
  }

  isAgence(roles: any[]): boolean {
    return roles?.some(role => role.name === 'AGENCE');
  }
  errorMessage: any = '';
  loadingAnnulerProp = false;
  loadingAnnulerloc = false;
  isSuccess: any = false;
  isError: any = false;
  @ViewChild('contratlocation')
  contratlocation!: ElementRef;
  emailProprietaire: any

  loading = false;
  loadingAnnuler = false;
  loadingValiderLocataire = false;
  loadingValiderProprietaire = false;

  constructor(
    private paiementService: ModepaiementService,
    @Inject(LOCALE_ID) private localeId: string,
    private serviceUser: UserService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private serviceContrat: ContratService,
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

  formAnnulerProprie: any = {
    motifAnnulationProprietaire: null,
  };

  formAnnulerLocat: any = {
    motifAnnulationLocataire: null,
  };

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {


      // if (this.roles.includes("ROLE_PROPRIETAIRE")) {
      //   this.isProprietaire = true;
      // }

      // if (this.roles.includes("ROLE_AGENCE")) {
      //   this.isAgence = true;
      // }
    }


    //RECUPERER L'UUID D'UN CONTRAT 
    this.id = this.route.snapshot.params["uuid"]
    //AFFICHER UN PAIEMENT EN FONCTION DE SON ID
    this.serviceContrat.AfficherContratParUuId(this.id).subscribe(data => {
      this.contrat = data;

      this.bien = data?.bien;
      this.locataire = data?.locataire;
      this.proprietaire = data?.bien?.proprietaire;
      this.serviceUser.AfficherUserConnecter().subscribe(
        (data) => {
          this.users = data[0];
          this.emailProprietaire = this.users.email
          // this.emailProprietaire = this.storageService.getUser().email
          if (this.emailProprietaire == this.proprietaire.email) {
            this.isAgenceProprietaire = true;
          }
        })
      this.photoImmo = data?.bien?.photoImmos;

    })
  }
  //FORMATER LE PRIX
  formatPrice(price: number): string {
    return price?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
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


  //ANNULER LE CONTRAT LOCATAIRE
  AnnulerContratLocataire(id: any): void {
    if (!this.formAnnulerLocat.motifAnnulationLocataire) {
      Swal.fire({
        position: 'center',
        text: "Veuillez renseigner le motif d'annulation du contrat.",
        title: 'Erreur',
        icon: 'error',
        heightAuto: false,
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#e98b11',
        showDenyButton: false,
        showCancelButton: false,
        allowOutsideClick: false,
      });
      return; // Arrêter la fonction si le champ usage est null
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'swal2-confirm btn',
        cancelButton: 'swal2-cancel btn',
      },
      heightAuto: false
    })
    swalWithBootstrapButtons.fire({
      // title: 'Etes-vous sûre de vous déconnecter?',
      text: "Etes-vous sûre d'annuler le contrat ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingAnnulerloc = true;
        const user = this.storageService.getUser();
        if (user && user.token) {
          // Définissez le token dans le service serviceUser
          this.serviceUser.setAccessToken(user.token);
          // Appelez la méthode AnnulerContratLocataire() avec le contenu et l'ID
          this.serviceContrat.AnnulerContratLocataire(id, this.formAnnulerLocat.motifAnnulationLocataire).subscribe({
            next: (data) => {
              // this.loadingAnnuler = true; // Affiche l'indicateur de chargement
              // this.popUpAnnulation();
              if (data.status) {
                this.loadingAnnulerloc = false;
                let timerInterval = 2000;
                Swal.fire({
                  position: 'center',
                  text: data.message,
                  title: "Contrat annulée",
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
                  //RECUPERER L'UUID D'UN CONTRAT 
                  this.id = this.route.snapshot.params["uuid"]
                  //AFFICHER UN PAIEMENT EN FONCTION DE SON ID
                  this.serviceContrat.AfficherContratParUuId(this.id).subscribe(data => {
                    this.contrat = data;
                    this.bien = data?.bien;
                    this.locataire = data?.locataire;
                    this.proprietaire = data?.bien?.proprietaire;
                    this.photoImmo = data?.bien?.photoImmos;

                  })
                  this.loadingAnnuler = false; // Affiche l'indicateur de chargement
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
              this.loadingAnnulerloc = false;
            },
            error: (err) => {

            }
          }
          );
        } else {

        }
      }
    })
  }

  //ANNULER LE CONTRAT PROPRIETAIRE
  AnnulerContratProprietaire(id: any): void {
    if (!this.formAnnulerProprie.motifAnnulationProprietaire) {
      Swal.fire({
        position: 'center',
        text: "Veuillez renseigner le motif d'annulation du contrat.",
        title: 'Erreur',
        icon: 'error',
        heightAuto: false,
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#e98b11',
        showDenyButton: false,
        showCancelButton: false,
        allowOutsideClick: false,
      });
      return; // Arrêter la fonction si le champ usage est null
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'swal2-confirm btn',
        cancelButton: 'swal2-cancel btn',
      },
      heightAuto: false
    })
    swalWithBootstrapButtons.fire({
      // title: 'Etes-vous sûre de vous déconnecter?',
      text: "Etes-vous sûre d'annuler le contrat ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingAnnulerProp = true; // Affiche l'indicateur de chargement
        const user = this.storageService.getUser();
        if (user && user.token) {
          // Définissez le token dans le service serviceUser
          this.serviceUser.setAccessToken(user.token);
          // Appelez la méthode AnnulerContratLocataire() avec le contenu et l'ID
          this.serviceContrat.AnnulerContratProprietaire(id, this.formAnnulerProprie.motifAnnulationProprietaire).subscribe({
            next: (data) => {
              // this.popUpAnnulation();
              if (data.status) {
                this.loadingAnnulerProp = false; // Affiche l'indicateur de chargement
                let timerInterval = 2000;
                Swal.fire({
                  position: 'center',
                  text: data.message,
                  title: "Contrat annulée",
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
                  //RECUPERER L'UUID D'UN CONTRAT 
                  this.id = this.route.snapshot.params["uuid"]
                  //AFFICHER UN PAIEMENT EN FONCTION DE SON ID
                  this.serviceContrat.AfficherContratParUuId(this.id).subscribe(data => {
                    this.contrat = data;
                    this.bien = data?.bien;
                    this.locataire = data?.locataire;
                    this.proprietaire = data?.bien?.proprietaire;
                    this.photoImmo = data?.bien?.photoImmos;

                  })
                  this.loadingAnnuler = false; // Affiche l'indicateur de chargement
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
              this.loadingAnnulerProp = false; // Affiche l'indicateur de chargement
            },
            error: (err) => {

            }
          }
          );
        } else {

        }
      }
    })
  }

  //POPUP APRES ANNULATION DU CONTRAT
  popUpAnnulation() {
    let timerInterval = 2000;
    Swal.fire({
      position: 'center',
      text: 'Le contrat a été annulé avec succès.',
      title: 'Contrat annulée',
      icon: 'error',
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
      //RECUPERER L'UUID D'UN CONTRAT 
      this.id = this.route.snapshot.params["uuid"]
      //AFFICHER UN PAIEMENT EN FONCTION DE SON ID
      this.serviceContrat.AfficherContratParUuId(this.id).subscribe(data => {
        this.contrat = data;
        this.bien = data?.bien;
        this.locataire = data?.locataire;
        this.proprietaire = data?.bien?.proprietaire;
        this.photoImmo = data?.bien?.photoImmos;

      })
      this.loadingAnnuler = false; // Affiche l'indicateur de chargement
      window.location.reload();
    })

  }


  //ACCEPTER LA CANDIDATURE D'UN BIEN PROPRIETAIRE C'EST A DIRE VALIDE
  ValiderContratProprietaire(): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'swal2-confirm btn',
        cancelButton: 'swal2-cancel btn',
      },
      heightAuto: false
    })
    swalWithBootstrapButtons.fire({
      // title: 'Etes-vous sûre de vous déconnecter?',
      text: "Etes-vous sûre de valider le contrat ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingValiderProprietaire = true;
        const user = this.storageService.getUser();
        if (user && user.token) {
          // Définissez le token dans le service serviceUser
          this.serviceUser.setAccessToken(user.token);
          // Appelez la méthode ACCEPTERCANDIDATUREBIEN() avec le contenu et l'ID
          this.serviceContrat.AccepterCandidaterBien(sessionStorage.getItem("idCandidature")).subscribe({
            next: (data) => {
              this.isSuccess = true;
              this.errorMessage = 'Candidature acceptée avec succès';

              // Afficher le premier popup de succès
              this.popUpConfirmation();
              this.loadingValiderProprietaire = false;
            },
            error: (err) => {

              this.errorMessage = err.error.message;
              this.isError = true
              // Gérez les erreurs ici
            }
          }
          );
        } else {

        }
      }
    })
  }

  //POPUP APRES CONFIRMATION DE CANDIDATURE PROPRIETAIRE
  popUpConfirmation() {
    let timerInterval = 2000;
    Swal.fire({
      position: 'center',
      text: 'Le contrat a été validé avec succès.',
      title: 'Contrat validé',
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
      //RECUPERER L'UUID D'UN CONTRAT 
      this.id = this.route.snapshot.params["uuid"]
      //AFFICHER UN PAIEMENT EN FONCTION DE SON ID
      this.serviceContrat.AfficherContratParUuId(this.id).subscribe(data => {
        this.contrat = data;
        this.bien = data?.bien;
        this.locataire = data?.locataire;
        this.proprietaire = data?.bien?.proprietaire;
        this.photoImmo = data?.bien?.photoImmos;
        // if (this.proprietaire.role.includes("ROLE_PROPRIETAIRE")) {
        //   this.isProprietaire = true;
        // }

        // if (this.proprietaire.role.includes("ROLE_AGENCE")) {
        //   this.isAgence = true;
        // }
      })

      this.loadingValiderProprietaire = false;
    })

  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS Facture
  goToDettailFacture(id: number) {
    return this.router.navigate(['userpages/facturepaiement', id]);
  }

  //POPUP APRES CONFIRMATION DE CANDIDATURE LOCATAIRE
  popUpConfirmationLocataire() {
    // let timerInterval = 2000;
    Swal.fire({
      position: 'center',
      text: 'Le contrat a été validé avec succès.',
      title: 'Contrat validé',
      icon: 'success',
      heightAuto: false,
      showConfirmButton: true,
      confirmButtonText: "OK",
      confirmButtonColor: '#e98b11',
      showDenyButton: false,
      showCancelButton: false,
      allowOutsideClick: false,
      // timer: timerInterval, // ajouter le temps d'attente
      // timerProgressBar: true // ajouter la barre de progression du temps

    }).then((result) => {
      if (result.isConfirmed) {
        //RECUPERER L'UUID D'UN CONTRAT 
        this.id = this.route.snapshot.params["uuid"]
        //AFFICHER UN PAIEMENT EN FONCTION DE SON ID
        this.serviceContrat.AfficherContratParUuId(this.id).subscribe(data => {
          this.contrat = data;
          this.bien = data?.bien;
          this.locataire = data?.locataire;
          this.proprietaire = data?.bien?.proprietaire;
          this.photoImmo = data?.bien?.photoImmos;
          this.goToDettailFacture(this.bien?.contrat[0]?.facture[0]?.uuid)
        })

        this.loadingValiderLocataire = false;
      }
    })

  }

  //VALIDER UN CONTRAT LOCATAIRE C'EST A DIRE VALIDE
  ValiderContratLocataire(id: number): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'swal2-confirm btn',
        cancelButton: 'swal2-cancel btn',
      },
      heightAuto: false
    })
    swalWithBootstrapButtons.fire({
      // title: 'Etes-vous sûre de vous déconnecter?',
      text: "Etes-vous sûre de valider le contrat ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingValiderLocataire = true;
        const user = this.storageService.getUser();
        if (user && user.token) {
          // Définissez le token dans le service serviceUser
          this.serviceUser.setAccessToken(user.token);
          // Appelez la méthode ACCEPTERCANDIDATUREBIEN() avec le contenu et l'ID
          this.serviceContrat.ValiderContratBien(id).subscribe({
            next: (data) => {
              this.isSuccess = true;
              this.errorMessage = 'Contrat acceptée avec succès';


              // Afficher le premier popup de succès
              this.popUpConfirmationLocataire();
              this.loadingValiderLocataire = false;
            },
            error: (err) => {

              this.errorMessage = err.error.message;
              this.isError = true
              // Gérez les erreurs ici
            }
          }
          );
        } else {

        }
      }
    })
  }

  // Supposons que vous avez une image par défaut dans votre projet
  defaultImageUrl: string = 'assets/img/typebien/villa.png';
  setDefaultImage(event: any): void {
    // Si le chargement de l'image échoue, utilisez l'image par défaut
    event.target.src = this.defaultImageUrl;
  }

  //GENERER CONTRAT LOCATAION
  async genererPDFContrat() {
    try {
      this.loading = true; // Affiche l'indicateur de chargement

      // Créer une instance de jsPDF
      const pdf = new jsPDF();

      // Générer la première page du contrat
      await this.generateFirstPage(pdf);

      // Générer la deuxième page du contrat
      await this.generateSecondPage(pdf);

      // Télécharger le PDF
      pdf.save('contrat.pdf');

      // Une fois la génération terminée, masquer l'indicateur de chargement
      this.loading = false;
    } catch (error) {

      this.loading = false; // Assurez-vous de masquer l'indicateur de chargement en cas d'erreur
    }
  }

  async genererPDFContratVente() {
    try {
      this.loading = true; // Affiche l'indicateur de chargement

      // Créer une instance de jsPDF
      const pdf = new jsPDF();

      // Générer la première page du contrat
      await this.generateFirstPage(pdf);

      // Télécharger le PDF
      pdf.save('contrat.pdf');

      // Une fois la génération terminée, masquer l'indicateur de chargement
      this.loading = false;
    } catch (error) {

      this.loading = false; // Assurez-vous de masquer l'indicateur de chargement en cas d'erreur
    }
  }

  async generateFirstPage(pdf: jsPDF) {
    return new Promise<void>((resolve, reject) => {
      // Obtenir le contenu HTML de la première partie du contrat
      const firstPageContent = document.querySelector('.contratlocation .row:nth-child(1)') as HTMLElement;

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

  async generateSecondPage(pdf: jsPDF) {
    return new Promise<void>((resolve, reject) => {
      // Obtenir le contenu HTML de la deuxième partie du contrat
      const secondPageContent = document.querySelector('.contratlocation .row:nth-child(2)') as HTMLElement;

      if (secondPageContent) {
        // Convertir le contenu HTML en une image (utilisation de html2canvas)
        html2canvas(secondPageContent).then((canvas) => {
          const imgWidth = 210; // Largeur de l'image (en mm)
          const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculer la hauteur en préservant le ratio

          // Ajouter une nouvelle page avant d'ajouter l'image de la deuxième page
          pdf.addPage();

          // Ajouter l'image convertie au PDF (deuxième page)
          const imgData = canvas.toDataURL('image/png');
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

          // Résoudre la promesse une fois la deuxième page générée
          resolve();
        }).catch(reject);
      } else {
        reject(new Error('Le contenu de la deuxième page est introuvable.'));
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
