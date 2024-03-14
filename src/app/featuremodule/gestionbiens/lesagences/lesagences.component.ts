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
    
      //AFFICHER LA LISTE DES AGENCES
      this.serviceUser.AfficherLaListeAgence().subscribe((data) => {
        // data.forEach((user: any) => {
        //   // Vérifier si le bien est déjà loué
        //   if (user.roles.name.imclude("ROLE_AGENCE")) {
        //     this.agence.push(user);
        //   }
        // })
        data.forEach((user: any) => {
          // Extraire les noms de rôles de l'utilisateur
          const userRoles = user.roles.map((role: { name: any }) => role.name);
  
          // Vérifier si le rôle "ROLE_AGENCE" est inclus dans les rôles de l'utilisateur
          if (userRoles.includes('ROLE_AGENCE')) {
            this.agence.push(user);
          }
        });
  
        // this.agence = data.reverse();
        this.nombreAgence = this.agence?.length;

        // Parcourir la liste des biens immobiliers
        this.agence?.forEach((agence: { id: number }) => {
          // Charger le nombre de "J'aime" pour chaque bien
          this.serviceAgence.AfficherAgenceParId(agence?.id).subscribe((data) => {
            this.bienImmoAgence = data?.bienImmos;
            this.bienImmoAgent = data?.agents;
            // Initialiser une liste pour stocker tous les biens immobiliers des agents
            let totalBiensAgents: any[] = [];
  
            // Parcourir chaque agent
            data.agents.forEach((agent: any) => {
              // Ajouter les biens immobiliers de l'agent à la liste totale
              totalBiensAgents.push(...agent.bienImmosAgents);
            });
  
            // Maintenant, totalBiensAgents contient la liste totale des biens immobiliers de tous les agents
          
  
            this.bienImmo = [...this.bienImmoAgence, ...totalBiensAgents];
            this.NombreBienParAgence = this.bienImmo.length;
            this.NombreAgentParAgence = data.agents.length;
            // Initialisation des compteurs
            let nombreLouerParAgence = 0;
            let nombreVendreParAgence = 0;
  
            // Parcourir chaque bien immobilier
            this.bienImmo.forEach((bien: any) => {
              // Vérifier le statut du bien immobilier
              if (bien?.statut?.nom === 'A louer') {
                this.bienImmoLouer.push(bien);
                nombreLouerParAgence++;
              } else if (bien?.statut?.nom === 'A vendre') {
                this.bienImmoVendre.push(bien);
                nombreVendreParAgence++;
              }
            });
            // Assigner les compteurs
            this.NombreLouerParAgence = nombreLouerParAgence;
            this.NombreVendreParAgence = nombreVendreParAgence;
  
        
            if (typeof agence.id === 'number') {
              this.NombreBienCount[agence.id] = this.NombreBienParAgence;
              this.NombreAgentCount[agence.id] = this.NombreAgentParAgence;
              this.NombreBienLouerCount[agence.id] = this.NombreLouerParAgence;
              this.NombreBienVendreCount[agence.id] = this.NombreVendreParAgence;
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
    onRegionSelectionChange(event: any) {
      this.selectedRegion = event.value;
    }
  
    //RECHERCHER PAR CERCLE
    onCercleSelectionChange(event: any) {
      this.selectedCercle = event.value;
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
