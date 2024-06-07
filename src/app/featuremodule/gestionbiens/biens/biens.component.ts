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
import { AdresseService } from 'src/app/service/adresse/adresse.service';
import { configbienService } from 'src/app/service/configbien/configbien.service';
import { NgForm } from '@angular/forms';

const URL_PHOTO: string = environment.Url_PHOTO;


@Component({
  selector: 'app-biens',
  templateUrl: './biens.component.html',
  styleUrls: ['./biens.component.css'],
})
export class BiensComponent {
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
  currentPage = 1;
  itemsPerPage = 12;
  totalPages: number = 0;
  selectedStatut: any;
  commoditeSelectionnees: string[] = [];
  valuesSelect: any = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  // status: any = ['A louer', 'A vendre'];

  communes1: any = [];
  filteredCercles: any[] = []; // Déclarez cette propriété dans votre classe 'BiensComponent'


  regions: any = [];
  communes: any = [];

  favoritedPropertiesCount: number = 0;


  // Méthode pour changer de page
  setCurrentPage(page: number) {
    this.currentPage = page;
    // this.loadCurrentPage();
  }

  pageSize: number = 12; // Nombre d'éléments par page
  // Calcul du nombre total de pages
  get pageCount(): number {
    return Math.ceil(this.bienImmo?.length / this.pageSize);
  }


  get pages(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  // Méthode pour passer à la page précédente
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      // this.loadCurrentPage();
    }
  }

  // Méthode pour passer à la page suivante
  nextPage() {
    if (this.currentPage < this.pageCount) {
      this.currentPage++;
      // this.loadCurrentPage();
    }
  }
  onSubmit(form: NgForm): void {
    const {
      commodite,
      type,
      commune,
      nb_piece,
      chambre,
      cuisine,
      toilette,
      regionForm,
      cercleForm,
      statut,
      maxprix,
      minprix
    } = this.form;
  }

  form: any = {
    commodite: null,
    type: null,
    commune: null,
    nb_piece: null,
    chambre: null,
    cuisine: null,
    toilette: null,
    statut: null,
    regionForm: null,
    cercleForm: null,
    maxprix: null,
    minprix: null
  };


  isFavorite: boolean = false;
  favoriteStatus: { [key: string]: boolean } = {};
  favoritedPropertiesCount1: { [bienId: number]: number } = {};
  cercle: any;
  cercles: any;
  selectedCercle: any;
  status: any;
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
    const baseUrl = URL_PHOTO;
    return baseUrl + photoFileName;
  }

  //AFFICHER REGION EN FONCTION DU PAYS
  onChange(newValue: any) {
    this.regions = this.region.filter(
      (el: any) => el.pays.nompays == newValue.value
    );
  }

  //AFFICHER CERCLE EN FONCTION DE REGION
  onChangeRegion(newValue: any) {
    this.cercles = this.cercle.filter(
      (el: any) => el.region.nomregion == newValue.value
    );
  }


  //AFFICHER COMMUNE EN FONCTION DE CERCLE
  onChangeCercle(newValue: any) {
    this.communes = this.commune.filter(
      (el: any) => el.cercle.nomcercle == newValue.value
    );
  }
  //FORMATER LE PRIX
  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  //RECHERCHER PAR REGION
  // onRegionSelectionChange(event: any) {
  //   this.selectedRegion = event.value;
  // }
  onRegionSelectionChange(newValue: any) {
    this.filteredCercles = this.cercle.filter(
      (el: any) => el.region.id == newValue.value || el.region.nomregion == newValue.value
    );
    this.selectedRegion = newValue.value;
  }
  



  onCercleSelectionChange(newValue: any) {
    this.communes1 = this.commune.filter(
      (el: any) =>
        el.cercle.id == newValue.value || el.cercle.nomcercle == newValue.value
    );

    this.selectedCercle = newValue.value;
    
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
      private serviceAdresse: AdresseService,
      private serviceConfigBien: configbienService,
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
      this.bienImmo = data.reverse();
      // console.log(this.bienImmo);
      
      
      this.isLoading = false; // Marquer le chargement comme terminé
      // Parcourir la liste des biens immobiliers
      this.bienImmo.forEach((bien: {
        uuid: any;
        favoris: any;
      }) => {
        // Charger le nombre de "J'aime" pour chaque bien
        // this.serviceBienImmo.ListeAimerBienParId(bien.id).subscribe(data => {
        this.NombreJaime = bien.favoris?.length;
        

        // if (typeof bien.uuid === 'number') {
          this.favoritedPropertiesCount1[bien.uuid] = this.NombreJaime;
        // }

        // Charger l'état de favori depuis localStorage
        const isFavorite = localStorage.getItem(`favoriteStatus_${bien.uuid}`);
        if (isFavorite === 'true') {
          this.favoriteStatus[bien.uuid] = true;
        } else {
          this.favoriteStatus[bien.uuid] = false;
        }
      });
      // });
    });
    //AFFICHER LA LISTE DES COMMODITES
    // this.serviceCommodite.AfficherLaListeCommodite().subscribe(data => {
    //   this.commodite = data.commodite;
    //   this.adresse = data;
    //   // this.region = data.region.reverse();
    //   // this.commune = data.commune;
    //   // this.typebien = data.type;
    // });

    //AFFICHER LA LISTE DES TYPES DE BIENS
    this.serviceConfigBien.AfficherListeTypeImmo().subscribe(data => {
      this.typebien = data;
    }
    );

    //AFFICHER LA LISTE DES STATUT DE BIENS
    this.serviceConfigBien.AfficherListeStatut().subscribe(data => {
      this.status = data;
    }
    );

    //AFFICHER LA LISTE DES REGIONS
    this.serviceAdresse.AfficherListeRegion().subscribe(data => {
      this.region = data;
    }
    );

    //AFFICHER LA LISTE DES REGIONS
    this.serviceAdresse.AfficherListeCercle().subscribe(data => {
      this.cercle = data;
    }
    );

    //AFFICHER LA LISTE DES COMMUNES
    this.serviceAdresse.AfficherListeCommune().subscribe(data => {
      this.commune = data;
    });
  }

  //Le filtre

  paginateItems(items: any[], currentPage: number, itemsPerPage: number): any[] {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    return items.slice(startIndex, endIndex);
  }

  applyFilters(bienImmo: any[]): any[] {
    // Appliquer les filtres
    const filteredItems = bienImmo.filter((bien: any) => {
      // Vos conditions de filtrage ici
      const filterCercle = !this.selectedCercle || bien.adresse.commune.cercle.nomcercle === this.selectedCercle;
      const filterRegion = !this.selectedRegion || bien.adresse.commune.cercle.region.nomregion === this.selectedRegion;
      const filterCommune = !this.selectedCommune || bien.adresse.commune.nomcommune === this.selectedCommune;
      const filterType = !this.selectedType || bien.typeImmo.nom === this.selectedType;
      const filterStatut = !this.selectedStatut || bien.statut.nom === this.selectedStatut;
      const filterSearchText = !this.searchText || bien.someProperty.includes(this.searchText); // Remplacez someProperty par la propriété sur laquelle vous souhaitez effectuer la recherche
      return filterCercle && filterRegion && filterCommune && filterType && filterStatut && filterSearchText;
    });

    // Paginer les résultats filtrés
    const paginatedItems = this.paginateItems(filteredItems, this.currentPage, this.itemsPerPage);
    
    return paginatedItems;
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS BIEN
  goToDettailBien(id: number) {
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
          // Gérez les erreurs ici
        }
      );
    } else {
    }
  }

}
