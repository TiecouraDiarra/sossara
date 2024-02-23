import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { routes } from 'src/app/core/helpers/routes/routes';
import { DataService } from 'src/app/service/data.service';
import { Options } from '@angular-slider/ngx-slider';
import { environment } from 'src/app/environments/environment';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { CommoditeService } from 'src/app/service/commodite/commodite.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/service/auth/user.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AgenceService } from 'src/app/service/agence/agence.service';

const URL_PHOTO: string = environment.Url_PHOTO;


@Component({
  selector: 'app-detailsagence',
  templateUrl: './detailsagence.component.html',
  styleUrls: ['./detailsagence.component.css']
})
export class DetailsagenceComponent implements OnInit {
  public routes = routes;
  public listsidebar: any = [];
  slidevalue: number = 55;
  isLoggedIn = false;
  isLoginFailed = true;
  searchText: any;
  searchTextAgent: any;
  bienImmo: any;
  NombreBienAgence: number = 0
  NombreAgent: number = 0
  NombreTotalBien: number = 0
  TauxActivite: number = 0
  agent: any;
  bienImmoAgent: any;
  bienImmoAgence: any;
  p: number = 1;
  errorMessage = '';
  NombreJaime: number = 0
  totalLikes: number = 0
  locale!: string;
  favoriteStatus: { [key: string]: boolean } = {};
  favoritedPropertiesCount1: { [bienId: number]: number } = {};
  id: any
  agence: any


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


  public recentarticleOwlOptions: OwlOptions = {
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
        items: 4
      },
      1170: {
        items: 1,
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
    private serviceAgence: AgenceService,
    private routerr: Router,
    private route: ActivatedRoute,
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

    //RECUPERER L'ID D'UNE AGENCE
    this.id = this.route.snapshot.params["id"]
    this.serviceAgence.AfficherAgenceParId(this.id).subscribe(data => {
      console.log(data);
      
      this.agence = data;
      this.bienImmoAgence = data.bienImmos;
      this.bienImmoAgent = data.biens_agents;
      this.bienImmo = [...this.bienImmoAgence, ...this.bienImmoAgent];
      this.NombreBienAgence = this.bienImmo.length;
    
      // Initialisez une variable pour stocker le nombre total de "J'aime".
      // let totalLikes = 0;
    
      this.bienImmo.forEach((bien: { id: string | number; }) => {
        this.serviceBienImmo.ListeAimerBienParId(bien.id).subscribe(data => {
          this.NombreJaime = data.vues;
          if (typeof bien.id === 'number') {
            this.favoritedPropertiesCount1[bien.id] = this.NombreJaime;
            // Ajoutez le nombre de "J'aime" au total.
            this.totalLikes += this.NombreJaime;
          }
          console.log(this.NombreJaime);
          const isFavorite = localStorage.getItem(`favoriteStatus_${bien.id}`);
          if (isFavorite === 'true') {
            this.favoriteStatus[bien.id] = true;
          } else {
            this.favoriteStatus[bien.id] = false;
          }
    
          // Vérifiez si toutes les requêtes sont terminées.
          // if (this.favoritedPropertiesCount1.length === this.bienImmo.length) {
            console.log('Total Likes:', this.totalLikes);
            console.log(this.bienImmo);
            console.log(this.agence);
            console.log(this.bienImmoAgence);
            console.log(this.NombreBienAgence);
            console.log(this.bienImmoAgent);
          // }
        });
      });
    });
    

    //AFFICHER LA LISTE DES AGENTS EN FONCTION DE L'ID DE AGENCE
    this.serviceAgence.AfficherListeAgentParAgence(this.id).subscribe(data => {
      this.agent = data.agents.reverse();
      this.NombreAgent = data.agents.length;
      console.log(this.agent);
    })

    //AFFICHER LA LISTE DES BIENS IMMO
    this.serviceBienImmo.AfficherLaListeBienImmo().subscribe(data => {
      // this.bienImmo = data.biens;
      this.NombreTotalBien = data?.length;
      // console.log(this.bienImmo);
      console.log(this.NombreTotalBien);
      const tauxActivite = (this.NombreBienAgence * 100) / this.NombreTotalBien;
      // Arrondir le résultat à deux décimales et le stocker en tant que nombre
      // Arrondir le résultat à l'entier supérieur
      this.TauxActivite = Math.ceil(tauxActivite);
      console.log(this.TauxActivite);
    }
    );



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
  //FORMATER LE PRIX
  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS BIEN
  goToDettailBien(id: number) {
    console.log(id);
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

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS AGENT
  goToDettailAgent(id: number) {
    console.log(id);
    return this.routerr.navigate(['details-agent', id])
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE CONVERSATION SI TU ES CONNECTE DANS LE CAS CONTRAIRE LOGIN
  ContacterOrLogin(id: any) {
    const user = this.storageService.getUser();
    if (user && user.token) {
      // Définissez le token dans le service serviceUser
      this.serviceUser.setAccessToken(user.token);

      // Appelez la méthode ACCEPTERCANDIDATUREBIEN() avec le contenu et l'ID
      this.serviceBienImmo.OuvrirConversation(id).subscribe({
        next: (data) => {
          console.log("Conversation ouverte avec succès:", data);
          this.routerr.navigate([routes.messages]);
          // this.isSuccess = true;
          // this.errorMessage = 'Conversation ouverte avec succès';
          // this.pathConversation();
        },
        error: (err) => {
          console.error("Erreur lors de l'ouverture de la conversation:", err);
          this.errorMessage = err.error.message;
          // this.isError = true
          // Gérez les erreurs ici
        }
      }
      );
    } else {
      console.error("Token JWT manquant");
      this.routerr.navigateByUrl("/auth/connexion")
    }
    // if (this.storageService.isLoggedIn()) {
    //   this.router.navigate([routes.messages]);
    // } else {
    //   this.router.navigateByUrl("/auth/connexion")
    // }
  }

}
