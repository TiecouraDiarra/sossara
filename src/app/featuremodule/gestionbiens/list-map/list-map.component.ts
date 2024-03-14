import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { DataService } from 'src/app/service/data.service';
declare var google: any;


@Component({
  selector: 'app-list-map',
  templateUrl: './list-map.component.html',
  styleUrls: ['./list-map.component.css'],
})
export class ListMapComponent implements OnInit {
  options!: any;
  // @Input() searchText: string | undefined;
  overlays: Array<any> = [];
  // Filtrer les marqueurs en fonction de searchText
  //  filteredMarkers = this.overlays;
  bienImmo: any;
  public showFilter: boolean = false;
  // Déclaration du tableau de marqueurs
  // markers: google.maps.Marker[] = [];
  infoWindow = new google.maps.InfoWindow();

  constructor(
    private Dataservice: DataService,
    private serviceBienImmo: BienimmoService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.options = {
      center: { lat: 12.639232, lng: -7.998184 },
      zoom: 14,
      scrollwheel: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    // Récupérez les données de bien immobilier depuis serviceBienImmo
    // this.serviceBienImmo.AfficherLaListeBienImmo().subscribe(data => {
    //   this.bienImmo = data.biens.reverse();

    // Convertissez les données de bien immobilier en marqueurs Google Maps
    //   this.overlays = this.bienImmo.map((bien: { lat: any; lng: any; doc_name: any; address: any; amount: any; image: any; }) => {
    //     return new google.maps.Marker({
    //       position: { lat: bien.lat, lng: bien.lng }, // Assurez-vous d'utiliser les bonnes propriétés lat et lng
    //       icon: 'assets/img/icons/marker7.png',
    //       doc_name: bien.nom,
    //       address: bien.adresse.quartier,
    //       amount: bien.prix,
    //       image: bien.image,
    //       id: bien.id
    //     });
    //   });
    // });

    this.overlays = [
      new google.maps.Marker({
        position: { lat: 12.6046407, lng: -7.9722873 },
        icon: 'assets/img/icons/marker7.png',
        doc_name: 'Appartement meuble 15/20',
        address: 'Sogoniko, Bamako',
        amount: '100000',
        image: 'assets/img/gallery/gallery1/gallery-1.jpg',
        statut: 'A louer'
      }),
      new google.maps.Marker({
        position: { lat: 12.6153914, lng: -7.9679699 },
        icon: 'assets/img/icons/marker7.png',
        doc_name: 'Magasin a vendre',
        address: 'Magnambougou, Bamako',
        amount: '500000',
        image: 'assets/img/banner/maison.jpg',
        statut: 'A vendre'

      }),
      new google.maps.Marker({
        position: { lat: 12.6162202, lng: -7.9227909 },
        icon: 'assets/img/icons/marker7.png',
        doc_name: 'Villa a vendre',
        address: 'Yirimadjo, Bamako',
        amount: '700000',
        image: 'assets/img/banner/immo.jpg',
        statut: 'A vendre'
      }),
      new google.maps.Marker({
        position: { lat: 12.6254203, lng: -8.0203158 },
        icon: 'assets/img/icons/marker7.png',
        doc_name: 'Maison a vendre',
        address: 'Sebenicoro, Bamako',
        amount: '200000',
        image: 'assets/img/banner/test1.jpg',
        statut: 'A vendre'
      }),
      new google.maps.Marker({
        position: { lat: 12.5861475, lng: -7.9838534 },
        icon: 'assets/img/icons/marker7.png',
        doc_name: 'Villa a louer',
        address: 'Niamakoro, Bamako',
        amount: '400000',
        image: 'assets/img/banner/test2.jpg',
        statut: 'A louer'
      }),
      new google.maps.Marker({
        position: { lat: 12.5232635, lng: -7.9469228 },
        icon: 'assets/img/icons/marker7.png',
        doc_name: 'Magasin à Loué',
        address: 'Senou, Bamako',
        amount: '600000',
        image: 'assets/img/banner/test3.jpg',
        statut: 'A louer'
      }),
      new google.maps.Marker({
        position: { lat: 12.632193, lng: -8.0349542 },
        icon: 'assets/img/icons/marker7.png',
        doc_name: 'Magasin à louer au plein coeur ACI 2000',
        address: 'ACI 2000, Bamako',
        amount: '800000',
        image: 'assets/img/banner/bamako-slider.jpg',
        statut: 'A louer'
      }),
    ];
  }

  //FORMATER LE PRIX
  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }


  setInfo(event: any) {
    var marker = event.overlay;
    var content =
      '<div class="profile-widget" style="width: 300px; background: url(' +
      marker.image +
      '); position: relative; padding: 90px 0; background-repeat: no-repeat; background-size: cover; display: inline-block; border-radius: 10px; ">' +
      '<div class="pro-content">' +
      '<h3 class="title">' +
      '<a href="javascript:void(0)">' +
      marker.doc_name +
      '</a>' +
      '</h3>' ;

      // Utilisation de *ngIf pour conditionner l'affichage en fonction du statut
      if (marker.statut === 'A vendre') {
        content += '<span class="Featured-text" style="background-color:#e98b11; font-weight: bold;">' + marker.statut + '</span>';
      } else if (marker.statut === 'A louer') {
        content += '<span class="Featured-text" style="font-weight: bold;">' + marker.statut + '</span>';
      }
    
      content +=
      '<ul class="available-info mt-3">' +
      '<li class="mapaddress"><i class="fas fa-map-marker-alt me-2"></i> ' +
      marker.address +
      ' </li>' +
      '<li class="map-amount" style="color: #e98b11;  font-weight: bold;">' +
      this.formatPrice(marker.amount) + ' FCFA' +
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

  // createMarkers() {
  //   this.serviceBienImmo.AfficherLaListeBienImmo().subscribe(data => {
  //     this.bienImmo = data.biens.reverse();

  //     this.markers = this.bienImmo.map((bien) => {
  //       return new google.maps.Marker({
  //         position: { lat: bien.latitude, lng: bien.longitude },
  //         icon: 'chemin-vers-votre-icone.png',
  //         doc_name: bien.doc_name,
  //         address: bien.address,
  //         amount: bien.amount,
  //         total_review: bien.total_review,
  //         image: bien.image,
  //       });
  //     });
  //   }
  //   );

  // }

}
