import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { AuthService } from 'src/app/service/auth/auth.service';
import { StorageService } from 'src/app/service/auth/storage.service';
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
  bienImmoDejaLoue: any;
  bienImmoDejaVendu: any;
  reclamation: any;
  p1: number = 1;
  p2: number = 1;
  p3: number = 1;
  p4: number = 1;
  public albumsOne: any = [];


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


  // IMAGE PAR DEFAUT DES BIENS
  DEFAULT_IMAGE_URL = 'assets/img/gallery/gallery1/gallery-1.jpg';

  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }

  constructor(
    private DataService: DataService,
    private storageService: StorageService,
    public router: Router,
    private serviceBienImmo: BienimmoService,
    private authService: AuthService,
  ) {
    this.electronics = this.DataService.electronicsList,
      this.User = this.storageService.getUser();
    console.log(this.User);
  }
  ngOnInit(): void {
    this.User = this.storageService.getUser().user.id;
    console.log(this.User);

    //AFFICHER LA LISTE DES BIENS PAR UTILISATEUR
    this.serviceBienImmo.AfficherBienImmoParUser().subscribe(data => {
      this.bienImmo = data.biens.reverse();
      console.log(this.bienImmo);
    });

    //AFFICHER LA LISTE DES BIENS QUI SONT LOUES EN FONCTION DE L'UTILISATEUR
    this.serviceBienImmo.AfficherBienImmoDejaLoueParUser().subscribe(data => {
      this.bienImmoDejaLoue = data.biens.reverse();
      console.log(this.bienImmoDejaLoue);
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

  //SEGMENTED CONTROLE
  isListeBienTabActive = true; // Définir le tab "Pays" comme actif par défaut
  isBienLoueTabActive = false;
  isBienVenduTabActive = false;
  isReclamationTabActive = false;

  showLIsteBienTab() {
    this.isListeBienTabActive = true;
    this.isBienLoueTabActive = false;
    this.isBienVenduTabActive = false;
    this.isReclamationTabActive = false;


  }

  showBienLoueTab() {
    this.isListeBienTabActive = false;
    this.isBienLoueTabActive = true;
    this.isBienVenduTabActive = false;
    this.isReclamationTabActive = false;


  }

  showBienVenduTab() {
    this.isBienVenduTabActive = true;
    this.isListeBienTabActive = false;
    this.isBienLoueTabActive = false;
    this.isReclamationTabActive = false;

  }

  showReclamationTab() {
    this.isReclamationTabActive = true;
    this.isBienVenduTabActive = false;
    this.isListeBienTabActive = false;
    this.isBienLoueTabActive = false;
  }
}
