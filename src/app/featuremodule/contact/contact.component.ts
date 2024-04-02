import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { routes } from 'src/app/core/helpers/routes/routes';
import { NgForm } from '@angular/forms';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import * as L from 'leaflet';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  public routes = routes;
  currentImageIndex = 0;
  private map!: L.Map;
  carouselImages = [
    './assets/img/banner/bamako-slider.jpg',
    './assets/img/banner/immo.jpg',
    './assets/img/banner/maison.jpg'
  ];
  form: any = {
    nom: null,
    email: null,
    object: null,
    description: null,
  };

  constructor(private router: Router) { }

  ngOnDestroy(): void {
    // Nettoyer la carte lors de la destruction du composant
    if (this.map) {
      this.map.remove();
    }
  }
  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
    this.initMap();
  }

  private initMap(): void {
    const latitude = 12.63671;
    const longitude = -8.03041;

    this.map = L.map('map').setView([latitude, longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    var customIcon = L.icon({
      iconUrl: 'assets/img/iconeBien/localite.png',
      iconSize: [60, 60],
      iconAnchor: [19, 38],
      popupAnchor: [0, -38]
    });

    var marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(this.map)
      .bindPopup('African Wealths Development')
      .openPopup();
  }

  // Appeler cette méthode lorsque vous entrez dans la page spécifique (par exemple, lorsque le composant est activé)
  enterPage(): void {
    // Vérifier si la carte n'a pas été initialisée
    if (!this.map) {
      this.initMap();
    }
  }

  sendEmail(e: Event): void {

    e.preventDefault();
    emailjs
      .sendForm(
        'service_dybse2w',
        'template_z2uzkbj',
        e.target as HTMLFormElement,
        'mS5zAXiTGMU-FNe5g'
      )
      .then(
        (result: EmailJSResponseStatus) => {
        },
        (error) => {
        }
      );
  }

  ngOnInit(): void {
    
    // Écouter les changements de route
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Vérifier si la nouvelle route est "contact"
        if (this.router.url === '/contact') {
          // Actualiser la page
          window.location.reload();
        }
      }
      if (!this.map) {
        this.initMap();
      }
    });
  }
}
