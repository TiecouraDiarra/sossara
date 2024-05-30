import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
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
import { MessageService } from 'src/app/service/message/message.service';
import { Chat } from '../../userpages/message/models/chat';
import { Message } from '../../userpages/message/models/message';
import { AdresseService } from 'src/app/service/adresse/adresse.service';
import { ApexChart, ApexLegend, ApexNonAxisChartSeries, ApexPlotOptions, ApexResponsive, ChartComponent } from 'ng-apexcharts';

const URL_PHOTO: string = environment.Url_PHOTO;


export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  legend: ApexLegend;
};

export type ChartOptionsA = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
};

@Component({
  selector: 'app-detailsagence',
  templateUrl: './detailsagence.component.html',
  styleUrls: ['./detailsagence.component.css']
})
export class DetailsagenceComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  // public chartOptions: Partial<ChartOptions> | undefined;
  public chartOptions: ChartOptions;
  public chartOptionsType: ChartOptions;
  public chartOptionsA: ChartOptionsA;
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
  p2: number = 1;
  p3: number = 1;
  errorMessage = '';
  NombreJaime: number = 0
  totalLikes: number = 0
  locale!: string;
  favoriteStatus: { [key: string]: boolean } = {};
  favoritedPropertiesCount1: { [bienId: number]: number } = {};
  id: any
  agence: any
  users: any;
  senderCheck: any;
  chatId: any = sessionStorage.getItem('chatId');
  chat: any;
  chatObj: Chat = new Chat();
  messageObj: Message = new Message('', '', '');
  public chatData: any;
  totalBiensAgents: any[] = [];


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
        items: 3,
        loop: true
      }
    },
    nav: false,
  };

  options: Options = {
    floor: 0,
    ceil: 100,
  };
  commune: any;
  constructor(
    private Dataservice: DataService,
    private serviceBienImmo: BienimmoService,
    private serviceCommodite: CommoditeService,
    private serviceAgence: AgenceService,
    private serviceAdresse: AdresseService,
    private routerr: Router,
    private route: ActivatedRoute,
    private serviceUser: UserService,
    private chatService: MessageService,
    @Inject(LOCALE_ID) private localeId: string,
    private storageService: StorageService) {
    this.listsidebar = this.Dataservice.listsidebarList,
      this.locale = localeId;

      this.chartOptions = {
        series: [44, 55],
        chart: {
          width: 380,
          type: 'pie'
        },
        labels: ['A louer', 'A vendre'],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }
        ],
        legend: {
          position: 'bottom'
        }
      };

    this.chartOptionsType = {
      series: [44, 55],
      chart: {
        width: 380,
        type: "pie"
      },
      labels: ["Appart", "A vendre"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ],
      legend: {
        position: 'bottom'
      }
      // colors: ['#008FFB', '#00E396']  // Définir les couleurs des sections du graphique
    };

    this.chartOptionsA = {
      series: [44, 55, 67, 83],
      chart: {
        height: 350,
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: "20px"
            },
            value: {
              fontSize: "14px"
            },
            total: {
              show: true,
              label: "Total",
              formatter: function (w) {
                return "249";
              }
            }
          }
        }
      },
      labels: ["Apples", "Oranges", "Bananas", "Berries"]
    };
  }


  ngOnInit(): void {
    this.users = this.storageService.getUser();
    this.senderCheck = this.users.email;

    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
    } else if (!this.storageService.isLoggedIn()) {
      this.isLoginFailed = false;
    }

    //RECUPERER L'ID D'UNE AGENCE
    this.id = this.route.snapshot.params["id"]
    this.serviceAgence.AfficherAgenceParUuId(this.id).subscribe(data => {

      // Parcourir chaque agent
      data.agents.forEach((agent: any) => {
        // Ajouter les biens immobiliers de l'agent à la liste totale
        this.totalBiensAgents.push(...agent.bienImmosAgents);
      });

      // Maintenant, totalBiensAgents contient la liste totale des biens immobiliers de tous les agents

      this.agence = data?.agence;
      this.bienImmoAgence = data?.bienImmos;
      this.agent = data?.agents.reverse();

      this.NombreAgent = this.agent.length;
      this.bienImmo = [...this.bienImmoAgence, ...this.totalBiensAgents];
      console.log(this.bienImmo);

      this.NombreBienAgence = this.bienImmo.length;


      // Initialisez une variable pour stocker le nombre total de "J'aime".
      // let totalLikes = 0;
      // console.log(this.bienImmo);

      this.bienImmo.forEach((bien: { favoris: any; id: string | number; }) => {
        // this.serviceBienImmo.ListeAimerBienParId(bien.id).subscribe(data => {
        this.NombreJaime = bien.favoris.length;
        if (typeof bien.id === 'number') {
          this.favoritedPropertiesCount1[bien.id] = this.NombreJaime;
          // Ajoutez le nombre de "J'aime" au total.
          this.totalLikes += this.NombreJaime;
        }
        const isFavorite = localStorage.getItem(`favoriteStatus_${bien.id}`);
        if (isFavorite === 'true') {
          this.favoriteStatus[bien.id] = true;
        } else {
          this.favoriteStatus[bien.id] = false;
        }
        // })
      });
    });



    //AFFICHER LA LISTE DES BIENS IMMO
    this.serviceBienImmo.AfficherLaListeBienImmoTotal().subscribe(data => {
      // this.bienImmo = data.biens;
      this.NombreTotalBien = data?.length;

      const tauxActivite = (this.NombreBienAgence * 100) / this.NombreTotalBien;
      // Arrondir le résultat à deux décimales et le stocker en tant que nombre
      // Arrondir le résultat à l'entier supérieur
      this.TauxActivite = Math.round(tauxActivite);
    }
    );

    //AFFICHER LA LISTE DES COMMUNES
    this.serviceAdresse.AfficherListeCommune().subscribe((data) => {
      this.commune = data;
    });


  }
  selectedTab: string = 'tout'; // Déclaration de la variable selectedTab avec la valeur par défaut 'home'

  // Méthode pour changer l'onglet sélectionné
  changeTab(tab: string) {
    this.selectedTab = tab;
  }

  // Méthode pour vérifier si un onglet est actif
  isTabActive(tab: string): boolean {
    return this.selectedTab === tab;
  }

  hasRole(bien: any, roleName: string): boolean {
    return bien?.utilisateur?.roles?.some((role: { name: string }) => role.name === roleName);
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

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS AGENT
  goToDettailAgent(id: number) {
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

}
