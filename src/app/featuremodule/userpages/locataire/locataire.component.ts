import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  LOCALE_ID,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
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
import { FactureService } from 'src/app/service/facture/facture.service';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-locataire',
  templateUrl: './locataire.component.html',
  styleUrls: ['./locataire.component.scss'],
})
export class LocataireComponent implements OnInit {
  // Référence au modal que vous souhaitez convertir en PDF
  @ViewChild('facturelocation')
  facturelocation!: ElementRef;

  loading = false;
  bonAccord = false;
  prendEnCharge = false;
  locale!: string;
  selectedTab: string = 'home'; // Déclaration de la variable selectedTab avec la valeur par défaut 'home'

  @ViewChild('factureachat')
  factureachat!: ElementRef;
  bienImmoDejaLoueLocataires: any;
  facture: any;
  bienFacture: any;
  favoris: any;
  bienImmoFavoris: any[] = [];
  profil: any;

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
  searchFacture: any;
  searchFavoris: any;
  searchTextBienLoue: any;
  searchTextBienVendu: any;
  bienImmo: any;
  probleme: any;
  // bienImmoDejaLoue: any;
  bienImmoDejaLoue: any[] = [];
  bienImmoDejaVendu: any[] = [];
  bienImmoDejaLoueAgence: any;
  // bienImmoDejaVendu: any;
  reclamation: any;
  p1: number = 1;
  p2: number = 1;
  p3: number = 1;
  p4: number = 1;
  p5: number = 1;
  p6: number = 1;
  p7: number = 1;
  p8: number = 1;
  pfacture: number = 1;
  public albumsOne: any = [];
  isLocataire = false;
  isAgence = false;
  isAgent = false;
  roles: string[] = [];
  bienImmoDejaLoueLocataire: any[] = [];
  valuesSelect: any = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  public electronics: any = [];

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
    const baseUrl = URL_PHOTO;
    return baseUrl + photoFileName;
  }
  reclamationUser: any;
  transactionVendue: any;
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
    prix_estimatif: null,
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
    event.target.src =
      'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }
  // Déclarez une variable pour stocker l'ID du BienImmo sélectionné
  selectedBienImmoId: any;
  selectedBienImmoProcessusId: any;
  // Déclarez une variable pour stocker l'ID du BienImmo sélectionné
  selectedBienImmoVenduId: any;

  selectedFactureId: any;
  reclamationProcessusLance: any;
  transaction: any;
  favoritedPropertiesCount1: { [bienId: number]: number } = {};
  favoritedPropertiesCountAgence: { [bienId: number]: number } = {};
  bienImmoUserAAcheter: any[] = [];
  bienImmoAgenceTotal: any;

  bienagent: any;
  bienVenduagent: any;
  bienTotalAgence: any[] = [];
  bienVenduTotalAgence: any[] = [];
  bienImmoDejaVenduAgence: any;
  selectedCategory: any = '';

  // Fonction pour ouvrir le modal avec l'ID du BienImmo
  openReclamationModal(bienImmoId: any) {
    // Stockez l'ID du BienImmo sélectionné dans la variable
    this.selectedBienImmoId = bienImmoId;
  }

  // Fonction pour ouvrir le modal avec l'ID du BienImmo
  openArreterModal(bienImmoId: any) {
    // Stockez l'ID du BienImmo sélectionné dans la variable
    this.selectedBienImmoId = bienImmoId;
  }

  formFiche: any = {
    photo: null,
  };

  // Fonction pour ouvrir le modal avec l'ID du BienImmo
  openProcessusModal(bienImmoId: any) {
    // Stockez l'ID du BienImmo sélectionné dans la variable
    this.selectedBienImmoProcessusId = bienImmoId;
  }

  // Fonction pour ouvrir le modal avec l'ID de la vente
  openFactureModalVente(bienImmoVenteId: number) {
    // Stockez l'ID du BienImmo sélectionné dans la variable
    this.selectedBienImmoVenduId = bienImmoVenteId;
    // Générer un numéro aléatoire entre 1 et 1000 (vous pouvez ajuster la plage selon vos besoins)
    // this.factureNumber = Math.floor(Math.random() * 1000) + 1;
    // Incrémentez le numéro de facture à chaque fois que cette fonction est appelée
    this.factureNumber++;
    //AFFICHER LA LISTE DES BIENS PAR UTILISATEUR
    this.serviceBienImmo
      .AfficherTransactionParId(this.selectedBienImmoVenduId)
      .subscribe((data) => {
        this.transactionVendue = data.biens[0];
      });
  }

  // Fonction pour ouvrir le modal avec l'ID de la transaction
  openFactureModalLouer(bienImmoId: number) {
    // Stockez l'ID du BienImmo sélectionné dans la variable
    this.selectedFactureId = bienImmoId;
    // Générer un numéro aléatoire entre 1 et 1000 (vous pouvez ajuster la plage selon vos besoins)
    // this.factureNumber = Math.floor(Math.random() * 1000) + 1;
    // Incrémentez le numéro de facture à chaque fois que cette fonction est appelée
    this.factureNumber++;
    //AFFICHER LA LISTE DES BIENS PAR UTILISATEUR
    this.serviceBienImmo
      .AfficherCandidatureAccepter(this.selectedFactureId)
      .subscribe((data) => {
        this.transaction = data.biens[0];
      });
  }
  NombreJaime: number = 0;
  NombreJaimeAgence: number = 0;
  bienImmoAgence: any;
  bienImmoAgent: any;
  test: any;
  errorMessage: any = '';
  isLoggedIn = false;
  isLoginFailed = true;
  favoriteStatus: { [key: string]: boolean } = {};

  constructor(
    private DataService: DataService,
    private storageService: StorageService,
    public router: Router,
    private serviceBienImmo: BienimmoService,
    private servicefacture: FactureService,
    private serviceUser: UserService,
    @Inject(LOCALE_ID) private localeId: string,
    private renderer: Renderer2,
    private authService: AuthService
  ) {
    this.locale = localeId;
    (this.electronics = this.DataService.electronicsList),
      (this.User = this.storageService.getUser());
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
          this.maxImageCount = this.image.length;
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
  bienImmoDejaLoueNew: any[] = [];
  bienImmoDejaVenduNew: any[] = [];

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      // this.isLoggedIn = true;
      this.serviceUser.AfficherUserConnecter().subscribe((data) => {
        this.profil = data[0]?.profil;
        if (this.profil == 'LOCATAIRE') {
          this.isLocataire = true;
          this.selectedTab = 'home';
        } else if (this.profil == 'AGENCE') {
          this.isAgence = true;
          this.selectedTab = 'homeagence'; // Sélectionnez l'onglet correspondant à ROLE_AGENCE
        } else if (this.profil == 'AGENT') {
          this.isAgent = true
          this.selectedTab = 'home'; // Sélectionnez l'onglet correspondant à ROLE_AGENCE
        } else {
          this.selectedTab = 'home';
        }
      })
      // if (this.roles.includes('ROLE_LOCATAIRE')) {
      //   this.isLocataire = true;
      //   this.selectedTab = 'home';
      // } else if (this.roles.includes('ROLE_AGENCE')) {
      //   this.isAgence = true;
      //   this.selectedTab = 'homeagence'; // Sélectionnez l'onglet correspondant à ROLE_AGENCE
      // } else if (this.roles.includes('ROLE_AGENT')) {
      //   this.isAgent = true;
      //   this.selectedTab = 'home'; // Sélectionnez l'onglet correspondant à ROLE_AGENCE
      // } else {
      //   this.selectedTab = 'home';
      // }
    }

    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
    } else if (!this.storageService.isLoggedIn()) {
      this.isLoginFailed = false;
    }
    this.User = this.storageService.getUser().id;

    //AFFICHER LA LISTE DES BIENS PAR UTILISATEUR
    //FAIT
    this.serviceBienImmo.AfficherBienImmoParUser().subscribe((data) => {
      this.bienImmo = data.reverse();

      // Filtrer les biens immobiliers
      this.bienImmo.forEach((bien: any) => {
        // Vérifier si le bien est déjà loué
        if (bien.is_rent === true) {
          this.bienImmoDejaLoue.push(bien);
        }

        //   // Vérifier si le bien est déjà vendu
        if (bien.is_sell === true) {
          this.bienImmoDejaVendu.push(bien);
        }

        //   // Le reste de votre logique pour traiter les favoris...
      });

      // Parcourir la liste des biens immobiliers
      this.bienImmo.forEach((bien: {
        uuid: any; favoris: any 
}) => {
        this.NombreJaime = bien.favoris?.length;
        // if (typeof bien.uuid === 'number') {
          this.favoritedPropertiesCount1[bien.uuid] = this.NombreJaime;
        // }
        // Charger l'état de favori depuis localStorage
        const isFavorite = localStorage.getItem(`favoriteStatus_${bien.uuid}`);
      });
    });

    //AFFICHER LA LISTE DES BIENS EN FONCTION DE L'UTILISATEUR CONNECTEE
    this.serviceBienImmo.AfficherBienImmoParUserConnecte().subscribe((data) => {
      this.test = data;
      this.bienImmoAgenceTotal = data.reverse();

      // Filtrer les biens immobiliers
      this.bienImmoAgenceTotal.forEach((bien: any) => {
        // Vérifier si le bien est déjà loué AGENCE
        if (bien.is_rent === true) {
          this.bienTotalAgence.push(bien);
        }

        //   // Vérifier si le bien est déjà vendu AGENCE
        if (bien.is_sell === true) {
          this.bienVenduTotalAgence.push(bien);
        }

        //   // Le reste de votre logique pour traiter les favoris...
      });
      // Parcourir la liste des biens immobiliers
      this.bienImmoAgenceTotal.forEach(
        (bien: { favoris: any; uuid: any }) => {
          // this.serviceBienImmo.ListeAimerBienParId(bien.id).subscribe(data => {
          this.NombreJaimeAgence = bien.favoris.length;
          // if (typeof bien.id === 'number') {
            this.favoritedPropertiesCountAgence[bien.uuid] =
              this.NombreJaimeAgence;
          // }
          const isFavorite = localStorage.getItem(`favoriteStatus_${bien.uuid}`);
          // });
        }
      );
    });

    //AFFICHER LA LISTE DES PROBLEMES
    this.serviceBienImmo.AfficherLIsteProbleme().subscribe((data) => {
      this.probleme = data;
    });

    //AFFICHER LA LISTE DES RECLAMATIONS DONT LES PROCESSUS SONT LANCES
    this.serviceBienImmo
      .AfficherLIsteReclamationProcessusLance()
      .subscribe((data) => {
        this.reclamationProcessusLance = data.reverse();
      });

    //AFFICHER LA LISTE DES BIENS QUI SONT VENDUS EN FONCTION DE L'UTILISATEUR AVEC AGENCE
    // this.serviceBienImmo.AfficherBienImmoDejaVenduParAgence().subscribe(data => {
    //   // this.bienImmoDejaLoueNew = data;
    //   this.bienVenduagent = data.agent_bien;
    //   this.bienImmoDejaVenduAgence = data.biens;
    //   // this.bienVenduTotalAgence = [...this.bienVenduagent, ...this.bienImmoDejaVenduAgence];

    // });

    //AFFICHER LA LISTE DES BIENS QUE L'UTILISATEUR CONNECTE A LOUER
    this.serviceBienImmo
      .AfficherBienLoueEtAcheterParUserConnecter()
      .subscribe((data) => {
        this.bienImmoDejaLoueLocataires = data.reverse();
        
        
        this.bienImmoDejaLoueLocataires.forEach((bien: any) => {
          // Vérifier si le bien est déjà loué
          if (bien.bien.is_rent === true) {
            this.bienImmoDejaLoueLocataire.push(bien);
          }

          //   // Vérifier si le bien est déjà vendu
          if (bien.bien.is_sell === true) {
            this.bienImmoUserAAcheter.push(bien);
          }

          //   // Le reste de votre logique pour traiter les favoris...
        });
      });

    ////AFFICHER LA LISTE DES FAVORIS DE USER CONNECTE
    this.serviceBienImmo.AfficherFavorisParUserConnecter().subscribe((data) => {
      this.favoris = data?.reverse();
      
      // Parcourir la liste des biens immobiliers
      this.favoris.forEach(
        (bien: { bien: any; favoris: any; uuid: any }) => {
          this.NombreJaime = bien.bien.favoris?.length;
          // if (typeof bien.bien.uuid === 'number') {
            this.favoritedPropertiesCount1[bien.bien.uuid] = this.NombreJaime;
          // }
          // Charger l'état de favori depuis localStorage
          const isFavorite = localStorage.getItem(
            `favoriteStatus_${bien.bien.uuid}`
          );
        }
      );
    });

    //AFFICHER LA LISTE DES RECLAMATIONS RECUES EN FONCTION DES BIENS DE L'UTILISATEUR
    this.serviceBienImmo.AfficherListeReclamationParUser().subscribe((data) => {
      this.reclamation = data.reverse();
    });

    //AFFICHER LA LISTE DES RECLAMATIONS FAITES PAR UTILISATEUR
    this.serviceBienImmo
      .AfficherListeReclamationFaitesParUser()
      .subscribe((data) => {
        this.reclamationUser = data.reverse();
        // this.photos = this.reclamation.bien;
      });

    //AFFICHER LA LISTE DES BIENS QUI SONT VENDUS EN FONCTION DE L'UTILISATEUR
    // this.serviceBienImmo.AfficherBienImmoDejaVenduParUser().subscribe(data => {
    //   this.bienImmoDejaVendu = data.biens.reverse();
    // });

    //AFFICHER LA LISTE DES FACTURES DU LOCATAIRE CONNECTE
    this.servicefacture
      .AfficherFactureLocataireConnecter()
      .subscribe((data) => {
        this.facture = data?.reverse();
        this.bienFacture = data?.bien;
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
    return this.router.navigate(['details-bien', id]);
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS Facture
  goToDettailFacture(id: number) {
    return this.router.navigate(['userpages/facturepaiement', id]);
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA LISTE DES FACTURES
  goToListeFacture(id: number) {
    return this.router.navigate(['userpages/liste_facture', id])
  }
  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE LISTE RECU
  goToListeRecu(id: number) {
    return this.router.navigate(['userpages/liste_recu', id])
  }

  //METHODE PERMETTANT DE SE DECONNECTER
  logout(): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'swal2-confirm btn',
        cancelButton: 'swal2-cancel btn',
      },
      heightAuto: false,
    });
    swalWithBootstrapButtons
      .fire({
        // title: 'Etes-vous sûre de vous déconnecter?',
        text: 'Etes-vous sûre de vous déconnecter?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Annuler',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.authService.logout().subscribe({
            next: (res) => {
              this.storageService.clean();
              this.router.navigateByUrl('/auth/connexion');
            },
            error: (err) => { },
          });
        }
      });
  }
  //FORMATER LE PRIX
  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  //FAIRE RECLAMATION
  FaireReclamation(): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'swal2-confirm btn',
        cancelButton: 'swal2-cancel btn',
      },
      heightAuto: false,
    });

    swalWithBootstrapButtons
      .fire({
        text: 'Etes-vous sûre de bien vouloir faire une reclamation ?',
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
            // Définissez le token dans le service commentaireService
            this.serviceUser.setAccessToken(user.token);

            // Appelez la méthode Fairecommentaire() avec le contenu et l'ID
            this.serviceBienImmo
              .FaireReclamation(
                this.form.contenu,
                this.form.type,
                this.form.prix_estimatif,
                this.selectedBienImmoId,
                this.form.photo
              )
              .subscribe(
                (data) => {
                  // this.isSuccess = false;
                  this.popUpConfirmation();
                },
                (error) => { }
              );
          } else {
          }
        }
      });
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
      confirmButtonColor: '#e98b11',
      showDenyButton: false,
      showCancelButton: false,
      allowOutsideClick: false,
      timer: timerInterval, // ajouter le temps d'attente
      timerProgressBar: true, // ajouter la barre de progression du temps
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
      this.form.prix_estimatif = ''; // Réinitialisez la valeur de form.contenu
      this.image = []; // Réinitialisez le tableau d'images
      window.location.reload();
    });
  }

  //LANCER LE PROCESSUS DE REPARATION
  LancerProcessusReparation(id: any): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'swal2-confirm btn',
        cancelButton: 'swal2-cancel btn',
      },
      heightAuto: false,
    });

    swalWithBootstrapButtons
      .fire({
        text: 'Etes-vous sûre de bien vouloir lancer le processus de reclamation ?',
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
            // Définissez le token dans le service commentaireService
            this.serviceUser.setAccessToken(user.token);

            // Appelez la méthode Fairecommentaire() avec le contenu et l'ID
            this.serviceBienImmo.LancerProcessusReparation(id).subscribe(
              (data) => {
                // this.isSuccess = false;
                this.popUpConfirmationProcessus();
              },
              (error) => { }
            );
          } else {
          }
        }
      });
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
      confirmButtonColor: '#e98b11',
      showDenyButton: false,
      showCancelButton: false,
      allowOutsideClick: false,
      timer: timerInterval, // ajouter le temps d'attente
      timerProgressBar: true, // ajouter la barre de progression du temps
    }).then(() => {
      this.formProcessus.somme = ''; // Réinitialisez la valeur de form.contenu
    });
  }

  //METHODE PERMETTANT DE SUPPRIMER UN BIEN
  SupprimerBien(id: number): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'swal2-confirm btn',
        cancelButton: 'swal2-cancel btn',
      },
      heightAuto: false,
    });
    swalWithBootstrapButtons
      .fire({
        // title: 'Etes-vous sûre de vous déconnecter?',
        text: 'Etes-vous sûre de suppimer ce bien ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          const user = this.storageService.getUser();
          if (user && user.token) {
            // Définissez le token dans le service serviceUser
            this.serviceUser.setAccessToken(user.token);

            // Appelez la méthode PrendreRdv() avec le contenu et l'ID
            this.serviceBienImmo.SupprimerBien(id).subscribe({
              next: (data) => {
                this.popUpConfirmationSuppression();
              },
              error: (err) => {
                this.errorMessage = err.error.message;
              },
            });
          } else {
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // L'utilisateur a annulé l'action
          const cancelNotification = Swal.fire({
            title: 'Action annulée',
            text: 'Vous avez annulé la suppression du bien.',
            icon: 'info',
            showConfirmButton: false, // Supprime le bouton "OK"
            timer: 2000, // Durée en millisecondes (par exemple, 3000 ms pour 3 secondes)
          });

          // Vous n'avez pas besoin de setTimeout pour fermer cette notification, car "timer" le fait automatiquement après la durée spécifiée.
        }
      });
  }

  //POPUP APRES CONFIRMATION DE SUPPRESSION
  popUpConfirmationSuppression() {
    let timerInterval = 2000;
    Swal.fire({
      position: 'center',
      text: 'Bien supprimé avec succès.',
      title: 'Bien supprimé',
      icon: 'success',
      heightAuto: false,
      showConfirmButton: false,
      // confirmButtonText: "OK",
      confirmButtonColor: '#e98b11',
      showDenyButton: false,
      showCancelButton: false,
      allowOutsideClick: false,
      timer: timerInterval, // ajouter le temps d'attente
      timerProgressBar: true, // ajouter la barre de progression du temps
    }).then((result) => {
      // Après avoir réussi à supprimer, mettez à jour l'état de la page
      //AFFICHER LA LISTE DES BIENS PAR UTILISATEUR
      this.serviceBienImmo.AfficherBienImmoParUser().subscribe((data) => {
        this.bienImmo = data.biens.reverse();
        // Parcourir la liste des biens immobiliers
        this.bienImmo.forEach((bien: { uuid: any }) => {
          // Charger le nombre de "J'aime" pour chaque bien
          this.serviceBienImmo
            .ListeAimerBienParId(bien.uuid)
            .subscribe((data) => {
              this.NombreJaime = data.vues;
              // if (typeof bien.uuid === 'number') {
                this.favoritedPropertiesCount1[bien.uuid] = this.NombreJaime;
              // }

              // Charger l'état de favori depuis localStorage
              const isFavorite = localStorage.getItem(
                `favoriteStatus_${bien.uuid}`
              );
              // if (isFavorite === 'true') {
              //   this.favoriteStatus[bien.id] = true;
              // } else {
              //   this.favoriteStatus[bien.id] = false;
              // }
            });
        });
      });

      //AFFICHER LA LISTE DES BIENS EN FONCTION DE L'UTILISATEUR CONNECTEE
      this.serviceBienImmo
        .AfficherBienImmoParUserConnecte()
        .subscribe((data) => {
          this.test = data;
          this.bienImmoAgence = data.biens_agences;
          this.bienImmoAgent = data.biens_agents;
          this.bienImmoAgenceTotal = [
            ...this.bienImmoAgence,
            ...this.bienImmoAgent,
          ];

          // Parcourir la liste des biens immobiliers
          this.bienImmoAgenceTotal.forEach((bien: { uuid: any }) => {
            this.serviceBienImmo
              .ListeAimerBienParId(bien.uuid)
              .subscribe((data) => {
                this.NombreJaimeAgence = data.vues;
                // if (typeof bien.uuid === 'number') {
                  this.favoritedPropertiesCountAgence[bien.uuid] =
                    this.NombreJaimeAgence;
                // }
                const isFavorite = localStorage.getItem(
                  `favoriteStatus_${bien.uuid}`
                );
              });
          });
        });
    });
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE CONTRAT
  goToPageContrat(id: number) {
    return this.router.navigate(['userpages/contrat', id]);
  }

  isSubmenuOpen: boolean = false;
  isSubmenuOpenCandi: boolean = false;

  toggleSubmenu() {
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }

  toggleSubmenuCand() {
    this.isSubmenuOpenCandi = !this.isSubmenuOpenCandi;
  }

  //METHODE PERMETTANT D'AIMER UN BIEN
  AimerBien(id: any): void {
    const user = this.storageService.getUser();
    if (user && user.token) {
      // Définissez le token dans le service commentaireService
      this.serviceUser.setAccessToken(user.token);

      // Appelez la méthode AimerBien() avec l'ID
      this.serviceBienImmo.AimerBien(id).subscribe(
        (data) => {
          // Mettez à jour le nombre de favoris pour le bien immobilier actuel
          if (this.favoriteStatus[id]) {
            this.favoriteStatus[id] = false; // Désaimé
            localStorage.removeItem(`favoriteStatus_${id}`);
            this.favoritedPropertiesCount1[id]--;
          } else {
            this.favoriteStatus[id] = true; // Aimé
            localStorage.setItem(`favoriteStatus_${id}`, 'true');
            this.favoritedPropertiesCount1[id]++;
          }
          this.serviceBienImmo
            .AfficherFavorisParUserConnecter()
            .subscribe((data) => {
              this.favoris = data?.reverse();
              // Parcourir la liste des biens immobiliers
              this.favoris.forEach(
                (bien: { bien: any; favoris: any; uuid: any }) => {
                  this.NombreJaime = bien.bien.favoris?.length;
                  // if (typeof bien.bien.id === 'number') {
                    this.favoritedPropertiesCount1[bien.bien.uuid] =
                      this.NombreJaime;
                  // }
                  // Charger l'état de favori depuis localStorage
                  const isFavorite = localStorage.getItem(
                    `favoriteStatus_${bien.bien.uuid}`
                  );
                }
              );
            });
        },
        (error) => { }
      );
    } else {
    }
  }

  onKeyPress(event: any) {
    const pattern = /[0-9\ \+\-]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // Caractère non numérique, empêcher l'entrée
      event.preventDefault();
    }

    // Insérer un espace après chaque trio de chiffres
    let inputValue = event.target.value.replace(/\s/g, ''); // Supprimer les espaces existants
    let formattedValue = '';
    for (let i = inputValue.length; i > 0; i -= 3) {
      formattedValue = ',' + inputValue.slice(Math.max(i - 3, 0), i) + formattedValue;
    }
    // Supprimer l'espace initial s'il dépasse la limite de 1000 caractères
    formattedValue = formattedValue.slice(0, 1000);

    // Mettre à jour la valeur dans l'input
    event.target.value = formattedValue;
  }
}
