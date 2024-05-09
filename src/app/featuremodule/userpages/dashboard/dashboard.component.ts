import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { routes } from 'src/app/core/helpers/routes/routes';
import { DataService } from 'src/app/service/data.service';
import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexChart,
  ApexXAxis,
  ChartComponent
} from "ng-apexcharts";
import { StorageService } from 'src/app/service/auth/storage.service';
import { AuthService } from 'src/app/service/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { UserService } from 'src/app/service/auth/user.service';
import { MessageService } from 'src/app/service/message/message.service';
import { environment } from 'src/app/environments/environment';
export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  title: ApexTitleSubtitle | any;
  xaxis: ApexXAxis | any;
  dataLabels: | any;
  animations: | any;
  colors: | any;
  toolbar: | any;
  legend: | any;
  markers: | any;
  stroke: | any;
};

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public routes = routes;
  locale!: string;

  User: any
  bienImmo: any;
  bienImmoDejaLoue: any[] = [];
  bienImmoDejaVendu: any[] = [];
  rdv: any;
  rdvUserConnect: any;
  nombrebien: number = 0
  nombreagent: number = 0
  isLocataire = false;
  isAgence = false;
  isProprietaire= false;
  isAgent = false;
  roles: string[] = [];
  bienImmoAgence: any
  bienImmoAgent: any
  bienImmoAgenceTotal: any
  nombreconversation: number = 0
  nombreBienLoue: number = 0
  nombreBienAutre: number = 0
  nombreBienAchete: number = 0
  public somme: number = 0
  nombreCandidatureBienUser: number = 0
  nombreCandidatureAccepter: number = 0
  nombreRdvUser: number = 0
  nombreRdvUserConnect: number = 0
  nombreMessageUser: number = 0
  public dashboarddata: any = []
  public dashboardreview: any = []
  @ViewChild("chart") chart !: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  users: any;
  public chatData: any;
  senderCheck: any;


  constructor(
    private DataService: DataService,
    private authService: AuthService,
    private router: Router,
    private serviceBienImmo: BienimmoService,
    private serviceUser: UserService,
    @Inject(LOCALE_ID) private localeId: string,
    private serviceMessage: MessageService,
    private storageService: StorageService
  ) {
    this.locale = localeId;
    this.chartOptions = {
      series: [
        {
          name: "Series 1",
          data: [80, 50, 30, 40, 100, 20]
        },
        {
          name: 'Series 2',
          data: [20, 30, 40, 80, 20, 80]
        },
        {
          name: 'Series 3',
          data: [44, 76, 78, 13, 43, 10],
        }
      ],
      colors: ['#666666', '#C10037', '#666666'],
      chart: {
        height: 350,
        type: "radar",
        dropShadow: {
          enabled: false,
          blur: 1,
          left: 1,
          top: 1
        },
      },
      dataLabels: {
        enabled: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        },

      },
      legend: {
        show: false,
      },
      markers: {
        size: 0
      },


      stroke: {
        width: 2
      },



      xaxis: {
        categories: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
      },


    };
    this.dashboarddata = this.DataService.dashboarddata
    this.dashboardreview = this.DataService.dashboardreview
    this.User = this.storageService.getUser();

  }
  ngOnInit(): void {
    this.users=this.storageService.getUser()
    this.senderCheck = this.users.email;

    if (this.storageService.isLoggedIn()) {
      // this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
      if (this.roles?.includes("ROLE_LOCATAIRE")) {
        this.isLocataire = true
      } else if (this.roles?.includes("ROLE_AGENCE")) {
        this.isAgence = true
      } else if (this.roles?.includes("ROLE_AGENT")) {
        this.isAgent = true
      } else if (this.roles?.includes("ROLE_PROPRIETAIRE")) {
        this.isProprietaire = true
      }
    }
    this.User = this.storageService.getUser().id;
    const Users = this.storageService.getUser();
    const token = Users.token;
    this.serviceUser.setAccessToken(token);


    this.serviceBienImmo.AfficherBienLoueEtAcheterParUserConnecter().subscribe(data => {
      this.bienImmo = data.reverse();

      // Filtrer les biens immobiliers
      this.bienImmo.forEach((bien: any) => {
        // Vérifier si le bien est déjà loué
        if (bien?.bien?.is_rent === true) {
          this.bienImmoDejaLoue.push(bien);
        }

        //   // Vérifier si le bien est déjà vendu
        if (bien?.bien?.is_sell === true) {
          this.bienImmoDejaVendu.push(bien);
        }

        //   // Le reste de votre logique pour traiter les favoris...
      });
      this.nombreBienLoue = this.bienImmoDejaLoue?.length;
      this.nombreBienAchete = this.bienImmoDejaVendu?.length;
    });
  

    //AFFICHER LA LISTE DES BIENS EN FONCTION DE L'UTILISATEUR CONNECTEE 
    this.serviceBienImmo.AfficherBienImmoParAgenceConnecte().subscribe(data => {
      // this.bienImmo = data.biens.reverse();
      // Initialiser une liste pour stocker tous les biens immobiliers des agents
       let totalBiensAgents: any[] = [];
      this.bienImmoAgence = data?.bienImmos;
      this.nombreagent = data?.agents?.length;

      // Parcourir chaque agent
      data.agents.forEach((agent: any) => {
        // Ajouter les biens immobiliers de l'agent à la liste totale
        totalBiensAgents.push(...agent.bienImmosAgents);
      });
      // Maintenant, totalBiensAgents contient la liste totale des biens immobiliers de tous les agents
    

      this.bienImmoAgenceTotal = [...this.bienImmoAgence, ...totalBiensAgents];
      // this.bienImmoAgence = data.biens_agences;
      // this.bienImmoAgent = data.biens_agents;
      // this.bienImmoAgenceTotal = [...this.bienImmoAgence, ...this.bienImmoAgent];
      this.nombrebien = this.bienImmoAgenceTotal?.length;
      // this.nombrebien = data.agents?.length;
     });

    //AFFICHER LA LISTE DES BIENS EN FONCTION DE L'UTILISATEUR SANS AGENCE
    //FAIT
    this.serviceBienImmo.AfficherBienImmoParUser().subscribe(data => {
      this.nombreBienAutre = data?.length;
      }
    );

    //AFFICHER LA LISTE DES RDV RECU PAR USER CONNECTE
    //FAIT
    this.serviceUser.AfficherLaListeRdv().subscribe(data => {
      this.rdv = data.reverse();
      this.nombreRdvUser = data?.length;
     }
    );


    //AFFICHER LA LISTE DES RDV ENVOYER PAR USER CONNECTE
    //FAIT
    this.serviceUser.AfficherLaListeRdvUserConnecte().subscribe(data => {
      this.rdvUserConnect = data.reverse();
      this.nombreRdvUserConnect = data?.length;
     }
    );

    //AFFICHER LA LISTE DES BIENS LOUES DONT LES CANDIDATURES SONT ACCEPTEES EN FONCTION DES LOCATAIRES
    this.serviceBienImmo.AfficherBienImmoLoueCandidatureAccepter().subscribe(data => {
      this.nombreCandidatureAccepter = data?.length;
      //AFFICHER LA LISTE DES RDV RECU PAR USER CONNECTE
      this.serviceUser.AfficherLaListeRdv().subscribe(data => {
        this.nombreRdvUser = data?.length;
      }
      );

      // Calculer la somme des candidatures et des rendez-vous
      this.somme = this.nombreRdvUser + this.nombreCandidatureBienUser + this.nombreCandidatureAccepter;
    });




    // For getting all the chat list whose ever is logged in.
    this.serviceMessage.getChatByFirstUserNameOrSecondUserName(this.senderCheck).subscribe(data => {
      this.chatData = data;
      this.nombreconversation = this.chatData?.length;
    });
  }

  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO;
    return baseUrl + photoFileName;
  }

  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }

  //METHODE PERMETTANT DE SE DECONNECTER
  logout(): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })
    swalWithBootstrapButtons.fire({
      // title: 'Etes-vous sûre de vous déconnecter?',
      text: "Etes-vous sûre de vous déconnecter?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout().subscribe({
          next: res => {
            this.storageService.clean();
            this.router.navigateByUrl("/auth/connexion")
            // Actualise la page de connexion
            // window.location.reload();
          },
          error: err => {
          }
        });
      }
    })

  }
}
