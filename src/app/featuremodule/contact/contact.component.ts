import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { routes } from 'src/app/core/helpers/routes/routes';
import { NgForm } from '@angular/forms';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import * as L from 'leaflet';
import { NavigationEnd, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MessageService } from 'src/app/service/message/message.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  public routes = routes;
  currentImageIndex = 0;
  loading: boolean = false;
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

  constructor(
    private router: Router,
    private serviceMessage: MessageService
  ) { }

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


  //METHODE PERMETTANT D'ENVOYER UN EMAIL
  SendEmail(): void {
    this.loading = true; // Activer le chargement
    const { nom, email, object, description } = this.form;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'swal2-confirm btn',
        cancelButton: 'swal2-cancel btn',
      },
      heightAuto: false,
    });
    if (
      this.form.nom === null ||
      this.form.email === null ||
      this.form.object === null ||
      this.form.description === null
    ) {
      swalWithBootstrapButtons.fire(
        "",
        `<h1 style='font-size: 1em; font-weight: bold; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>Tous les champs sont obligatoires !</h1>`,
        "warning"
      );
    } else {
      swalWithBootstrapButtons
        .fire({
          // title: 'Etes-vous sûre de vous déconnecter?',
          text: "Etes-vous sûre d'envoyer ce message ?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Confirmer',
          cancelButtonText: 'Annuler',
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            // Appelez la méthode ACCEPTERCANDIDATUREBIEN() avec le contenu et l'ID
            this.serviceMessage.sendEmail(nom, email, object, description).subscribe({
              next: (data) => {
                if (data.status) {
                  let timerInterval = 2000;
                  Swal.fire({
                    position: 'center',
                    text: data.message,
                    title: "Envoie de message",
                    icon: 'success',
                    heightAuto: false,
                    showConfirmButton: false,
                    confirmButtonColor: '#e98b11',
                    showDenyButton: false,
                    showCancelButton: false,
                    allowOutsideClick: false,
                    timer: timerInterval,
                    timerProgressBar: true,
                  }).then(() => {
                    this.form.nom = '';
                      this.form.email = '';
                      this.form.object = '';
                      this.form.description = '';
                      this.loading = false; // Désactiver le chargement après l'envoi réussi
                  });
                } else {
                  Swal.fire({
                    position: 'center',
                    text: data.message,
                    title: 'Erreur',
                    icon: 'error',
                    heightAuto: false,
                    showConfirmButton: true,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#e98b11',
                    showDenyButton: false,
                    showCancelButton: false,
                    allowOutsideClick: false,
                  }).then((result) => { });
                }
              },
              error: (err) => {
                // Gérez les erreurs ici
              },
            });
          }
        });
    }
  }

}
