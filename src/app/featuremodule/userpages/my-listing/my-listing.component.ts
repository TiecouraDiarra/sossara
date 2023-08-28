import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { AuthService } from 'src/app/service/auth/auth.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { DataService } from 'src/app/service/data.service';
import Swal from 'sweetalert2';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
// import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


const URL_PHOTO: string = environment.Url_PHOTO;


@Component({
  selector: 'app-my-listing',
  templateUrl: './my-listing.component.html',
  styleUrls: ['./my-listing.component.css']
})
export class MyListingComponent implements OnInit {
  // Référence au modal que vous souhaitez convertir en PDF
  @ViewChild('facturelocation')
  facturelocation!: ElementRef;

  loading = false;

  @ViewChild('factureachat')
  factureachat!: ElementRef;

  //GENERER FACTURE DU MOIS (LOCATION)
  genererPDFLocation() {
    this.loading = true; // Affiche l'indicateur de chargement
    // Obtenir le contenu du modal sous forme d'élément HTML
    const modalElement = this.facturelocation.nativeElement;

    // Créer une instance de jsPDF
    const pdf = new jsPDF();

    //Convertir le contenu HTML du modal en une image (utilisation de html2canvas)
    html2canvas(modalElement).then((canvas) => {
      // Obtenir les dimensions de l'image
      const imgWidth = 210; // Largeur de l'image (en mm)
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculer la hauteur en préservant le ratio

      // Ajouter l'image convertie au PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight); // Ajouter l'image avec les dimensions calculées

      // Télécharger le PDF
      pdf.save('facture.pdf');
      // Une fois la génération terminée, masquez l'indicateur de chargement
      this.loading = false;
    });
  }

  //GENERER FACTURE ACHAT
  genererPDFAchat() {
    this.loading = true; // Affiche l'indicateur de chargement
    // Obtenir le contenu du modal sous forme d'élément HTML
    const modalElement = this.factureachat.nativeElement;

    // Créer une instance de jsPDF
    const pdf = new jsPDF();

    //Convertir le contenu HTML du modal en une image (utilisation de html2canvas)
    html2canvas(modalElement).then((canvas) => {
      // Obtenir les dimensions de l'image
      const imgWidth = 210; // Largeur de l'image (en mm)
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculer la hauteur en préservant le ratio

      // Ajouter l'image convertie au PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight); // Ajouter l'image avec les dimensions calculées

      // Télécharger le PDF
      pdf.save('facture.pdf');
      // Une fois la génération terminée, masquez l'indicateur de chargement
      this.loading = false;
    });
  }

  public routes = routes;
  User: any;
  searchText: any;
  searchTextBienLoue: any;
  searchTextBienVendu: any;
  bienImmo: any;
  probleme: any;
  bienImmoDejaLoue: any;
  bienImmoDejaVendu: any;
  reclamation: any;
  p1: number = 1;
  p2: number = 1;
  p3: number = 1;
  p4: number = 1;
  p5: number = 1;
  p6: number = 1;
  p7: number = 1;
  p8: number = 1;
  public albumsOne: any = [];
  isLocataire = false;
  roles: string[] = [];
  bienImmoDejaLoueLocataire: any
  valuesSelect: any = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];




  public electronics: any = []

  selectedTab: string = 'home'; // Onglet sélectionné par défaut
  today: Date;

  // Méthode pour changer l'onglet sélectionné
  changeTab(tab: string) {
    this.selectedTab = tab;
  }

  // Méthode pour vérifier si un onglet est actif
  isTabActive(tab: string): boolean {
    return this.selectedTab === tab;
  }
  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO + '/uploads/images/';
    return baseUrl + photoFileName;
  }
  reclamationUser: any
  transactionVendue: any
  photos: any;
  maxImageCount: number = 0; // Limite maximale d'images
  selectedFiles: any;
  image: File[] = [];
  images: File[] = [];
  isButtonDisabled: boolean = false; // Variable pour désactiver le bouton si la limite est atteinte
  // @ViewChild('exampleModal') modal: any; // Ajoutez cette ligne pour obtenir une référence au modal
  form: any = {
    contenu: null,
    type: null,
    photos: null,
  };

  formProcessus: any = {
    somme: null,
  };

  factureNumber: number = 1; // Numéro de facture initial




  // IMAGE PAR DEFAUT DES BIENS
  DEFAULT_IMAGE_URL = 'assets/img/gallery/gallery1/gallery-1.jpg';

  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }
  // Déclarez une variable pour stocker l'ID du BienImmo sélectionné
  selectedBienImmoId: any;
  selectedBienImmoProcessusId: any;
  // Déclarez une variable pour stocker l'ID du BienImmo sélectionné
  selectedBienImmoVenduId: any;

  selectedFactureId: any;
  reclamationProcessusLance: any;
  transaction: any
  bienImmoUserAAcheter: any


  // Fonction pour ouvrir le modal avec l'ID du BienImmo
  openReclamationModal(bienImmoId: number) {
    // Stockez l'ID du BienImmo sélectionné dans la variable
    this.selectedBienImmoId = bienImmoId;
    console.log(this.selectedBienImmoId);

  }

  // Fonction pour ouvrir le modal avec l'ID du BienImmo
  openProcessusModal(bienImmoId: number) {
    // Stockez l'ID du BienImmo sélectionné dans la variable
    this.selectedBienImmoProcessusId = bienImmoId;
    console.log(this.selectedBienImmoProcessusId);

  }

  // Fonction pour ouvrir le modal avec l'ID de la vente
  openFactureModalVente(bienImmoVenteId: number) {
    // Stockez l'ID du BienImmo sélectionné dans la variable
    this.selectedBienImmoVenduId = bienImmoVenteId;
    console.log(this.selectedBienImmoVenduId);
    // Générer un numéro aléatoire entre 1 et 1000 (vous pouvez ajuster la plage selon vos besoins)
    // this.factureNumber = Math.floor(Math.random() * 1000) + 1;
    // Incrémentez le numéro de facture à chaque fois que cette fonction est appelée
    this.factureNumber++;
    //AFFICHER LA LISTE DES BIENS PAR UTILISATEUR
    this.serviceBienImmo.AfficherTransactionParId(this.selectedBienImmoVenduId).subscribe(data => {
      this.transactionVendue = data.biens[0];
      console.log(this.transactionVendue);
    });

  }

  // Fonction pour ouvrir le modal avec l'ID de la transaction
  openFactureModalLouer(bienImmoId: number) {
    // Stockez l'ID du BienImmo sélectionné dans la variable
    this.selectedFactureId = bienImmoId;
    console.log(this.selectedFactureId);
    // Générer un numéro aléatoire entre 1 et 1000 (vous pouvez ajuster la plage selon vos besoins)
    // this.factureNumber = Math.floor(Math.random() * 1000) + 1;
    // Incrémentez le numéro de facture à chaque fois que cette fonction est appelée
    this.factureNumber++;
    //AFFICHER LA LISTE DES BIENS PAR UTILISATEUR
    this.serviceBienImmo.AfficherCandidatureAccepter(this.selectedFactureId).subscribe(data => {
      this.transaction = data.biens[0];
      console.log(this.transaction);
    });

  }


  constructor(
    private DataService: DataService,
    private storageService: StorageService,
    public router: Router,
    private serviceBienImmo: BienimmoService,
    private serviceUser: UserService,
    @Inject(LOCALE_ID) public locale: string,
    private renderer: Renderer2,
    private authService: AuthService,
  ) {
    this.electronics = this.DataService.electronicsList,
      this.User = this.storageService.getUser();
    console.log(this.User);
    this.today = new Date();
    // egisterLocaleData(localeFr); // Enregistrez la locale française
  }

  //CHARGER L'IMAGE
  onFileSelected(event: any): void {
    this.selectedFiles = event.target.files;
    const reader = new FileReader();

    for (const file of this.selectedFiles) {
      if (this.images.length < 8) {
        reader.onload = (e: any) => {
          this.images.push(file);
          this.image.push(e.target.result);
          this.checkImageCount(); // Appel de la fonction pour vérifier la limite d'images
          console.log(this.image);
          this.maxImageCount = this.image.length
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

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      // this.isLoggedIn = true;
      this.roles = this.storageService.getUser().user.role;
      console.log(this.roles);
      if (this.roles[0] == "ROLE_LOCATAIRE") {
        this.isLocataire = true
      }
    }
    this.User = this.storageService.getUser().user.id;
    console.log(this.User);

    //AFFICHER LA LISTE DES BIENS PAR UTILISATEUR
    this.serviceBienImmo.AfficherBienImmoParUser().subscribe(data => {
      this.bienImmo = data.biens.reverse();
      console.log(this.bienImmo);
    });

    //AFFICHER LA LISTE DES PROBLEMES
    this.serviceBienImmo.AfficherLIsteProbleme().subscribe(data => {
      this.probleme = data.type_problemes;
      console.log(this.probleme);
    });

    //AFFICHER LA LISTE DES RECLAMATIONS DONT LES PROCESSUS SONT LANCES
    this.serviceBienImmo.AfficherLIsteReclamationProcessusLance().subscribe(data => {
      this.reclamationProcessusLance = data.reparations.reverse();
      console.log(this.reclamationProcessusLance);
    });

    //AFFICHER LA LISTE DES BIENS QUI SONT LOUES EN FONCTION DE L'UTILISATEUR
    this.serviceBienImmo.AfficherBienImmoDejaLoueParUser().subscribe(data => {
      this.bienImmoDejaLoue = data.biens.reverse();
      console.log(this.bienImmoDejaLoue);
    });

    //AFFICHER LA LISTE DES BIENS QUE L'UTILISATEUR CONNECTE A LOUER
    this.serviceBienImmo.AfficherBienImmoDejaLoueParLocataire().subscribe(data => {
      this.bienImmoDejaLoueLocataire = data.biens.reverse();
      console.log(this.bienImmoDejaLoueLocataire);
    });

    //AFFICHER LA LISTE DES BIENS QUE L'UTILISATEUR CONNECTE A ACHETER
    this.serviceBienImmo.AfficherBienImmoUserAcheter().subscribe(data => {
      this.bienImmoUserAAcheter = data.biens.reverse();
      console.log(this.bienImmoUserAAcheter);
    });


    //AFFICHER LA LISTE DES RECLAMATIONS EN FONCTION DES BIENS DE L'UTILISATEUR
    this.serviceBienImmo.AfficherListeReclamationParUser().subscribe(data => {
      this.reclamation = data.attributes.reverse();
      // this.photos = this.reclamation.bien;
      console.log(this.reclamation);
      // console.log(this.photos);
    });

    //AFFICHER LA LISTE DES RECLAMATIONS FAITES PAR UTILISATEUR
    this.serviceBienImmo.AfficherListeReclamationFaitesParUser().subscribe(data => {
      this.reclamationUser = data.mes_reclamations.reverse();
      // this.photos = this.reclamation.bien;
      console.log(this.reclamationUser);
      // console.log(this.photos);
    });

    //AFFICHER LA LISTE DES BIENS QUI SONT VENDUS EN FONCTION DE L'UTILISATEUR
    this.serviceBienImmo.AfficherBienImmoDejaVenduParUser().subscribe(data => {
      this.bienImmoDejaVendu = data.biens.reverse();
      console.log(this.bienImmoDejaVendu);
    });

  }

  removeImage(index: number) {
    this.image.splice(index, 1); // Supprime l'image du tableau
    this.images.splice(index, 1); // Supprime le fichier du tableau 'images'
    this.checkImageCount(); // Appelle la fonction pour vérifier la limite d'images après la suppression
  }

  sortData(sort: Sort) {
    const data = this.electronics.slice();

    if (!sort.active || sort.direction === '') {
      this.electronics = data;
    } else {
      this.electronics = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS BIEN
  goToDettailBien(id: number) {
    console.log(id);
    return this.router.navigate(['pages/service-details', id])
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
  //FORMATER LE PRIX
  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  //FAIRE RECLAMATION
  FaireReclamation(): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })

    swalWithBootstrapButtons.fire({
      text: "Etes-vous sûre de bien vouloir faire une reclamation ?",
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



          // Appelez la méthode Fairecommentaire() avec le contenu et l'ID
          this.serviceBienImmo.FaireReclamation(this.form.contenu, this.form.type, this.selectedBienImmoId, this.form.photo).subscribe(
            data => {
              console.log("Reclamation envoyée avec succès:", data);
              // this.isSuccess = false;
              this.popUpConfirmation();
            },
            error => {
              console.error("Erreur lors de l'envoi de la reclamation :", error);
              // Gérez les erreurs ici
            }
          );
        } else {
          console.error("Token JWT manquant");
        }
      }
    })

    //Faire un commentaire
    //  this.servicecommentaire.Fairecommentaire(this.commentaireForm.contenu, this.id).subscribe(data=>{
    //   console.log(data);
    // });
  }

  //POPUP APRES CONFIRMATION
  popUpConfirmation() {
    let timerInterval = 2000;
    Swal.fire({
      position: 'center',
      text: 'Reclamation envoyée avec succès.',
      title: 'Envoie de réclamation',
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
      // Fermez le modal après avoir envoyé la réclamation
      // Fermez le modal sans utiliser jQuery
      // const modalElement = document.getElementById('exampleModal');
      // const modalContentElement = document.getElementById('modalContent');
      // if (modalElement && modalContentElement) {
      //   modalContentElement.style.display = 'none'; // Cacher le contenu du modal
      //   modalElement.classList.remove('show');
      //   modalElement.style.display = 'none';
      // }
      // Après avoir envoyé les données, réinitialisez les champs du formulaire.
      // this.selectedBienImmoId = null; // Réinitialisez la valeur de selectedBienImmoId
      this.form.type = null; // Réinitialisez la valeur de form.type
      this.form.contenu = ''; // Réinitialisez la valeur de form.contenu
      this.image = []; // Réinitialisez le tableau d'images
    })
  }

  //LANCER LE PROCESSUS DE REPARATION
  LancerProcessusReparation(): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })

    swalWithBootstrapButtons.fire({
      text: "Etes-vous sûre de bien vouloir lancer le processus de reclamation ?",
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



          // Appelez la méthode Fairecommentaire() avec le contenu et l'ID
          this.serviceBienImmo.LancerProcessusReparation(this.formProcessus.somme, this.selectedBienImmoProcessusId).subscribe(
            data => {
              console.log("Processus lancé avec succès:", data);
              // this.isSuccess = false;
              this.popUpConfirmationProcessus();
            },
            error => {
              console.error("Erreur lors du lamcement du processus :", error);
              // Gérez les erreurs ici
            }
          );
        } else {
          console.error("Token JWT manquant");
        }
      }
    })

    //Faire un commentaire
    //  this.servicecommentaire.Fairecommentaire(this.commentaireForm.contenu, this.id).subscribe(data=>{
    //   console.log(data);
    // });
  }

  //POPUP APRES CONFIRMATION PROCESSUS
  popUpConfirmationProcessus() {
    let timerInterval = 2000;
    Swal.fire({
      position: 'center',
      text: 'Processus lancé avec succès.',
      title: 'Processus lancé ',
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
      this.formProcessus.somme = ''; // Réinitialisez la valeur de form.contenu
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
      this.reclamationProcessusLance = data.reparations.reverse();
      console.log(this.reclamationProcessusLance);
    });
    })
  }

  //METHODE PERMETTANT D'ARRETER LE PROCESSUS DE REPARATION
  ArreterProcessus(id: any): void {
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



          // Appelez la méthode ArreterProcessus() avec le contenu et l'ID
          this.serviceBienImmo.ArreterProcessus(id).subscribe(
            data => {
              console.log("Processus arreté avec succès:", data);
              // this.isSuccess = false;
              this.popUpConfirmationArreteProcessus();
            },
            error => {
              console.error("Erreur lors de l'arret du processus :", error);
              // Gérez les erreurs ici
            }
          );
        } else {
          console.error("Token JWT manquant");
        }
      }
    })
  }
}
