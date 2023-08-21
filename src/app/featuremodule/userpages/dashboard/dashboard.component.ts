import { Component, OnInit, ViewChild } from '@angular/core';
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
  User: any
  bienImmo: any;
  rdv: any;
  nombrebien: number = 0
  nombreconversation: number = 0
  public somme: number = 0
  nombreCandidatureBienUser: number = 0
  nombreRdvUser: number = 0
  nombreMessageUser: number = 0
  public dashboarddata: any = []
  public dashboardreview: any = []
  @ViewChild("chart") chart !: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  constructor(
    private DataService: DataService,
    private authService: AuthService,
    private router: Router,
    private serviceBienImmo: BienimmoService,
    private serviceUser: UserService,
    private serviceMessage: MessageService,
    private storageService: StorageService
  ) {
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
    console.log(this.User);

  }
  ngOnInit(): void {
    console.log(this.storageService.getUser());
    this.User = this.storageService.getUser().user.id;
    const Users = this.storageService.getUser();
    console.log(this.User);
    const token = Users.token;
    this.serviceUser.setAccessToken(token);


    //AFFICHER LA LISTE DES BIENS PAR UTILISATEUR
    this.serviceBienImmo.AfficherBienImmoParUser().subscribe(data => {
      this.bienImmo = data.biens.reverse();
      this.nombrebien = data.biens.length;
      console.log(this.bienImmo);
    });

    //AFFICHER LA LISTE DES RDV
    this.serviceUser.AfficherLaListeRdv().subscribe(data => {
      this.rdv = data.reverse();
      this.nombreRdvUser = data.length;
      console.log(this.rdv);
    }
    );

    //AFFICHER LA LISTE DES CANDIDATURE PAR USER
    this.serviceUser.AfficherLaListeCandidature().subscribe(data => {
      this.nombreCandidatureBienUser = data.candidature.length;
      // this.nombreRdvUser = data.length;
      console.log(this.nombreCandidatureBienUser);

      // Calculer la somme des candidatures et des rendez-vous
      this.somme = this.nombreRdvUser + this.nombreCandidatureBienUser;
      // console.log( "Somme =",this.somme);

    }
    );

    //AFFICHER LA LISTE DES CONVERSATIONS EN FONCTION DE USER
    this.serviceMessage.AfficherLaListeConversation().subscribe(data => {
      this.nombreconversation = data.conversation.length;
      console.log(this.nombreconversation);
    }
    );
  }

  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO + '/uploads/images/';
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
            console.log(res);
            this.storageService.clean();
            this.router.navigateByUrl("/auth/connexion")
          },
          error: err => {
            console.log(err);
          }
        });
      }
    })

  }
}
