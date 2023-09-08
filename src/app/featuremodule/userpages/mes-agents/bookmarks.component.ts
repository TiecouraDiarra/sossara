import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { AgenceService } from 'src/app/service/agence/agence.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { DataService } from 'src/app/service/data.service';

const URL_PHOTO: string = environment.Url_PHOTO;


@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.css']
})
export class BookmarksComponent implements OnInit {
  public routes = routes;
  locale!: string;
  isLocataire = false;
  isAgence = false;
  roles: string[] = [];
  public commune = [
    "Commune",
    'Commune 1',
    'Commune 2',
    'Commune 3',
    'Commune 4',
    'Commune 5',
    'Commune 6',
  ];

  public Bookmarksdata: any = []
  public electronics: any = []
  agent: any
  searchText: any;
  nomAgence : any;
  p1: number = 1;

  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO + '/uploads/images/';
    return baseUrl + photoFileName;
  }

  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }



  agentForm: any = {
    nom: null,
    email: null,
    telephone: null,
    adresse: null,
  }

  constructor(
    private dataservice: DataService,
    @Inject(LOCALE_ID) private localeId: string,
    private serviceUser: UserService,
    private storageService: StorageService,
    private agenceService: AgenceService,
  ) {
    this.locale = localeId;
    this.Bookmarksdata = this.dataservice.Bookmarksdata
  }
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      // this.isLoggedIn = true;
      this.roles = this.storageService.getUser().user.role;
      this.nomAgence = this.storageService.getUser().user.username
      console.log(this.roles);
      if (this.roles[0] == "ROLE_LOCATAIRE") {
        this.isLocataire = true
      } else if (this.roles[0] == "ROLE_AGENCE") {
        this.isAgence = true
      }
    }

    //AFFICHER LA LISTE DES BIENS QUI SONT VENDUS EN FONCTION DE L'UTILISATEUR
    this.agenceService.ListeAgentParAgence().subscribe(data => {
      this.agent = data.agents.reverse();
      console.log(this.agent);
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

  //METHODE PERMETTANT D'AJOUTER UN AGENT 
  AjouterAgent(): void {
    const user = this.storageService.getUser();
    if (user && user.token) {
      // Définissez le token dans le service commentaireService
      this.serviceUser.setAccessToken(user.token);

      // Vérifiez que les valeurs sont présentes avant d'appeler AjouterAgent
      if (
        this.agentForm.nom !== null &&
        this.agentForm.email !== null &&
        this.agentForm.telephone !== null &&
        this.agentForm.adresse !== null
      ) {
        // Appelez la méthode AjouterAgent() avec les données du formulaire
        this.agenceService.AjouterAgent(
          this.agentForm.nom,
          this.agentForm.email,
          this.agentForm.telephone,
          this.agentForm.adresse
        ).subscribe(
          (data) => {
            // La réponse de la requête réussie est gérée ici
            console.log("Agent ajouté avec succès:", data);

            // Réinitialisez le formulaire d'ajout d'agent après un succès
            this.agentForm = {
              nom: '',
              email: '',
              telephone: '',
              adresse: ''
            };
          },
          (error) => {
            // Gérez les erreurs ici
            console.error("Erreur lors de l'ajout d'un agent :", error);

            // Affichez un message d'erreur à l'utilisateur si nécessaire
            // this.errorMessage = "Une erreur s'est produite lors de l'ajout de l'agent.";
          }
        );
      } else {
        console.error("Certaines valeurs sont nulles");
      }
    } else {
      console.error("Token JWT manquant");
    }
  }

}
