import { Component, OnInit } from '@angular/core';
import { routes } from 'src/app/core/helpers/routes/routes';
import { DataService } from 'src/app/service/data.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Router } from '@angular/router';
import { CommoditeService } from 'src/app/service/commodite/commodite.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { AdresseService } from 'src/app/service/adresse/adresse.service';
import { UserService } from 'src/app/service/auth/user.service';

@Component({
  selector: 'app-apropos',
  templateUrl: './apropos.component.html',
  styleUrls: ['./apropos.component.css']
})
export class AproposComponent implements OnInit {
  public routes = routes;
  public testimonial: any = [];
  bienajouterCommune1: number = 0
  bienajouterCommune: any[] = [];
  commune: any[] = [];
  isLoggedIn2 = false
  nombreDeBiensParCommune: { [communeId: number]: number } = {}; // Déclarez la propriété ici
  // imagesCommunes = ['commune1.jpeg', 'commune2.png', 'commune3.jpg', 'commune4.jpg', 'commune5.jpeg', 'commune6.jpeg'];
  imagesCommunes = [
    '2020-06-17.jpg',
    'hippique.jpg',
    'commune1.jpeg',
    'commune4.jpg',
    '2022-09-26.jpg',
    'commune6.jpeg',
    // 'commune3.jpg',
  ];
  public universitiesCompanies: any = []
  public accountcreation: any = []
  communes: any;
  users: any;
  constructor(
    private DataService: DataService,
    private router: Router,
    private serviceUser: UserService,
    private serviceAdresse: AdresseService,
    private serviceCommodite: CommoditeService
  ) {
    this.testimonial = this.DataService.testimonialList,
      this.universitiesCompanies = this.DataService.universitiesCompanies
    this.accountcreation = this.DataService.accountcreation


  }
  ngOnInit(): void {
    //AFFICHER LA LISTE DES COMMUNES
    this.serviceAdresse.AfficherListeCommune().subscribe((data) => {
      this.communes = data;
      // this.totalzone = this.communes.length;
      this.commune = data.slice(0, 6);
    });
    this.serviceUser.AfficherUserConnecter().subscribe(
      (data) => {
        this.users = data && data.length > 0 ? data[0] : null;
        if (!this.users) {
          window.localStorage.clear();
          return; // Sortir de la méthode si l'utilisateur n'est pas connecté
        }
        if (this.users) {
          this.isLoggedIn2 = true
          // this.AjouterBienOrLogin()
        }
      })
  }
  getNombreBiensPourCommune(communeId: number): number {
    // Vous pouvez mettre en cache les données récupérées du serviceBienImmo
    // ou les récupérer à partir de la réponse du service chaque fois.
    // Supposons que vous avez déjà récupéré les données dans une variable nommée `bienajouterCommune`.

    const communeData = this.bienajouterCommune.find(data => data.communeId === communeId);

    if (communeData) {
      return communeData.nombreDeBiens;
    } else {
      return 0; // Retourne 0 si aucune donnée n'est trouvée pour la commune.
    }
  }

  public testimonialOwlOptions: OwlOptions = {
    loop: true,
    margin: 24,
    nav: true,
    dots: false,
    smartSpeed: 2000,
    navText: ["<i class='fa-solid fa-angle-left'></i>", "<i class='fa-solid fa-angle-right'></i>"],

    responsive: {
      0: {
        items: 1
      },

      550: {
        items: 1
      },
      700: {
        items: 2
      },
      1000: {
        items: 2
      }
    }
  }
  public universitiesCompaniesOwlOptions: OwlOptions = {
    loop: true,
    margin: 24,
    nav: false,
    autoplay: true,
    smartSpeed: 2000,

    navText: ["<i class='fa-solid fa-angle-left'></i>", "<i class='fa-solid fa-angle-right'></i>"],
    responsive: {
      0: {
        items: 1
      },

      550: {
        items: 2
      },
      700: {
        items: 4
      },
      1000: {
        items: 6
      }
    }
  };

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS BIEN EN FONCTION D'UNE COMMUNE
  goToDettailCommune(nomcommune: string) {
    return this.router.navigate(['bienparcommune', nomcommune]);
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE AJOUTER BIEN SI TU ES CONNECTE DANS LE CAS CONTRAIRE LOGIN
  AjouterBienOrLogin() {
    if (this.isLoggedIn2) {
      this.router.navigateByUrl("/userpages/ajouter-bien")
    } else {
      this.router.navigateByUrl("/auth/connexion")
    }
  }
}
