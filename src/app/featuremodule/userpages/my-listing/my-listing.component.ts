import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

const URL_PHOTO: string = environment.Url_PHOTO;


@Component({
  selector: 'app-my-listing',
  templateUrl: './my-listing.component.html',
  styleUrls: ['./my-listing.component.css']
})
export class MyListingComponent implements OnInit {
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
  public albumsOne: any = [];
  isLocataire = false;
  roles: string[] = [];
  bienImmoDejaLoueLocataire: any
  valuesSelect: any = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];




  public electronics: any = []

  selectedTab: string = 'home'; // Onglet sélectionné par défaut

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

  photos: any;
  maxImageCount: number = 0; // Limite maximale d'images
  selectedFiles: any;
  image: File[] = [];
  images: File[] = [];
  isButtonDisabled: boolean = false; // Variable pour désactiver le bouton si la limite est atteinte

  form: any = {
    contenu: null,
    type_probleme_id: null,
    photos: null,
  };


  // IMAGE PAR DEFAUT DES BIENS
  DEFAULT_IMAGE_URL = 'assets/img/gallery/gallery1/gallery-1.jpg';

  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }
  // Déclarez une variable pour stocker l'ID du BienImmo sélectionné
  selectedBienImmoId: any;

  // Fonction pour ouvrir le modal avec l'ID du BienImmo
  // Fonction pour ouvrir le modal avec l'ID du BienImmo
  openReclamationModal(bienImmoId: number) {
    // Stockez l'ID du BienImmo sélectionné dans la variable
    this.selectedBienImmoId = bienImmoId;
    console.log(this.selectedBienImmoId);
    
  }

  constructor(
    private DataService: DataService,
    private storageService: StorageService,
    public router: Router,
    private serviceBienImmo: BienimmoService,
    private serviceUser: UserService,
    private authService: AuthService,
  ) {
    this.electronics = this.DataService.electronicsList,
      this.User = this.storageService.getUser();
    console.log(this.User);
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

    //AFFICHER LA LISTE DES BIENS QUI SONT LOUES EN FONCTION DE L'UTILISATEUR
    this.serviceBienImmo.AfficherBienImmoDejaLoueParUser().subscribe(data => {
      this.bienImmoDejaLoue = data.biens.reverse();
      console.log(this.bienImmoDejaLoue);
    });

    //AFFICHER LA LISTE DES BIENS QUI SONT LOUES EN FONCTION DE LE LOCATAIRE
    this.serviceBienImmo.AfficherBienImmoDejaLoueParLocataire().subscribe(data => {
      this.bienImmoDejaLoueLocataire = data.biens.reverse();
      console.log(this.bienImmoDejaLoueLocataire);
    });


    //AFFICHER LA LISTE DES RECLAMATIONS EN FONCTION DES BIENS DE L'UTILISATEUR
    this.serviceBienImmo.AfficherListeReclamationParUser().subscribe(data => {
      this.reclamation = data.attributes;
      // this.photos = this.reclamation.bien;
      console.log(this.reclamation);
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
    const user = this.storageService.getUser();
    if (user && user.token) {
      // Définissez le token dans le service commentaireService
      this.serviceUser.setAccessToken(user.token);



      // Appelez la méthode Fairecommentaire() avec le contenu et l'ID
      this.serviceBienImmo.FaireReclamation(this.form.contenu,this.form.type_probleme_id, this.selectedBienImmoId, this.form.photo).subscribe(
        data => {
          console.log("Reclamation envoyée avec succès:", data);
          // this.isSuccess = false;
        },
        error => {
          console.error("Erreur lors de l'envoi de la reclamation :", error);
          // Gérez les erreurs ici
        }
      );
    } else {
      console.error("Token JWT manquant");
    }

    //Faire un commentaire
    //  this.servicecommentaire.Fairecommentaire(this.commentaireForm.contenu, this.id).subscribe(data=>{
    //   console.log(data);
    // });
  }

}
