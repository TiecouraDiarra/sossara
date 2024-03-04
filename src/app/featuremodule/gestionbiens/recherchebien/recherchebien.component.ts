import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { CommoditeService } from 'src/app/service/commodite/commodite.service';
import { DataService } from 'src/app/service/data.service';
declare var google: any;

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-recherchebien',
  templateUrl: './recherchebien.component.html',
  styleUrls: ['./recherchebien.component.scss'],
})
export class RecherchebienComponent {
  public routes = routes;
  public mapgrid: any = [];
  public categories: any = [];
  categoriesDataSource = new MatTableDataSource();
  searchInputCategory: any;
  selectedCategory: any = '';
  bienImmo: any;
  bienImmoMap: any;
  commodite: any;
  adresse: any;
  region: any;
  commune: any;
  typebien: any;
  searchText: any;
  selectedType1: any;
  selectedRegion: any;
  selectedCommune: any;
  selectedType: any;
  p: number = 1;
  valuesSelect: any = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  // MAP
  options!: any;
  userPosition: any;
  // overlayse: any[] = [];
  // @Input() searchText: string | undefined;
  overlays: Array<any> = [];
  // Filtrer les marqueurs en fonction de searchText
  //  filteredMarkers = this.overlays;
  public showFilter: boolean = false;
  // Déclaration du tableau de marqueurs
  // markers: google.maps.Marker[] = [];
  infoWindow = new google.maps.InfoWindow();
  //FIN MAP

  // IMAGE PAR DEFAUT DES BIENS
  DEFAULT_IMAGE_URL = 'assets/img/gallery/gallery1/gallery-1.jpg';
  bienImmo1: any;

  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src =
      'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }

  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO;
    return baseUrl + photoFileName;
  }

  //RECHERCHER PAR REGION
  onRegionSelectionChange(event: any) {
    this.selectedRegion = event.value;
  }

  // a fonction de filtrage pour la region et la commune dans MAP
  filterMarkersByCriteria() {
    let filteredOverlays: any[] = this.overlays;

    // Filtrer les marqueurs en fonction de la région sélectionnée
    if (this.selectedRegion !== '' && this.selectedRegion !== 'Tout') {
      filteredOverlays = filteredOverlays.filter(
        (marker) => marker.region === this.selectedRegion
      );
    }

    // Filtrer les marqueurs en fonction de la commune sélectionnée
    if (this.selectedCommune !== '' && this.selectedCommune !== 'Tout') {
      filteredOverlays = filteredOverlays.filter(
        (marker) => marker.commune === this.selectedCommune
      );
    }

    // Filtrer les marqueurs en fonction de la commune sélectionnée
    if (this.selectedType !== '' && this.selectedType !== 'Tout') {
      filteredOverlays = filteredOverlays.filter(
        (marker) => marker.type === this.selectedType
      );
    }

    // Filtrer les marqueurs en fonction du texte de recherche
    if (this.searchText !== '') {
      filteredOverlays = filteredOverlays.filter((marker) =>
        marker.nom.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    // Ajoutez d'autres critères de filtrage ici si nécessaire

    return filteredOverlays;
  }

  //RECHERCHER PAR COMMUNE
  onCommuneSelectionChange(event: any) {
    this.selectedCommune = event.value;
    // Appelez la fonction de filtrage ici pour mettre à jour la carte en fonction de la nouvelle sélection de commune.
    this.filterMarkersByCriteria();
  }

  //RECHERCHER PAR TYPE
  onTypeSelectionChange(event: any) {
    this.selectedType = event.value;
  }
  //FORMATER LE PRIX
  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  constructor(
    private Dataservice: DataService,
    private serviceBienImmo: BienimmoService,
    private router: Router,
    private serviceCommodite: CommoditeService,
    private route: ActivatedRoute
  ) {
    this.mapgrid = this.Dataservice.mapgridList;
    this.categories = this.Dataservice.categoriesList;
    this.categoriesDataSource = new MatTableDataSource(this.categories);
  }

  favoriteStatus: { [key: number]: boolean } = {};
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
  searchCategory(value: any): void {
    const filterValue = value;
    this.categoriesDataSource.filter = filterValue.trim().toLowerCase();
    this.categories = this.categoriesDataSource.filteredData;
  }

  ngOnInit(): void {
    const {
      type,
      statut,
      chambre,
      nb_piece,
      toilette,
      cuisine,
      commune,
      cercleForm,
      regionForm,
      minprix,
      maxprix,
      commodite,
    } = this.route.snapshot.queryParams;
    this.serviceBienImmo
      .faireUneRecherche(
        type,
        statut,
        chambre,
        nb_piece,
        toilette,
        cuisine,
        commune,
        cercleForm,
        regionForm,
        minprix,
        maxprix,
        commodite
      ).subscribe((data) => {
        this.bienImmo1 = data;
        console.log('data this.bienImmo1', this.bienImmo1);
      });

    // Récupérer la position actuelle de l'utilisateur
    navigator.geolocation.getCurrentPosition((position) => {
      this.userPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      // Réinitialiser les options de la carte pour centrer sur la position de l'utilisateur
      this.options = {
        center: this.userPosition,
        zoom: 12,
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      };
      // Ajouter un marqueur pour la position de l'utilisateur
      this.overlays.push(
        new google.maps.Marker({
          position: this.userPosition,
          title: 'Votre position actuelle',
        })
      );
    });
    //AFFICHER LA LISTE DES BIENS IMMO
    

    // Récupérez les données de bien immobilier depuis serviceBienImmo pour afficher sur le map
    this.serviceBienImmo
    .faireUneRecherche(
      type,
      statut,
      chambre,
      nb_piece,
      toilette,
      cuisine,
      commune,
      cercleForm,
      regionForm,
      commodite
    ).subscribe((data) => {
      if (Array.isArray(data)) {
        // Assurez-vous que data.biens est un tableau avant d'appeler map
        this.bienImmoMap = data;
        console.log("dddd", this.bienImmoMap);

        // Convertissez les données de bien immobilier en marqueurs Google Maps
        this.overlays = this.bienImmoMap.map((bien: any) => {
          // Vérifiez si la propriété 'photos' est un tableau non vide
          const imageSrc =
          bien.photos && bien.photos.length > 0 && bien.photos[0].nom
            ? bien.photos[0].nom
            : 'assets/img/gallery/gallery1/gallery-1.jpg';

          return new google.maps.Marker({
            position: {
              lat: bien.adresse.latitude,
              lng: bien.adresse.longitude,
            },
            icon: 'assets/img/icons/marker7.png',
            doc_name: bien.nom,
            address: bien.adresse.quartier,
            amount: bien.prix,
            image: imageSrc,
            regions: bien.adresse.commune.region.nom,
            communes: bien.adresse.commune.nom,
            types: bien.typeImmo.nom,
            statut: bien.statut,
            id: bien.id,
          });
        });
        // Ajoutez un marqueur pour la position de l'utilisateur au début du tableau overlays
        this.overlays.unshift(
          new google.maps.Marker({
            position: this.userPosition,
            title: 'Votre position actuelle',
          })
        );
      } else {
        console.error(
          'Les données de biens immobiliers ne sont pas au format attendu (tableau).'
        );
      }
    });
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS BIEN
  goToDettailBien(id: number) {
    console.log(id);
    return this.router.navigate(['pages/service-details', id]);
  }

  setInfo(event: any) {
    var marker = event.overlay;
    var imageSrc = marker.image
      ? this.generateImageUrl(marker.image)
      : 'assets/img/gallery/gallery1/gallery-1.jpg'; // Remplacez 'chemin/vers/image_par_defaut.jpg' par le chemin de votre image par défaut.
    var content =
      '<div class="profile-widget crd" style="width: 300px; background: url(' +
      imageSrc +
      '); position: relative; padding: 90px 0; background-repeat: no-repeat; background-size: cover; display: inline-block; border-radius: 10px; ">' +
      '<div class="pro-content">' +
      '<h3 class="title">' +
      '<a href="javascript:void(0)">' +
      marker.doc_name +
      '</a>' +
      '</h3>';

    // Utilisation de *ngIf pour conditionner l'affichage en fonction du statut
    if (marker.statut === 'A vendre') {
      content +=
        '<div class="row">' +
        '<div class="col"><span class="Featured-text" style="background-color:#e98b11; font-weight: bold;">' +
        marker.statut +
        '</span></div>' +
        `<div class="col"><p class="blog-category"><a (click)="goToDettailBien(${marker.id})"><span>` +
        marker.types +
        '</span></a></p></div>';
    } else if (marker.statut === 'A louer') {
      content +=
        '<div class="row">' +
        '<div class="col"><span class="Featured-text" style="font-weight: bold;">' +
        marker.statut +
        '</span></div>' +
        '<div class="col"><p class="blog-category"><a href="javascript:void(0)"><span>' +
        marker.types +
        '</span></a></p></div>';
    }

    content +=
      // '<p class="blog-category mt-3"> ' +
      // '<a href="javascript:void(0)">' +
      // '<span>' +
      // marker.types +
      // '</span>' +
      // '</a>' +
      // '</p>' +
      '<ul class="available-info mt-3">' +
      '<li class="mapaddress"><i class="fas fa-map-marker-alt me-2"></i> ' +
      marker.address +
      ', ' +
      marker.regions +
      ' </li>' +
      '<li class="map-amount" style="color: #e98b11;  font-weight: bold;">' +
      this.formatPrice(marker.amount) +
      ' FCFA' +
      // '<span class="d-inline-block average-rating"> (' +
      // marker.total_review +
      // ')</span>' +
      '</li>' +
      '</ul>' +
      '</div>' +
      '</div>';
    this.infoWindow.setContent(content);
    this.infoWindow.open(event.map, event.overlay);
  }
}
