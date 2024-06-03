import { Component, HostListener, Inject, LOCALE_ID } from '@angular/core';
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
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss'],
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
    './assets/img/banner/maison.jpg',
  ];
  statut: any;
  BienLoueRecensTotal: any;
  BienTotal: any;
  BienLoue: any[] = [];
  BienVendre: any[] = [];
  communes: any;
  cercles: any[] = [];
  communes1: any = [];
  totalzone: any;
  responseData: any;
  isMobile = false;
  profil: any;
  changeImage() {
    this.currentImageIndex =
      (this.currentImageIndex + 1) % this.carouselImages.length;
  }

  commodite: any;
  isLocataire = false;
  roles: string[] = [];
  agence: any[] = [];
  adresse: any;
  region: any;
  cercle: any;
  commune: any;
  typebien: any;
  bienImmo: any;
  bienImmoPlusVue: any;
  BienLoueRecens: any[] = [];
  searchInputCategory: any;
  public categories: any = [];
  categoriesDataSource = new MatTableDataSource();
  selectedCategory: any = '';
  nombreAgence: number = 0;
  nombreZone: number = 0;
  isLoggedIn = false;
  NombreJaime: number = 0;
  NombreFavory: number = 0;
  bienImmoAgent: any;
  bienImmoAgence: any;
  NombreBienParAgence: number = 0;
  NombreAgentParAgence: number = 0;
  blog: any;
  isLoginFailed = true;
  errorMessage: any = '';
  nombreBienLoue: number = 0;
  nombreBienVendre: number = 0;
  valuesSelect: any = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  valuesSelectPrix: any;
  derniersBiens: any[] = [];
  topFavorisBiens: any[] = [];

  locale!: string;
  imagesCommunes = [
    '2020-06-17.jpg',
    'hippique.jpg',
    'commune1.jpeg',
    'commune4.jpg',
    '2022-09-26.jpg',
    'commune6.jpeg',
    // 'commune3.jpg',
  ];
  public universitiesCompanies: any = [];

  hashString(str: string): number {
    let hash = 0;
    if (str.length === 0) {
      return hash;
    }
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO;
    return baseUrl + photoFileName;
  }

  handleAuthorImageError1(event: any) {
    event.target.src =
      'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }

  handleBlogImageError(event: any) {
    event.target.src =
      'https://img.freepik.com/vecteurs-libre/bloguer-amusant-creation-contenu-streaming-ligne-blog-video-jeune-fille-faisant-selfie-pour-reseau-social-partage-commentaires-strategie-auto-promotion-illustration-metaphore-concept-isole-vecteur_335657-855.jpg';
  }

  constructor(
    private DataService: DataService,
    private router: Router,
    private http: HttpClient,
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
      (this.recentarticle = this.DataService.recentarticle);

    this.universitiesCompanies = this.DataService.universitiesCompanies;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 767;
   
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
        items: 1,
      },
      768: {
        items: 3,
      },
      1170: {
        items: 3,
        loop: true,
      },
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
        items: 1,
      },
      768: {
        items: 4,
      },
      1170: {
        items: 3,
        loop: true,
      },
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
        items: 1,
      },
      768: {
        items: 1,
      },
      1170: {
        items: 1,
        loop: false,
      },
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
        items: 1,
      },
      768: {
        items: 4,
      },
      1170: {
        items: 1,
        loop: true,
      },
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
        items: 1,
      },
      768: {
        items: 2,
      },
      1170: {
        items: 3,
        loop: true,
      },
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
        items: 1,
      },
      768: {
        items: 3,
      },
      1170: {
        items: 1,
        loop: true,
      },
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
        items: 1,
      },
      768: {
        items: 3,
      },
      1170: {
        items: 3,
        loop: true,
      },
    },
    nav: false,
  };

  // IMAGE PAR DEFAUT DES BIENS
  DEFAULT_IMAGE_URL = 'assets/img/gallery/gallery1/gallery-1.jpg';

  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src =
      'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
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

    navText: [
      "<i class='fa-solid fa-angle-left'></i>",
      "<i class='fa-solid fa-angle-right'></i>",
    ],
    responsive: {
      0: {
        items: 2,
      },

      550: {
        items: 2,
      },
      700: {
        items: 4,
      },
      1000: {
        items: 6,
      },
    },
  };


  ngOnInit(): void {

    // this.apiUrl = this.BackLien();
    // Maintenant, vous pouvez utiliser this.apiUrl comme URL dans votre composant

    // this.serviceBienImmo.AfficherLaListePrix().subscribe((data) => {
    //   this.valuesSelectPrix = data;
    // });
    setInterval(() => {
      this.changeImage();
    }, 3000); // Changez d'image toutes les 5 secondes (5000 ms)

    if (this.storageService.isLoggedIn()) {
      this.serviceUser.AfficherUserConnecter().subscribe((data) => {
        this.profil = data[0]?.profil;
        if (this.profil == 'LOCATAIRE') {
          this.isLocataire = true
        }
      });
      this.isLoggedIn = true;
    } else if (!this.storageService.isLoggedIn()) {
      this.isLoginFailed = false;
    }

    AOS.init({ disable: 'mobile' });

    //AFFICHER LA LISTE DES COMMODITES ANCIEN
    this.serviceCommodite.AfficherListeCommodite().subscribe((data) => {
      this.commodite = data;
    });

    //AFFICHER LA LISTE DES TYPES BIEN IMMO
    this.serviceAdresse.AfficherListeTypeBien().subscribe((data) => {
      this.typebien = data;
    });

    //AFFICHER LA LISTE DES STATUTS BIEN IMMO
    this.serviceAdresse.AfficherListeStatutBien().subscribe((data) => {
      this.statut = data;
    });

    //AFFICHER LA LISTE DES COMMUNES
    this.serviceAdresse.AfficherListeCommune().subscribe((data) => {
      this.communes = data;
      this.totalzone = this.communes.length;
      this.commune = data.slice(0, 6);
    });

    //AFFICHER LA LISTE DES REGIONS
    this.serviceAdresse.AfficherListeRegion().subscribe((data) => {
      this.region = data;
      this.nombreZone = data.length;
    });
    //AFFICHER LA LISTE DES cercle
    this.serviceAdresse.AfficherListeCercle().subscribe((data) => {
      this.cercle = data;
      this.nombreZone = data.length;
    });

    //LE NOMBRE DE BIENS LOUES
    // this.serviceBienImmo.NombreBienLouer().subscribe(data => {
    //   this.nombreBienLoue = data.biens;

    // });

    //LE NOMBRE DE BIENS VENDUS
    // this.serviceBienImmo.NombreBienVendu().subscribe(data => {
    //   this.nombreBienVendre = data.biens;
    // });

    //AFFICHER LA LISTE DES BIENS IMMO LES PLUS VUS
    this.serviceBienImmo.AfficherLaListeBienImmoPlusVue().subscribe((data) => {
      this.bienImmoPlusVue = data;
      // console.log(this.bienImmoPlusVue);
      this.NombreFavory = data.nombreDeFavoris;

      // Suppose que BienImo est un élément de votre bienImmo
      // Initialisation de favoritedPropertiesCount pour tous les biens immobiliers avec zéro favori.
      // Parcourir la liste des biens immobiliers
      this.bienImmoPlusVue.forEach(
        (bien: { favoris: any; id: string | number }) => {
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
        }
      );
    });

    //AFFICHER LA LISTE DES AGENCES
    this.serviceUser.AfficherLaListeAgence().subscribe((data) => {
      this.agence = data;
    });


    this.serviceBienImmo.trouverTop6BiensRecemmentAjoutes().subscribe((data) => {
      this.BienLoueRecens = data;
      // console.log(this.BienLoueRecens);
    });

    //AFFICHER LA LISTE DES BIENS IMMO RECENTS A LOUER
    this.serviceBienImmo.AfficherLaListeBienImmo().subscribe((data) => {
      this.BienTotal = data;
      this.getDerniersBiens();
      this.getTopFavorisBiens();
      this.BienTotal.forEach((bien: any) => {
        // Vérifier si le bien est déjà loué
        if (bien.statut.nom === 'A louer') {
          this.BienLoue.push(bien);
        }

        // Vérifier si le bien est déjà vendu
        if (bien.statut.nom === 'A vendre') {
          this.BienVendre.push(bien);
        }

        //   // Le reste de votre logique pour traiter les favoris...
      });
      this.nombreBienLoue = this.BienLoue.length;
      this.nombreBienVendre = this.BienVendre.length;
      // this.BienLoueRecens = [data.biens.reverse()[0], data.biens.reverse()[1], data.biens.reverse()[2], data.biens.reverse()[3]]
    });

    //AFFICHER LA LISTE DES BLOGS
    this.serviceBlog.AfficherLaListeBlog().subscribe((data) => {
      this.blog = data;
      
    });
  }

  getDerniersBiens() {
    this.derniersBiens = this.BienTotal
      .sort((a: { dateAjout: string | number | Date; }, b: { dateAjout: string | number | Date; }) => new Date(b.dateAjout).getTime() - new Date(a.dateAjout).getTime())
      .slice(0, 6);
      // console.log("Derniers biens ajoutés :", this.derniersBiens);
  }

  getTopFavorisBiens() {
    this.topFavorisBiens = this.BienTotal
      .sort((a: { nombreFavoris: number; }, b: { nombreFavoris: number; }) => b.nombreFavoris - a.nombreFavoris)
      .slice(0, 6);
      // console.log("Top biens basés sur les favoris :", this.topFavorisBiens);
  }

  // hasRole(roleName: string): boolean {
  //   return this.bienImmoPlusVue.some((role: { name: string; }) => role.name === roleName);
  // }

  //METHODE PERMETTANT D'AIMER UN BIEN
  AimerBien(id: any): void {
    const user = this.storageService.getUser();
    if (user && user.token) {
      // Définissez le token dans le service commentaireService
      this.serviceUser.setAccessToken(user.token);

      // Appelez la méthode AimerBien() avec l'ID
      this.serviceBienImmo.AimerBien(id).subscribe(
        (data) => {
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
          this.serviceBienImmo
            .AfficherLaListeBienImmoPlusVue()
            .subscribe((data) => {
              this.bienImmoPlusVue = data;
              
              this.NombreFavory = data.nombreDeFavoris;
              // Suppose que BienImo est un élément de votre bienImmo
              // Initialisation de favoritedPropertiesCount pour tous les biens immobiliers avec zéro favori.
              // Parcourir la liste des biens immobiliers
              this.bienImmoPlusVue.forEach(
                (bien: { favoris: any; id: string | number }) => {
                  // Charger le nombre de "J'aime" pour chaque bien
                  // this.serviceBienImmo.ListeAimerBienParId(bien.id).subscribe(data => {
                  this.NombreJaime = bien?.favoris?.length;
                  if (typeof bien.id === 'number') {
                    this.favoritedPropertiesCount1[bien.id] = this.NombreJaime;
                  }

                  // Charger l'état de favori depuis localStorage
                  const isFavorite = localStorage.getItem(
                    `favoriteStatus_${bien.id}`
                  );
                  if (isFavorite === 'true') {
                    this.favoriteStatus[bien.id] = true;
                  } else {
                    this.favoriteStatus[bien.id] = false;
                  }
                  // });
                }
              );
            });
        },
        (error) => {}
      );
    } else {
    }
  }
  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS BIEN
  goToDettailBien(id: number) {
    return this.router.navigate(['details-bien', id]);
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS BIEN EN FONCTION D'UNE COMMUNE
  goToDettailCommune(nomcommune: string) {
    return this.router.navigate(['bienparcommune', nomcommune]);
  }
  //FORMATER LE PRIX
  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE AJOUTER BIEN SI TU ES CONNECTE DANS LE CAS CONTRAIRE LOGIN
  AjouterBienOrLogin() {
    if (this.storageService.isLoggedIn()) {
      this.router.navigateByUrl('/userpages/ajouter-bien');
    } else {
      this.router.navigateByUrl('/auth/connexion');
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
          this.router.navigate([routes.messages]);
          // this.isSuccess = true;
          // this.errorMessage = 'Conversation ouverte avec succès';
          // this.pathConversation();
        },
        error: (err) => {
          this.errorMessage = err.error.message;
          // this.isError = true
          // Gérez les erreurs ici
        },
      });
    } else {
      this.router.navigateByUrl('/auth/connexion');
    }
    // if (this.storageService.isLoggedIn()) {
    //   this.router.navigate([routes.messages]);
    // } else {
    //   this.router.navigateByUrl("/auth/connexion")
    // }
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS AGENCE
  goToDettailAgence(id: string) {
    return this.router.navigate(['detailsagence', id]);
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS D'UN BLOG
  goToDettailBlog(id: number) {
    return this.router.navigate(['blog-details', id]);
  }

  onChangeCommodite() {
    if (this.commodite) {
      const commoditeArray = [];
      for (const item of this.commodite) {
        if (item.selected) {
          commoditeArray.push(item.id);
        }
      }
      this.form.commodite = commoditeArray;
    }
  }
  selectedStatut: string | null = null;
  onStatutChange(event: any) {
    this.selectedStatut = event.target.value;
  }
  onChangeRegion(newValue: any) {
    this.cercles = this.cercle.filter(
      (el: any) =>
        el.region.id == newValue.value || el.region.nomregion == newValue.value
    );
    this.cercles.forEach((el: any) => {
      this.form.regionForm = el.region.id;
    });
  }
  onChangeCercle(newValue: any) {
    this.communes1 = this.communes.filter(
      (el: any) =>
        el.cercle.id == newValue.value || el.cercle.nomcercle == newValue.value
    );
    this.communes1.forEach((el: any) => {
      this.form.cercleForm = el.cercle.id;
    });
  }
  onSubmit(form: NgForm): void {
    const {
      commodite,
      type,
      commune,
      nb_piece,
      chambre,
      cuisine,
      toilette,
      regionForm,
      cercleForm,
      statut,
      maxprix,
      minprix,
    } = this.form;

    // Construisez l'URL avec les paramètres de recherche
    const queryParams: { [key: string]: any } = {};
    if (type) queryParams['type'] = type;
    if (statut) queryParams['statut'] = statut;
    if (chambre) queryParams['chambre'] = chambre;
    if (nb_piece) queryParams['nb_piece'] = nb_piece;
    if (toilette) queryParams['toilette'] = toilette;
    if (cuisine) queryParams['cuisine'] = cuisine;
    if (commune) queryParams['commune'] = commune;
    if (cercleForm) queryParams['cercleForm'] = cercleForm;
    if (regionForm) queryParams['regionForm'] = regionForm;
    if (commodite) queryParams['commodite'] = commodite;
    if (regionForm) queryParams['minprix'] = minprix;
    if (commodite) queryParams['maxprix'] = maxprix;
    this.router.navigate(['/trouverbien'], { queryParams });
  }

  form: any = {
    commodite: null,
    type: null,
    commune: null,
    nb_piece: null,
    chambre: null,
    cuisine: null,
    toilette: null,
    statut: null,
    regionForm: null,
    cercleForm: null,
    maxprix: null,
    minprix: null,
  };

  maxprix_values: any = [];

  filterMaxPrix() {
    if (this.form.minprix) {
      this.maxprix_values = this.valuesSelectPrix.filter(
        (item: string) => parseInt(item) > parseInt(this.form.minprix)
      );
    } else {
      this.maxprix_values = this.valuesSelectPrix;
    }
  }
}
