import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { AgenceService } from 'src/app/service/agence/agence.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { DataService } from 'src/app/service/data.service';
import { Chat } from '../../userpages/message/models/chat';
import { Message } from '../../userpages/message/models/message';
import { MessageService } from 'src/app/service/message/message.service';

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

  users: any;
  senderCheck: any;
  chatId: any = sessionStorage.getItem('chatId');
  chat: any;
  chatObj: Chat = new Chat();
  messageObj: Message = new Message('', '', '');
  public chatData: any;
  NombreTotalBien: any;
  bienImmosAgence: any;
  bienImmoAgenceEtAgents: any;


  constructor(
    private Dataservice: DataService,
    private route: ActivatedRoute,
    private serviceAgence: AgenceService,
    private serviceUser: UserService,
    private routerr: Router,
    private chatService: MessageService,
    @Inject(LOCALE_ID) private localeId: string,
    private storageService: StorageService,
    private serviceBienImmo: BienimmoService
  ) {
    this.locale = localeId;
    this.mapList = this.Dataservice.mapList;
    this.Bookmarksdata = this.Dataservice.Bookmarksdata


  }
  ngOnInit(): void {
    this.users = this.storageService.getUser();
    this.senderCheck = this.users.email;

    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
    } else if (!this.storageService.isLoggedIn()) {
      this.isLoginFailed = false;
    }
    //RECUPERER L'ID D'UNE AGENT
    this.id = this.route.snapshot.params["id"]
    //AFFICHER LA LISTE DES BIENS IMMO
    this.serviceAgence.AfficherAgentParId(this.id).subscribe(data => {
      // Initialiser une liste pour stocker tous les biens immobiliers des agents
      let totalBiensAgents: any[] = [];
      
      this.agent = data?.agent;
       // Parcourir chaque agent
       data.agent.agents.forEach((agent: any) => {
        // Ajouter les biens immobiliers de l'agent à la liste totale
        totalBiensAgents.push(...agent.bienImmosAgent);
      });
      this.bienImmosAgence = data?.agent?.bienImmosAgence;
      this.bienImmo = data?.bienImmos;
      this.NombreBienAgent = data?.bienImmos?.length;
      this.bienImmoAgenceEtAgents = [...this.bienImmosAgence, ...totalBiensAgents];
      
      this.NombreBienAgence = this.bienImmoAgenceEtAgents.length;
      const tauxActivite = (this.NombreBienAgent * 100) / this.NombreBienAgence;
      // Arrondir le résultat à deux décimales et le stocker en tant que nombre
      // Arrondir le résultat à l'entier supérieur
      this.TauxActivite = Math.round(tauxActivite);
      // Initialisation de favoritedPropertiesCount pour tous les biens immobiliers avec zéro favori.
      this.bienImmo.forEach((bien: {
        uuid: any;favoris: any 
}) => {
        // this.serviceBienImmo.ListeAimerBienParId(bien.id).subscribe(data => {
          this.NombreJaime = bien.favoris.length;
          // if (typeof bien.uuid === 'number') {
            this.favoritedPropertiesCount1[bien.uuid] = this.NombreJaime;
            // Ajoutez le nombre de "J'aime" au total.
            this.totalLikes += this.NombreJaime;
          // }
          const isFavorite = localStorage.getItem(`favoriteStatus_${bien.uuid}`);
          if (isFavorite === 'true') {
            this.favoriteStatus[bien.uuid] = true;
          } else {
            this.favoriteStatus[bien.uuid] = false;
          }
        // })
      });
    
    })





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

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE CONVERSATION SI TU ES CONNECTE DANS LE CAS CONTRAIRE LOGIN
  ContacterOrLogin(id: any) {
    const user = this.storageService.getUser();
    if (user && user.token) {
      // Définissez le token dans le service serviceUser
      this.serviceUser.setAccessToken(user.token);

      // Appelez la méthode ACCEPTERCANDIDATUREBIEN() avec le contenu et l'ID
      this.serviceBienImmo.OuvrirConversation(id).subscribe({
        next: (data) => {
          this.routerr.navigate([routes.messages]);
          // this.isSuccess = true;
          // this.errorMessage = 'Conversation ouverte avec succès';
          // this.pathConversation();
        },
        error: (err) => {
          this.errorMessage = err.error.message;
          // this.isError = true
          // Gérez les erreurs ici
        }
      }
      );
    } else {
      this.routerr.navigateByUrl("/auth/connexion")
    }
    // if (this.storageService.isLoggedIn()) {
    //   this.router.navigate([routes.messages]);
    // } else {
    //   this.router.navigateByUrl("/auth/connexion")
    // }
  }

  goToMessage(username: any) {
    this.chatService
      .getChatByFirstUserNameAndSecondUserName(username, this.users.email)
      .subscribe(
        (data) => {
          this.chat = data;

          if (this.chat.length > 0) {
            this.chatId = this.chat[0].chatId;
            sessionStorage.setItem('chatId', this.chatId);
            this.routerr.navigate(['/userpages/messages']);
          } else {
            // Si le tableau est vide, créez une nouvelle salle de chat
            // Si le tableau est vide, créez une nouvelle salle de chat
            this.chatObj['expediteur'] = this.users.email;
            this.chatObj['destinateur'] = username;
            this.chatService.createChatRoom(this.chatObj).subscribe((data) => {
              this.chatData = data;
              this.chatId = this.chatData.chatId;
              sessionStorage.setItem('chatId', this.chatData.chatId);
              this.routerr.navigate(['/userpages/messages']);
            });
          }
        },
        (error) => { }
      );
  }


  goToDettailAgence(id: number) {
    return this.routerr.navigate(['detailsagence', id]);
  }
}
