import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { AgenceService } from 'src/app/service/agence/agence.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { DataService } from 'src/app/service/data.service';

const URL_PHOTO: string = environment.Url_PHOTO;


declare var google: any;
@Component({
  selector: 'app-detailsagent',
  templateUrl: './detailsagent.component.html',
  styleUrls: ['./detailsagent.component.css'],
})
export class DetailsagentComponent implements OnInit {
  public routes = routes;
  public mapList: any = [];
  bienImmo: any;
  searchText: any
  public Bookmarksdata: any = []
  id: any
  agent: any
  p: number = 1;
  NombreJaime: number = 0
  NombreBienAgent: number = 0
  favoriteStatus: { [key: string]: boolean } = {};
  favoritedPropertiesCount1: { [bienId: number]: number } = {};
  locale!: string;
  isLoggedIn = false;
  isLoginFailed = true;
  errorMessage = '';
  totalLikes: number = 0

  bienImmoAgent: any;
  bienImmoAgence: any;
  test: any;
  bienImmoA: any;
  NombreBienAgence: number = 0;
  TauxActivite: number = 0




  constructor(
    private Dataservice: DataService,
    private route: ActivatedRoute,
    private serviceAgence: AgenceService,
    private serviceUser: UserService,
    private routerr: Router,
    @Inject(LOCALE_ID) private localeId: string,
    private storageService: StorageService,
    private serviceBienImmo: BienimmoService
  ) {
    this.locale = localeId;
    this.mapList = this.Dataservice.mapList;
    this.Bookmarksdata = this.Dataservice.Bookmarksdata


  }
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
    } else if (!this.storageService.isLoggedIn()) {
      this.isLoginFailed = false;
    }
    //RECUPERER L'ID D'UNE AGENT
    this.id = this.route.snapshot.params["id"]
    //AFFICHER LA LISTE DES BIENS IMMO
    this.serviceAgence.AfficherAgentParId(this.id).subscribe(data => {
      console.log(data);
      
      this.agent = data?.agent;
      this.bienImmo = data?.bienImmos;
      this.NombreBienAgent = data?.bienImmos?.length;
      // Initialisation de favoritedPropertiesCount pour tous les biens immobiliers avec zéro favori.
      this.bienImmo.forEach((bien: {favoris: any; id: string | number; }) => {
        // this.serviceBienImmo.ListeAimerBienParId(bien.id).subscribe(data => {
          this.NombreJaime = bien.favoris.length;
          if (typeof bien.id === 'number') {
            this.favoritedPropertiesCount1[bien.id] = this.NombreJaime;
            // Ajoutez le nombre de "J'aime" au total.
            this.totalLikes += this.NombreJaime;
          }
          console.log(this.NombreJaime)
          const isFavorite = localStorage.getItem(`favoriteStatus_${bien.id}`);
          if (isFavorite === 'true') {
            this.favoriteStatus[bien.id] = true;
          } else {
            this.favoriteStatus[bien.id] = false;
          }
        // })
      });
      console.log(this.bienImmo);
      console.log('Total Likes:', this.totalLikes);
      console.log(this.agent);
    })



    //AFFICHER UN AGENT EN FONCTION DE SON ID
    // this.serviceAgence.AfficherUserParId(this.id).subscribe(data => {
    //   this.agent = data.Utilisateurs
    //   console.log(this.agent);
    // })




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

  goToDettailAgence(id: number) {
    // console.log(id);
    return this.routerr.navigate(['detailsagence', id]);
  }
}
