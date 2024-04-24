import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { AdresseService } from 'src/app/service/adresse/adresse.service';
import { AgenceService } from 'src/app/service/agence/agence.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { CommoditeService } from 'src/app/service/commodite/commodite.service';
import { DataService } from 'src/app/service/data.service';
const URL_PHOTO: string = environment.Url_PHOTO;
@Component({
  selector: 'app-lesagences',
  templateUrl: './lesagences.component.html',
  styleUrls: ['./lesagences.component.scss']
})
export class LesagencesComponent implements OnInit  {
 
  public routes = routes;
  nombreAgence: number = 0;
  agence: any[] = [];
  public categories: any = [];
  public listsidebar: any = [];
  bienImmoAgence: any;
  bienImmoAgent: any;
  bienImmo: any;
  NombreBienParAgence: number = 0;
  NombreAgentParAgence: number = 0;
  bienImmoLouer: any[] = [];
  bienImmoVendre: any[] = [];
  NombreLouerParAgence: number = 0;
  NombreVendreParAgence: number = 0;
  NombreBienCount: { [agenceId: number]: number } = {};
  NombreAgentCount: { [agenceId: number]: number } = {};
  NombreBienLouerCount: { [agenceId: number]: number } = {};
  NombreBienVendreCount: { [agenceId: number]: number } = {};
  p: number = 1; // Numéro de page actuelle pour la pagination
  
  regions: any = [];
  communes: any = [];
  cercles: any = [];
  commodite: any
  adresse: any
  region: any
  commune: any
  typebien: any
  cercle:any
  selectedRegion: any;
  selectedCommune: any;
  selectedCercle: any;
  searchInputCategory: any;
  selectedCategory: any = '';
  categoriesDataSource = new MatTableDataSource();
  searchText: any;
  communes1: any = [];
  currentPage = 1;
  itemsPerPage = 4;
  totalPages: number = 0;
  filteredCercles: any[] = []; // Déclarez cette propriété dans votre classe 'BiensComponent'


  hashString(str: string): number {
    let hash = 0;
    if (str.length === 0) {
      return hash;
    }
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }
  

   // Méthode pour changer de page
   setCurrentPage(page: number) {
    this.currentPage = page;
  }

  pageSize: number = 4; // Nombre d'éléments par page
  // Calcul du nombre total de pages
  get pageCount(): number {
    // if (this.bienImmo.length === 0) {
        // return 1; // Si aucune donnée n'est disponible, renvoie 1 page
    // } else {
        return Math.ceil(this.agence.length / this.pageSize);
    // }
}



  get pages(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  // Méthode pour passer à la page précédente
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Méthode pour passer à la page suivante
  nextPage() {
    if (this.currentPage < this.pageCount) {
      this.currentPage++;
    }
  }

  constructor(
    private router: Router,
    private storageService: StorageService,
    private serviceAdresse: AdresseService,
    private serviceCommodite: CommoditeService,
    private serviceAgence: AgenceService,
    @Inject(LOCALE_ID) private localeId: string,
    private serviceBienImmo: BienimmoService,
    private serviceUser: UserService,
    private Dataservice: DataService,
  ) {
    this.listsidebar = this.Dataservice.listsidebarList,
      this.categories = this.Dataservice.categoriesList;
    (this.categoriesDataSource = new MatTableDataSource(this.categories));
    this.locale = localeId;
  }
  locale!: string;

  ngOnInit(): void {
    
// AFFICHER LA LISTE DES AGENCES
this.serviceUser.AfficherLaListeAgence().subscribe((data) => {
  data.forEach((user: any) => {
    const userRoles = user.roles.map((role: { name: any }) => role.name);

    if (userRoles.includes('ROLE_AGENCE')) {
      this.agence.push(user);
    }
  });

  this.nombreAgence = this.agence?.length;

  this.agence?.forEach((agence: { uuid: string }) => {
    this.serviceAgence.AfficherAgenceParId(agence?.uuid).subscribe((data) => {
      this.bienImmoAgence = data?.bienImmos;
      this.bienImmoAgent = data?.agents;
      let totalBiensAgents: any[] = [];

      data.agents.forEach((agent: any) => {
        totalBiensAgents.push(...agent.bienImmosAgents);
      });

      this.bienImmo = [...this.bienImmoAgence, ...totalBiensAgents];
      this.NombreBienParAgence = this.bienImmo.length;
      this.NombreAgentParAgence = data.agents.length;
      let nombreLouerParAgence = 0;
      let nombreVendreParAgence = 0;

      this.bienImmo.forEach((bien: any) => {
        if (bien?.statut?.nom === 'A louer') {
          this.bienImmoLouer.push(bien);
          nombreLouerParAgence++;
        } else if (bien?.statut?.nom === 'A vendre') {
          this.bienImmoVendre.push(bien);
          nombreVendreParAgence++;
        }
      });

      this.NombreLouerParAgence = nombreLouerParAgence;
      this.NombreVendreParAgence = nombreVendreParAgence;


      // Convertir l'UUID de type string en type number avec une fonction de hachage
function hashString(str: string): number {
  let hash = 0;
  if (str.length === 0) {
    return hash;
  }
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir en entier 32 bits
  }
  return hash;
}

// Utilisation de la fonction de hachage pour convertir l'UUID en number
const agenceId = hashString(agence.uuid);
      if (typeof agence.uuid === 'string') {
        this.NombreBienCount[agenceId] = this.NombreBienParAgence;
        this.NombreAgentCount[agenceId] = this.NombreAgentParAgence;
        this.NombreBienLouerCount[agenceId] = this.NombreLouerParAgence;
        this.NombreBienVendreCount[agenceId] = this.NombreVendreParAgence;
      }
    });
  });
});

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

  applyFilters(agences: any[]): any[] {
    return agences.filter((agence: any) => {
      // Appliquer tous les critères de filtrage
      const filterCercle = !this.selectedCercle || agence.adresse?.commune.cercle.nomcercle === this.selectedCercle;
      const filterRegion = !this.selectedRegion || agence.adresse?.commune.cercle.region.nomregion === this.selectedRegion;
      const filterCommune = !this.selectedCommune || agence.adresse?.commune.nomcommune === this.selectedCommune;
      const filterSearchText = !this.searchText || agence.someProperty.includes(this.searchText); // Remplacez someProperty par la propriété sur laquelle vous souhaitez effectuer la recherche
  
      return filterCercle && filterRegion && filterCommune && filterSearchText;
    });
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
    //RECHERCHER PAR REGION
    onRegionSelectionChange(newValue: any) {
      this.filteredCercles = this.cercle.filter(
        (el: any) => el.region.id == newValue.value || el.region.nomregion == newValue.value
      );
      this.selectedRegion = newValue.value;
    }
    
  
    //RECHERCHER PAR CERCLE
    onCercleSelectionChange(newValue: any) {
      this.communes1 = this.commune.filter(
        (el: any) =>
          el.cercle.id == newValue.value || el.cercle.nomcercle == newValue.value
      );
  
      this.selectedCercle = newValue.value;
      
    }
  
    searchCategory(value: any): void {
      const filterValue = value;
      this.categoriesDataSource.filter = filterValue.trim().toLowerCase();
      this.categories = this.categoriesDataSource.filteredData;
    }

  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO;
    return baseUrl + photoFileName;
  }
  handleAuthorImageError(event: any) {
    event.target.src =
      'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }
  goToDettailAgence(id: number) {
    return this.router.navigate(['detailsagence', id]);
  }
   // Méthode pour gérer le changement de page de la pagination
   onPageChange(pageNumber: number) {
    this.p = pageNumber; // Mettez à jour le numéro de page actuelle
  }
  //RECHERCHER PAR COMMUNE
  onCommuneSelectionChange(event: any) {
    this.selectedCommune = event.value;
  }


}
