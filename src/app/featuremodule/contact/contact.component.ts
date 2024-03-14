import { Component, OnInit } from '@angular/core';
import { routes } from 'src/app/core/helpers/routes/routes';
import { NgForm } from '@angular/forms';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

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

  constructor() {}

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
}
