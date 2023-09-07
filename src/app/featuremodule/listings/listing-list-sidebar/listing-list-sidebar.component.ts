import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { routes } from 'src/app/core/helpers/routes/routes';
import { DataService } from 'src/app/service/data.service';
import { Options } from '@angular-slider/ngx-slider';
import { environment } from 'src/app/environments/environment';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { CommoditeService } from 'src/app/service/commodite/commodite.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/auth/user.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import { OwlOptions } from 'ngx-owl-carousel-o';

const URL_PHOTO: string = environment.Url_PHOTO;


@Component({
  selector: 'app-listing-list-sidebar',
  templateUrl: './listing-list-sidebar.component.html',
  styleUrls: ['./listing-list-sidebar.component.css']
})
export class ListingListSidebarComponent implements OnInit {
  public routes = routes;
  public listsidebar: any = [];
  slidevalue: number = 55;
  isLoggedIn = false;
  isLoginFailed = true;
  searchText: any;
  bienImmo: any;
  p: number = 1;
  errorMessage = '';
  NombreJaime: number = 0
  locale!: string;
  favoriteStatus: { [key: string]: boolean } = {};
  favoritedPropertiesCount1: { [bienId: number]: number } = {};

  public listingOwlOptions: OwlOptions = {
    margin: 24,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: [
      "<i class='fa-solid fa-angle-left'></i>",
      "<i class='fa-solid fa-angle-right'></i>",
    ],
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 3
      },
      1170: {
        items: 5,
        loop: true
      }
    },
    nav: false,
  };
  
  options: Options = {
    floor: 0,
    ceil: 100,
  };
  constructor(
    private Dataservice: DataService,
    private serviceBienImmo: BienimmoService,
    private serviceCommodite: CommoditeService,
    private routerr: Router,
    private serviceUser: UserService,
    @Inject(LOCALE_ID) private localeId: string,
    private storageService: StorageService) {
    this.listsidebar = this.Dataservice.listsidebarList,
      this.locale = localeId;
  }


  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
    } else if (!this.storageService.isLoggedIn()) {
      this.isLoginFailed = false;
    }

    //AFFICHER LA LISTE DES BIENS IMMO
    // Charger la liste des biens immobiliers
    this.serviceBienImmo.AfficherLaListeBienImmo().subscribe(data => {
      this.bienImmo = data.biens.reverse();
      console.log(this.bienImmo);

      // Parcourir la liste des biens immobiliers
      this.bienImmo.forEach((bien: { id: string | number; }) => {
        // Charger le nombre de "J'aime" pour chaque bien
        this.serviceBienImmo.ListeAimerBienParId(bien.id).subscribe(data => {
          this.NombreJaime = data.vues;
          if (typeof bien.id === 'number') {
            this.favoritedPropertiesCount1[bien.id] = this.NombreJaime;
          }

          // Charger l'état de favori depuis localStorage
          const isFavorite = localStorage.getItem(`favoriteStatus_${bien.id}`);
          if (isFavorite === 'true') {
            this.favoriteStatus[bien.id] = true;
          } else {
            this.favoriteStatus[bien.id] = false;
          }
        });
      });
    });

  }

  // IMAGE PAR DEFAUT DES BIENS
  DEFAULT_IMAGE_URL = 'assets/img/gallery/gallery1/gallery-1.jpg';

  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }

  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO + '/uploads/images/';
    return baseUrl + photoFileName;
  }
  //FORMATER LE PRIX
  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS BIEN
  goToDettailBien(id: number) {
    console.log(id);
    return this.routerr.navigate(['pages/service-details', id])
  }

  //METHODE PERMETTANT D'AIMER UN BIEN 
  AimerBien(id: any): void {
    const user = this.storageService.getUser();
    if (user && user.token) {
      // Définissez le token dans le service commentaireService
      this.serviceUser.setAccessToken(user.token);

      // Appelez la méthode AimerBien() avec l'ID
      this.serviceBienImmo.AimerBien(id).subscribe(
        data => {
          console.log("Bien aimé avec succès:", data);

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
        },
        error => {
          console.error("Erreur lors du like :", error);
          // Gérez les erreurs ici
        }
      );
    } else {
      console.error("Token JWT manquant");
    }
  }

}
