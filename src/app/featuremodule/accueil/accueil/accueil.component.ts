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
import { AgenceService } from 'src/app/service/agence/agence.service';
import { BlogService } from 'src/app/service/blog/blog.service';
import { AdresseService } from 'src/app/service/adresse/adresse.service';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})

export class AccueilComponent {
  public routes = routes;
  public listing: any = [];
  public Bookmark: any = [];
  public managementcomponies: any = [];
  public hoildayCabin: any = [];
  public bestrooms: any = [];
  public recentproperties: any = [];
  public ourtestimonials: any = [];
  public recentarticle: any = [];
  // options: CountUpOptions = {
  //   duration: 30,
  // };

  currentImageIndex = 0;
  carouselImages = [
    './assets/img/banner/bamako-slider.jpg',
    './assets/img/banner/immo.jpg',
    './assets/img/banner/maison.jpg'
  ];
  statut: any;
  BienLoueRecensTotal: any;
  BienTotal: any;
  BienLoue: any[] = [];
  BienVendre: any[] = [];

  changeImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.carouselImages.length;
  }

  commodite: any
  isLocataire = false;
  roles: string[] = [];
  agence: any[] = []
  adresse: any
  region: any
  commune: any
  typebien: any
  bienImmo: any;
  bienImmoPlusVue: any;
  BienLoueRecens: any[] = []
  searchInputCategory: any;
  public categories: any = [];
  categoriesDataSource = new MatTableDataSource();
  selectedCategory: any = '';
  nombreAgence: number = 0
  nombreZone: number = 0
  isLoggedIn = false;
  NombreJaime: number = 0
  NombreFavory: number = 0
  bienImmoAgent: any;
  bienImmoAgence: any;
  NombreBienParAgence: number = 0
  NombreAgentParAgence: number = 0
  blog: any;
  isLoginFailed = true;
  errorMessage: any = '';
  nombreBienLoue: number = 0
  nombreBienVendre: number = 0
  valuesSelect: any = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  locale!: string;
  imagesCommunes = ['commune1.jpeg', 'commune2.png', 'commune3.jpg', 'commune4.jpg', 'commune5.jpeg', 'commune6.jpeg'];
  public universitiesCompanies: any = []

  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO;
    return baseUrl + photoFileName;
  }


  handleAuthorImageError1(event: any) {
    event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }

  handleBlogImageError(event: any) {
    event.target.src = 'https://img.freepik.com/vecteurs-libre/bloguer-amusant-creation-contenu-streaming-ligne-blog-video-jeune-fille-faisant-selfie-pour-reseau-social-partage-commentaires-strategie-auto-promotion-illustration-metaphore-concept-isole-vecteur_335657-855.jpg';
  }

  constructor(
    private DataService: DataService,
    private router: Router,
    private storageService: StorageService,
    private serviceAdresse: AdresseService,
    private serviceCommodite: CommoditeService,
    private serviceAgence: AgenceService,
    @Inject(LOCALE_ID) private localeId: string,
    private serviceBienImmo: BienimmoService,
    private serviceBlog: BlogService,
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

    this.universitiesCompanies = this.DataService.universitiesCompanies
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
        items: 4,
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
        items: 4,
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
        items: 3,
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
        items: 3,
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
  bienImmoLouer: any[] = [];
  bienImmoVendre: any[] = [];
  favoritedPropertiesCount1: { [bienId: number]: number } = {};
  favoritedPropertiesCount2: { [bienId: number]: number } = {};
  NombreBienCount: { [agenceId: number]: number } = {};
  NombreAgentCount: { [agenceId: number]: number } = {};
  NombreBienLouerCount: { [agenceId: number]: number } = {};
  NombreBienVendreCount: { [agenceId: number]: number } = {};
  NombreVendreParAgence: number = 0;
  NombreLouerParAgence: number = 0;
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

  public universitiesCompaniesOwlOptions: OwlOptions = {
    loop: true,
    margin: 24,
    nav: false,
    autoplay: true,
    smartSpeed: 2000,

    navText: ["<i class='fa-solid fa-angle-left'></i>", "<i class='fa-solid fa-angle-right'></i>"],
    responsive: {
      0: {
        items: 2
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

  ngOnInit(): void {
    setInterval(() => {
      this.changeImage();
    }, 3000); // Changez d'image toutes les 5 secondes (5000 ms)

    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
      // console.log(this.roles);
      if (this.roles[0] == "ROLE_LOCATAIRE") {
        this.isLocataire = true
      }
      // this.roles = this.storageService.getUser().roles;
    } else if (!this.storageService.isLoggedIn()) {
      this.isLoginFailed = false;
    }

    AOS.init({ disable: 'mobile' }
    );
    //AFFICHER LA LISTE DES COMMODITES ANCIEN
    // this.serviceCommodite.AfficherLaListeCommodite().subscribe(data => {
    //   // this.commodite = data.commodite;
    //   this.adresse = data;
    //   // this.region = data.region;
    //   // this.nombreZone = data.region.length;
    //   // this.commune = data.commune.slice(0, 6);
    //   // this.typebien = data.type;
    //   // console.log(this.commune);
    // });

    //AFFICHER LA LISTE DES COMMODITES ANCIEN
    this.serviceCommodite.AfficherListeCommodite().subscribe(data => {
      this.commodite = data;
      // console.log("bbbbbbbbbbbbbbbbbbbb",this.commodite);

    }
    );

    //AFFICHER LA LISTE DES TYPES BIEN IMMO
    this.serviceAdresse.AfficherListeTypeBien().subscribe(data => {
      this.typebien = data;
    }
    );

    //AFFICHER LA LISTE DES STATUTS BIEN IMMO
    this.serviceAdresse.AfficherListeStatutBien().subscribe(data => {
      this.statut = data;
    }
    );

    //AFFICHER LA LISTE DES COMMUNES
    this.serviceAdresse.AfficherListeCommune().subscribe(data => {
      this.commune = data.slice(0, 6);
      console.log("commune de test", this.commune);
    }
    );

    //AFFICHER LA LISTE DES REGIONS
    this.serviceAdresse.AfficherListeRegion().subscribe(data => {
      this.region = data;
      this.nombreZone = data.length;
    }
    );

    //LE NOMBRE DE BIENS LOUES
    // this.serviceBienImmo.NombreBienLouer().subscribe(data => {
    //   this.nombreBienLoue = data.biens;
    //   console.log(this.nombreBienLoue);
    // });

    //LE NOMBRE DE BIENS VENDUS
    // this.serviceBienImmo.NombreBienVendu().subscribe(data => {
    //   this.nombreBienVendre = data.biens;
    //   console.log(this.nombreBienVendre);
    // });

    //AFFICHER LA LISTE DES BIENS IMMO LES PLUS VUS
    this.serviceBienImmo.AfficherLaListeBienImmoPlusVue().subscribe(data => {
      this.bienImmoPlusVue = data;
      this.NombreFavory = data.nombreDeFavoris
      console.log(this.bienImmoPlusVue);
      // console.log(this.NombreFavory);
      // Suppose que BienImo est un élément de votre bienImmo
      // Initialisation de favoritedPropertiesCount pour tous les biens immobiliers avec zéro favori.
      // Parcourir la liste des biens immobiliers
      this.bienImmoPlusVue.forEach((bien: {
        favoris: any; id: string | number;
      }) => {
        // Charger le nombre de "J'aime" pour chaque bien
        // this.serviceBienImmo.ListeAimerBienParId(bien.id).subscribe(data => {
        this.NombreJaime = bien?.favoris?.length;
        if (typeof bien.id === 'number') {
          this.favoritedPropertiesCount1[bien.id] = this.NombreJaime;
        }

        // Charger l'état de favori depuis localStorage
        const isFavorite = localStorage.getItem(`favoriteStatus_${bien.id}`);
        if (isFavorite === 'true') {
          this.favoriteStatus[bien.id] = true;
        } else {
          this.favoriteStatus[bien.id] = false;
        }
        // });
      });

    }
    );

    //AFFICHER LA LISTE DES AGENCES
    this.serviceUser.AfficherLaListeAgence().subscribe(data => {
      // data.forEach((user: any) => {
      //   // Vérifier si le bien est déjà loué
      //   if (user.roles.name.imclude("ROLE_AGENCE")) {
      //     this.agence.push(user);
      //   }
      // })
      data.forEach((user: any) => {
        // Extraire les noms de rôles de l'utilisateur
        const userRoles = user.roles.map((role: { name: any; }) => role.name);

        // Vérifier si le rôle "ROLE_AGENCE" est inclus dans les rôles de l'utilisateur
        if (userRoles.includes("ROLE_AGENCE")) {
          this.agence.push(user);
        }
      });

      // this.agence = data.reverse();
      this.nombreAgence = this.agence?.length;
      // console.log(this.nombreAgence);
      console.log(this.agence);
      // Parcourir la liste des biens immobiliers
      this.agence?.forEach((agence: { id: number; }) => {
        // Charger le nombre de "J'aime" pour chaque bien
        this.serviceAgence.AfficherAgenceParId(agence?.id).subscribe(data => {
          this.bienImmoAgence = data?.bienImmos;
          console.log(this.bienImmoAgence);
          this.bienImmoAgent = data?.agents;
          // Initialiser une liste pour stocker tous les biens immobiliers des agents
          let totalBiensAgents: any[] = [];

          // Parcourir chaque agent
          data.agents.forEach((agent: any) => {
            // Ajouter les biens immobiliers de l'agent à la liste totale
            totalBiensAgents.push(...agent.bienImmosAgents);
          });

          // Maintenant, totalBiensAgents contient la liste totale des biens immobiliers de tous les agents
          console.log(totalBiensAgents);
          console.log(this.bienImmoAgent);

          this.bienImmo = [...this.bienImmoAgence, ...totalBiensAgents];
          this.NombreBienParAgence = this.bienImmo.length;
          this.NombreAgentParAgence = data.agents.length;
          console.log(this.bienImmo);
          // Initialisation des compteurs
          let nombreLouerParAgence = 0;
          let nombreVendreParAgence = 0;

          // Parcourir chaque bien immobilier
          this.bienImmo.forEach((bien: any) => {
            // Vérifier le statut du bien immobilier
            if (bien?.statut?.nom === "A louer") {
              this.bienImmoLouer.push(bien);
              nombreLouerParAgence++;
            } else if (bien?.statut?.nom === "A vendre") {
              this.bienImmoVendre.push(bien);
              nombreVendreParAgence++;
            }
          });
          // Assigner les compteurs
          this.NombreLouerParAgence = nombreLouerParAgence;
          this.NombreVendreParAgence = nombreVendreParAgence;

          console.log('Biens loués Agence:', this.bienImmoLouer);
          console.log('Biens vendus Agence :', this.bienImmoVendre);

          console.log(this.NombreBienParAgence);
          if (typeof agence.id === 'number') {
            this.NombreBienCount[agence.id] = this.NombreBienParAgence;
            this.NombreAgentCount[agence.id] = this.NombreAgentParAgence;
            this.NombreBienLouerCount[agence.id] = this.NombreLouerParAgence;
            this.NombreBienVendreCount[agence.id] = this.NombreVendreParAgence;
          }
        });
      });
    }
    );

    //AFFICHER LA LISTE DES BIENS IMMO RECENTS A LOUER
    this.serviceBienImmo.AfficherLaListeBienImmo().subscribe(data => {
      this.BienLoueRecensTotal = [data.reverse()[0], data.reverse()[1], data.reverse()[2], data.reverse()[3]]
      this.BienLoueRecensTotal.forEach((bien: any) => {
        // Vérifier si le bien est déjà loué
        if (bien.statut.nom === "A louer") {
          this.BienLoueRecens.push(bien);
        }

        // Vérifier si le bien est déjà vendu
        // if (bien.statut.nom === "A vendre") {
        //   this.BienVendreRecens.push(bien);
        // }

        //   // Le reste de votre logique pour traiter les favoris...
      });
      console.log('Biens loués par recemment :', this.BienLoueRecens);
      // this.nombreBienLoue = this.BienLoueRecens.length;
      // this.nombreBienVendre = this.BienVendreRecens.length;
      // this.BienLoueRecens = [data.biens.reverse()[0], data.biens.reverse()[1], data.biens.reverse()[2], data.biens.reverse()[3]]
      // console.log(this.BienLoueRecens);
      // console.log(data.biens);
      // console.log(this.nombreBienLoue);
    }
    );

    //AFFICHER LA LISTE DES BIENS IMMO RECENTS A LOUER
    this.serviceBienImmo.AfficherLaListeBienImmo().subscribe(data => {
      this.BienTotal = data;
      this.BienTotal.forEach((bien: any) => {
        // Vérifier si le bien est déjà loué
        if (bien.statut.nom === "A louer") {
          this.BienLoue.push(bien);
        }

        // Vérifier si le bien est déjà vendu
        if (bien.statut.nom === "A vendre") {
          this.BienVendre.push(bien);
        }

        //   // Le reste de votre logique pour traiter les favoris...
      });
      this.nombreBienLoue = this.BienLoue.length;
      this.nombreBienVendre = this.BienVendre.length;
      // this.BienLoueRecens = [data.biens.reverse()[0], data.biens.reverse()[1], data.biens.reverse()[2], data.biens.reverse()[3]]
      // console.log(this.BienLoueRecens);
      // console.log(data.biens);
      // console.log(this.nombreBienLoue);
    }
    );

    //AFFICHER LA LISTE DES BIENS IMMO RECENTS A VENDRE
    // this.serviceBienImmo.AfficherLaListeBienImmoAvendre().subscribe(data => {
    //   this.nombreBienVendre = data.biens.length;
    //   // console.log(this.nombreBienVendre);
    //   // console.log(data.biens);
    // }
    // )

    //AFFICHER LA LISTE DES BLOGS
    this.serviceBlog.AfficherLaListeBlog().subscribe(data => {
      this.blog = data;
      console.log("blog", this.blog);
    });
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
          // console.log("Bien aimé avec succès:", data);

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
          //AFFICHER LA LISTE DES BIENS IMMO LES PLUS VUS
          this.serviceBienImmo.AfficherLaListeBienImmoPlusVue().subscribe(data => {
            this.bienImmoPlusVue = data;
            this.NombreFavory = data.nombreDeFavoris
            console.log(this.bienImmoPlusVue);
            // console.log(this.NombreFavory);
            // Suppose que BienImo est un élément de votre bienImmo
            // Initialisation de favoritedPropertiesCount pour tous les biens immobiliers avec zéro favori.
            // Parcourir la liste des biens immobiliers
            this.bienImmoPlusVue.forEach((bien: {
              favoris: any; id: string | number;
            }) => {
              // Charger le nombre de "J'aime" pour chaque bien
              // this.serviceBienImmo.ListeAimerBienParId(bien.id).subscribe(data => {
              this.NombreJaime = bien?.favoris?.length;
              if (typeof bien.id === 'number') {
                this.favoritedPropertiesCount1[bien.id] = this.NombreJaime;
              }

              // Charger l'état de favori depuis localStorage
              const isFavorite = localStorage.getItem(`favoriteStatus_${bien.id}`);
              if (isFavorite === 'true') {
                this.favoriteStatus[bien.id] = true;
              } else {
                this.favoriteStatus[bien.id] = false;
              }
              // });
            });

          }
          );
        },
        error => {
          // console.error("Erreur lors du like :", error);
          // Gérez les erreurs ici
        }
      );
    } else {
      console.error("Token JWT manquant");
    }
  }
  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS BIEN
  goToDettailBien(id: number) {
    // console.log(id);
    return this.router.navigate(['details-bien', id])
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS BIEN EN FONCTION D'UNE COMMUNE
  goToDettailCommune(id: number) {
    // console.log(id);
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
          // console.log("Conversation ouverte avec succès:", data);
          this.router.navigate([routes.messages]);
          // this.isSuccess = true;
          // this.errorMessage = 'Conversation ouverte avec succès';
          // this.pathConversation();
        },
        error: (err) => {
          // console.error("Erreur lors de l'ouverture de la conversation:", err);
          this.errorMessage = err.error.message;
          // this.isError = true
          // Gérez les erreurs ici
        }
      }
      );
    } else {
      // console.error("Token JWT manquant");
      this.router.navigateByUrl("/auth/connexion")
    }
    // if (this.storageService.isLoggedIn()) {
    //   this.router.navigate([routes.messages]);
    // } else {
    //   this.router.navigateByUrl("/auth/connexion")
    // }
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS AGENCE
  goToDettailAgence(id: number) {
    // console.log(id);
    return this.router.navigate(['detailsagence', id])
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS D'UN BLOG
  goToDettailBlog(id: number) {
    // console.log(id);
    return this.router.navigate(['blog-details', id])
  }

}
