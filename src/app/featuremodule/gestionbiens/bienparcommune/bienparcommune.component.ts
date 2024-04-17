import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { CommoditeService } from 'src/app/service/commodite/commodite.service';
import { configbienService } from 'src/app/service/configbien/configbien.service';
import { DataService } from 'src/app/service/data.service';

const URL_PHOTO: string = environment.Url_PHOTO;


@Component({
  selector: 'app-bienparcommune',
  templateUrl: './bienparcommune.component.html',
  styleUrls: ['./bienparcommune.component.css']
})
export class BienparcommuneComponent {
  public routes = routes;
  public Bookmark: any = [];
  bienImmo: any
  categoriesDataSource = new MatTableDataSource();
  commune: any
  p: number = 1;
  id: any
  searchInputCategory: any;
  searchText: any;
  NombreJaime: number = 0

  commodite: any
  adresse: any
  region: any
  public categories: any = [];
  typebien: any
  selectedCategory: any = '';
  // status: any = ['A louer', 'A vendre'];




  isLoggedIn = false;
  isLoginFailed = true;
  errorMessage = '';
  selectedStatut: any;

  selectedType: any;
  status: any;
  nomcommune: any;
  currentPage = 1;
  itemsPerPage = 2;
  totalPages: number = 0;



  //RECHERCHER PAR TYPE
  onTypeSelectionChange(event: any) {
    this.selectedType = event.value;
  }

  //RECHERCHER PAR STATUT
  onStatutSelectionChange(event: any) {
    this.selectedStatut = event.value;
  }

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

  //FORMATER LE PRIX
  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  searchCategory(value: any): void {
    const filterValue = value;
    this.categoriesDataSource.filter = filterValue.trim().toLowerCase();
    this.categories = this.categoriesDataSource.filteredData;
  }

  constructor(
    private Dataservice: DataService,
    private router: Router,
    private serviceBienImmo: BienimmoService,
    private serviceUser: UserService,
    private serviceConfigBien: configbienService,
    private serviceCommodite: CommoditeService,
    private storageService: StorageService,
    private route: ActivatedRoute,
  ) {
    this.categories = this.Dataservice.categoriesList;
    (this.categoriesDataSource = new MatTableDataSource(this.categories));
    this.Bookmark = this.Dataservice.bookmarkList

  }
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
    } else if (!this.storageService.isLoggedIn()) {
      this.isLoginFailed = false;
    }
    // Récupérez l'utilisateur connecté et ses biens aimés lorsqu'il se connecte
    this.onUserLoginSuccess();

    //AFFICHER LA LISTE DES COMMODITES
    // this.serviceCommodite.AfficherLaListeCommodite().subscribe(data => {
    //   this.commodite = data.commodite;
    //   this.adresse = data;
    //   this.region = data.region.reverse();
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

    //RECUPERER L'ID D'UNE COMMUNE
    this.nomcommune = this.route.snapshot.params["nomcommune"]
    this.serviceBienImmo.AfficherBienImmoParNomCommune(this.nomcommune).subscribe(data => {
      this.bienImmo = data.reverse();
      // Initialisation de favoritedPropertiesCount pour tous les biens immobiliers avec zéro favori.
      this.bienImmo.forEach((bien: {
        favoris: any; id: string | number;
      }) => {
        // this.serviceBienImmo.ListeAimerBienParId(bien.id).subscribe(data => {
        this.NombreJaime = bien.favoris?.length;
        if (typeof bien.id === 'number') {
          this.favoritedPropertiesCount1[bien.id] = this.NombreJaime;
          // this.favoriteStatus[bien.id] = true
        }
        // Charger l'état de favori depuis localStorage
        const isFavorite = localStorage.getItem(`favoriteStatus_${bien.id}`);
        if (isFavorite === 'true') {
          this.favoriteStatus[bien.id] = true;
        } else {
          this.favoriteStatus[bien.id] = false;
        }
        // })
      });
      this.commune = this.bienImmo[0]?.adresse?.commune?.nomcommune;
    })
  }

  applyFilters(bienImmo: any[]): any[] {
    return bienImmo.filter((bien: any) => {
      // Appliquer tous les critères de filtrage
      // const filterCercle = !this.selectedCercle || bien.adresse.commune.cercle.nomcercle === this.selectedCercle;
      // const filterRegion = !this.selectedRegion || bien.adresse.commune.cercle.region.nomregion === this.selectedRegion;
      // const filterCommune = !this.selectedCommune || bien.adresse.commune.nomcommune === this.selectedCommune;
      const filterType = !this.selectedType || bien.typeImmo.nom === this.selectedType;
      const filterStatut = !this.selectedStatut || bien.statut.nom === this.selectedStatut;
      const filterSearchText = !this.searchText || bien.someProperty.includes(this.searchText); // Remplacez someProperty par la propriété sur laquelle vous souhaitez effectuer la recherche
  
      return filterType && filterStatut && filterSearchText;
    });
  }
  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS BIEN
  goToDettailBien(id: number) {
    return this.router.navigate(['details-bien', id])
  }

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

  //METHODE PERMETTANT D'AIMER UN BIEN 
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

  BienAime: any

  // Cette méthode est appelée lorsque l'utilisateur se connecte avec succès
  onUserLoginSuccess(): void {
    // Récupérez l'utilisateur connecté depuis votre service d'authentification (par exemple, storageService)
    const user = this.storageService.getUser();

    if (user && user.token) {
      // Définissez le token dans le service commentaireService
      this.serviceUser.setAccessToken(user.token);

      // Récupérez la liste des biens immobiliers aimés par l'utilisateur depuis l'API Symfony
      this.serviceBienImmo.ListeBiensAimesParUtilisateur().subscribe(data => {
        this.BienAime = data;

        // dataArray est le tableau d'objets renvoyé par l'API Symfony
        data.forEach((aimedBien: any) => {
          const bienId = aimedBien.bien.id; // Extrayez l'ID du bien aimé

          this.favoriteStatus[bienId] = true; // Indiquez que ce bien a été aimé
        });
      });
    }
  }

   // Méthode pour changer de page
   setCurrentPage(page: number) {
    this.currentPage = page;
    // this.loadCurrentPage();
  }

  pageSize: number = 2; // Nombre d'éléments par page
  // Calcul du nombre total de pages
  get pageCount(): number {
    return Math.ceil(this.bienImmo.length / this.pageSize);
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
}
