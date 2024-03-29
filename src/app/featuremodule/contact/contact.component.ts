import { Component, OnInit } from '@angular/core';
import { routes } from 'src/app/core/helpers/routes/routes';
import { NgForm } from '@angular/forms';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import * as L from 'leaflet';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent {
  public routes = routes;
  currentImageIndex = 0;
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

  constructor() { }

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
    const latitude = 12.63671;
    const longitude = -8.03041;

    const map = L.map('map').setView([latitude, longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Créer une icône personnalisée pour le marqueur
    var customIcon = L.icon({
      iconUrl: 'assets/img/iconeBien/localite.png',
      iconSize: [60, 60], // Taille de l'icône [largeur, hauteur]
      iconAnchor: [19, 38], // Point d'ancrage de l'icône [position X, position Y], généralement la moitié de la largeur et la hauteur de l'icône
      popupAnchor: [0, -38] // Point d'ancrage du popup [position X, position Y], généralement en haut de l'icône
    });

    // Créer une instance de L.Marker avec l'icône personnalisée
    var marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map)
      .bindPopup('African Wealths Development') // Ajouter une popup au marqueur
      .openPopup(); // Ouvrir la popup par défaut
  }
}
