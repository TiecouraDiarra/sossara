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

  form: any = {
    nom: null,
    email: null,
    object: null,
    description: null,
  };

  constructor() {}

  sendEmail(e: Event): void {
    console.log(e.target);

    e.preventDefault();
    emailjs
      .sendForm(
        'service_jwdiwpt',
        'template_mqzsvla',
        e.target as HTMLFormElement,
        'Y3qbk-_U6k8PqhbOR'
      )
      .then(
        (result: EmailJSResponseStatus) => {
          console.log(result);
        },
        (error) => {
          console.log(error.text);
        }
      );
  }
}
