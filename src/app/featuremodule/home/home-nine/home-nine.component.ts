import { Component, Inject, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { routes } from 'src/app/core/helpers/routes/routes';
import { DataService } from 'src/app/service/data.service';
import * as AOS from 'aos';
import { CommoditeService } from 'src/app/service/commodite/commodite.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { BienImmo } from 'src/app/modele/bien-immo';
import { MatTableDataSource } from '@angular/material/table';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { environment } from 'src/app/environments/environment';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-home-nine',
  templateUrl: './home-nine.component.html',
  styleUrls: ['./home-nine.component.scss']
})

export class HomeNineComponent {
  public routes = routes;
  public listing: any = [];
  public Bookmark: any = [];
  public managementcomponies: any = [];
  public hoildayCabin: any = [];
  public bestrooms: any = [];
  public recentproperties: any = [];
  public ourtestimonials: any = [];
  public recentarticle: any = [];

  currentImageIndex = 0;
  carouselImages = [
    './assets/img/banner/bamako-slider.jpg',
    './assets/img/banner/immo.jpg',
    './assets/img/banner/maison.jpg'
  ];

  changeImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.carouselImages.length;
  }

  commodite: any
  isLocataire = false;
  roles: string[] = [];
  agence: any
  adresse: any
  region: any
  commune: any
  typebien: any
  bienImmo: any;
  BienLoueRecens: any
  searchInputCategory: any;
  public categories: any = [];
  categoriesDataSource = new MatTableDataSource();
  selectedCategory: any = '';
  nombreAgence: number = 0
  nombreZone: number = 0
  isLoggedIn = false;
  NombreJaime: number = 0
  isLoginFailed = true;
  errorMessage: any = '';
  nombreBienLoue: number = 0
  nombreBienVendre: number = 0
  valuesSelect: any = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  locale!: string;
  imagesCommunes = ['commune1.jpeg', 'commune2.png', 'commune3.jpg', 'commune4.jpg', 'commune5.jpeg', 'commune6.jpeg'];

  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO + '/uploads/images/';
    return baseUrl + photoFileName;
  }

  constructor(
    private DataService: DataService,
    private router: Router,
    private storageService: StorageService,
    private serviceCommodite: CommoditeService,
    @Inject(LOCALE_ID) private localeId: string,
    private serviceBienImmo: BienimmoService,
    private serviceUser: UserService
  ) {
    this.locale = localeId;

    (this.listing = this.DataService.listing),
      (this.managementcomponies = this.DataService.managementcomponies),
      (this.hoildayCabin = this.DataService.hoildayCabin),
      (this.bestrooms = this.DataService.bestrooms),
      (this.recentproperties = this.DataService.recentproperties),
      (this.ourtestimonials = this.DataService.ourtestimonials),
      (this.Bookmark = this.DataService.bookmarkList),
      (this.recentarticle = this.DataService.recentarticle)
  }
  searchCategory(value: any): void {
    const filterValue = value;
    this.categoriesDataSource.filter = filterValue.trim().toLowerCase();
    this.categories = this.categoriesDataSource.filteredData;
  }
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
  public managementcomponiesOwlOptions: OwlOptions = {
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
        items: 5,
        loop: true
      }
    },
    nav: false,
  };
  public hoildayCabinOwlOptions: OwlOptions = {
    margin: 24,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
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
        items: 1
      },
      1170: {
        items: 1,
        loop: false
      }
    },
    nav: true,
  };
  public bestroomsOwlOptions: OwlOptions = {
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
  public recentpropertiesOwlOptions: OwlOptions = {
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
        items: 2
      },
      1170: {
        items: 1,
        loop: true
      }
    },
    nav: false,
  };
  public ourtestimonialsOwlOptions: OwlOptions = {
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
        items: 1,
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
        items: 3
      },
      1170: {
        items: 1,
        loop: true
      }
    },
    nav: false,
  };

  // IMAGE PAR DEFAUT DES BIENS
  DEFAULT_IMAGE_URL = 'assets/img/gallery/gallery1/gallery-1.jpg';

  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }

  favoriteStatus: { [key: string]: boolean } = {};
  favoritedPropertiesCount1: { [bienId: number]: number } = {};
  toggleFavorite(bienId: number) {
    this.favoriteStatus[bienId] = !this.favoriteStatus[bienId];

    // Mettez à jour le nombre de favoris pour le bien immobilier actuel
    if (this.favoriteStatus[bienId]) {
      this.favoritedPropertiesCount1[bienId]++;
    } else {
      this.favoritedPropertiesCount1[bienId]--;
    }

    // Vous pouvez également ajouter ici la logique pour enregistrer l'état du favori côté serveur si nécessaire.
  }



  ngOnInit(): void {
    setInterval(() => {
      this.changeImage();
    }, 3000); // Changez d'image toutes les 5 secondes (5000 ms)

    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().user.role;
      console.log(this.roles);
      if (this.roles[0] == "ROLE_LOCATAIRE") {
        this.isLocataire = true
      }
      // this.roles = this.storageService.getUser().roles;
    } else if (!this.storageService.isLoggedIn()) {
      this.isLoginFailed = false;
    }

    AOS.init({ disable: 'mobile' }
    );
    //AFFICHER LA LISTE DES COMMODITES
    this.serviceCommodite.AfficherLaListeCommodite().subscribe(data => {
      this.commodite = data.commodite;
      this.adresse = data;
      this.region = data.region;
      this.nombreZone = data.region.length;
      this.commune = data.commune;
      this.typebien = data.type;
      console.log(this.commodite);
    });


    //AFFICHER LA LISTE DES BIENS IMMO LES PLUS VUS
    this.serviceBienImmo.AfficherLaListeBienImmo().subscribe(data => {
      this.bienImmo = [data.biens.reverse()[0], data.biens.reverse()[1], data.biens.reverse()[2], data.biens.reverse()[3], data.biens.reverse()[4], data.biens.reverse()[5]];
      console.log(this.bienImmo);
      // Suppose que BienImo est un élément de votre bienImmo
      // Initialisation de favoritedPropertiesCount pour tous les biens immobiliers avec zéro favori.
      this.bienImmo.forEach((bien: { id: string | number; }) => {
        this.serviceBienImmo.ListeAimerBienParId(bien.id).subscribe(data => {
          this.NombreJaime = data.vues;
          if (typeof bien.id === 'number') {
            this.favoritedPropertiesCount1[bien.id] = this.NombreJaime;
          }
          console.log(this.NombreJaime)
          // Charger l'état de favori depuis localStorage
          const isFavorite = localStorage.getItem(`favoriteStatus_${bien.id}`);
          if (isFavorite === 'true') {
            this.favoriteStatus[bien.id] = true;
          } else {
            this.favoriteStatus[bien.id] = false;
          }
        })
      });
      
      console.log(data);
      console.log(data.biens.length);
    }
    );
    //AFFICHER LA LISTE DES AGENCES
    this.serviceUser.AfficherLaListeAgence().subscribe(data => {
      this.agence = data.agences.reverse();
      this.nombreAgence = data.agences.length;
      console.log(this.nombreAgence);
      console.log(this.agence);
    }
    );

    //AFFICHER LA LISTE DES BIENS IMMO RECENTS A LOUER
    this.serviceBienImmo.AfficherLaListeBienImmoRecentAlouer().subscribe(data => {
      // for (let index = 0; index < 4; index++) {
      //   this.BienLoueRecens.push(data.biens.reverse()[index])
      // }
      //this.BienLoueRecens.push(data.biens.reverse()[index])
      this.nombreBienLoue = data.biens.length;
      this.BienLoueRecens = [data.biens.reverse()[0], data.biens.reverse()[1], data.biens.reverse()[2], data.biens.reverse()[3]]
      console.log(this.BienLoueRecens);
      console.log(data.biens);
      console.log(this.nombreBienLoue);
    }
    );
    //AFFICHER LA LISTE DES BIENS IMMO RECENTS A LOUER
    this.serviceBienImmo.AfficherLaListeBienImmoAvendre().subscribe(data => {
      this.nombreBienVendre = data.biens.length;
      console.log(this.nombreBienVendre);
      console.log(data.biens);


    }
    )
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
  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS BIEN
  goToDettailBien(id: number) {
    console.log(id);
    return this.router.navigate(['pages/service-details', id])
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS BIEN EN FONCTION D'UNE COMMUNE
  goToDettailCommune(id: number) {
    console.log(id);
    return this.router.navigate(['bienparcommune', id])
  }
  //FORMATER LE PRIX
  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE AJOUTER BIEN SI TU ES CONNECTE DANS LE CAS CONTRAIRE LOGIN
  AjouterBienOrLogin() {
    if (this.storageService.isLoggedIn()) {
      this.router.navigateByUrl("/userpages/ajouter-propriete")
    } else {
      this.router.navigateByUrl("/auth/connexion")
    }
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE CONVERSATION SI TU ES CONNECTE DANS LE CAS CONTRAIRE LOGIN
  ContacterAgenceOrLogin(id: any) {
    const user = this.storageService.getUser();
    if (user && user.token) {
      // Définissez le token dans le service serviceUser
      this.serviceUser.setAccessToken(user.token);

      // Appelez la méthode ACCEPTERCANDIDATUREBIEN() avec le contenu et l'ID
      this.serviceBienImmo.OuvrirConversation(id).subscribe({
        next: (data) => {
          console.log("Conversation ouverte avec succès:", data);
          this.router.navigate([routes.messages]);
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
      this.router.navigateByUrl("/auth/connexion")
    }
    // if (this.storageService.isLoggedIn()) {
    //   this.router.navigate([routes.messages]);
    // } else {
    //   this.router.navigateByUrl("/auth/connexion")
    // }
  }
}
