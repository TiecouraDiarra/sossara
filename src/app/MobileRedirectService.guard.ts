import { HostListener, Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MobileRedirectService implements CanActivate {
  isMobile = false;

  constructor(private router: Router) {
    // Initialiser la variable isMobile lors de la création du service
    this.isMobile = window.innerWidth <= 767;
  }

  canActivate(): boolean {
    if (!this.isMobile) {
      this.router.navigate(['/userpages/messages']); // Rediriger vers la page 'messages'
      return false; // Empêche la navigation vers 'details-conversation'
    }
    return true; // Autorise la navigation vers 'details-conversation' pour les mobiles
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Mettre à jour isMobile lorsque la fenêtre est redimensionnée
    this.isMobile = event.target.innerWidth <= 767;
  }
}
