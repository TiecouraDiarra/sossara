import { Component, Inject, LOCALE_ID } from '@angular/core';

import { Options } from '@angular-slider/ngx-slider';
import { routes } from 'src/app/core/helpers/routes/routes';
import { DataService } from 'src/app/service/data.service';
import { MatTableDataSource } from '@angular/material/table';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { CommoditeService } from 'src/app/service/commodite/commodite.service';
import { Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';

const URL_PHOTO: string = environment.Url_PHOTO;


@Component({
  selector: 'app-listing-grid-sidebar',
  templateUrl: './listing-grid-sidebar.component.html',
  styleUrls: ['./listing-grid-sidebar.component.css'],
})
export class ListingGridSidebarComponent {
  public routes = routes;
  public listsidebar: any = [];
  public categories: any = [];
  categoriesDataSource = new MatTableDataSource();
  searchInputCategory: any;
  selectedCategory: any = '';
  bienImmo: any;
  searchText: any;
  selectedRegion: any;
  selectedCommune: any;
  p: number = 1;
  selectedType: any;
  selectedStatut: any;
  commoditeSelectionnees: string[] = [];
  valuesSelect: any = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  status: any = ['A louer', 'A vendre'];



  regions: any = [];
  communes: any = [];

  favoritedPropertiesCount: number = 0;


  isFavorite: boolean = false;
  favoriteStatus: { [key: string]: boolean } = {};
  favoritedPropertiesCount1: { [bienId: number]: number } = {};
  toggleFavorite(bienId: number) {
    this.favoriteStatus[bienId] = !this.favoriteStatus[bienId];

    // Mettez à jour le nombre de favoris pour le bien immobilier actuel
    if (this.favoriteStatus[bienId]) {
      this.favoritedPropertiesCount1[bienId]++;
    } else {
      this.favoritedPropertiesCount1[bienId]--;
    }

    // Vous pouvez également ajouter ici la logique pour enregistrer l'état du favori côté serveur si nécessaire.
  }



  commodite: any
  adresse: any
  region: any
  commune: any
  typebien: any
  NombreJaime: number = 0

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

  //AFFICHER REGION EN FONCTION DU PAYS
  onChange(newValue: any) {
    this.regions = this.region.filter(
      (el: any) => el.pays.nom == newValue.value
    );
  }

  //AFFICHER COMMUNE EN FONCTION DE REGION
  onChangeRegion(newValue: any) {
    this.communes = this.commune.filter(
      (el: any) => el.region.nom == newValue.value
    );
  }
  //FORMATER LE PRIX
  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  //RECHERCHER PAR REGION
  onRegionSelectionChange(event: any) {
    this.selectedRegion = event.value;
  }

  //RECHERCHER PAR STATUT
  onStatutSelectionChange(event: any) {
    this.selectedStatut = event.value;
  }


  //RECHERCHER PAR COMMUNE
  onCommuneSelectionChange(event: any) {
    this.selectedCommune = event.value;
  }

  //RECHERCHER PAR TYPE
  onTypeSelectionChange(event: any) {
    this.selectedType = event.value;
  }

  //RECHERCHER PAR COMMODITE
  // onCommoditeSelectionChange(event: any) {
  //   this.selectedStatut = event.value;
  // }

  isLoggedIn = false;
  isLoginFailed = true;
  errorMessage = '';
  // Dans votre composant, déclarez la variable isLoading
  isLoading: boolean = true;


  slidevalue: number = 55;
  options: Options = {
    floor: 0,
    ceil: 100,
  };
  locale!: string;

  constructor
    (private Dataservice: DataService,
      private serviceBienImmo: BienimmoService,
      private serviceCommodite: CommoditeService,
      private routerr: Router,
      private serviceUser: UserService,
      @Inject(LOCALE_ID) private localeId: string,
      private storageService: StorageService
    ) {
    this.listsidebar = this.Dataservice.listsidebarList,
      this.categories = this.Dataservice.categoriesList;
    (this.categoriesDataSource = new MatTableDataSource(this.categories));
    this.locale = localeId;
  }
  searchCategory(value: any): void {
    const filterValue = value;
    this.categoriesDataSource.filter = filterValue.trim().toLowerCase();
    this.categories = this.categoriesDataSource.filteredData;
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
      this.isLoading = false; // Marquer le chargement comme terminé
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
    //AFFICHER LA LISTE DES COMMODITES
    this.serviceCommodite.AfficherLaListeCommodite().subscribe(data => {
      this.commodite = data.commodite;
      this.adresse = data;
      this.region = data.region.reverse();
      this.commune = data.commune;
      this.typebien = data.type;
      // console.log(this.adresse);
    });
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS BIEN
  goToDettailBien(id: number) {
    // console.log(id);
    return this.routerr.navigate(['details-bien', id])
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
          // console.log("Bien aimé avec succès:", data);

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
          // console.error("Erreur lors du like :", error);
          // Gérez les erreurs ici
        }
      );
    } else {
      // console.error("Token JWT manquant");
    }
  }

}
