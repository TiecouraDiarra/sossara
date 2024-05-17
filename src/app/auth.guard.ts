import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { StorageService } from './service/auth/storage.service';

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {

    isLoggedIn = false;
    isLoginFailed = true;

    constructor(
        private router: Router,
        private storageService: StorageService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      // Votre logique de vérification ici (par exemple, vérifier si l'utilisateur est authentifié)
      if (this.storageService.isLoggedIn()) {
        this.isLoggedIn = true;
        // this.roles = this.storageService.getUser().roles;
      } else if (!this.storageService.isLoggedIn()) {
        this.isLoginFailed = false;
      }

      console.log(this.storageService.getUser().roles);
      //const isAuthenticated = true; // Remplacez ceci par votre propre logique d'authentification
      const roles = this.storageService.getUser().roles;

      // Vérifier si l'utilisateur a les rôles requis
      if (
        state.url === '/userpages/ajouter-bien' &&
        !(
          roles.includes('ROLE_ADMIN') ||
          roles.includes('ROLE_PROPRIETAIRE') ||
          roles.includes('ROLE_AGENCE')
        )
      ) {
        // Redirection vers une page d'erreur ou de non autorisation
        window.history.back();
        return false;
      }

         // Vérifier si l'utilisateur a les rôles requis pour "/userpages/modifier-bien/"
         if (state.url.startsWith('/userpages/modifier-bien/') && !(roles.includes('ROLE_ADMIN') || roles.includes('ROLE_PROPRIETAIRE') || roles.includes('ROLE_AGENCE'))) {
            // Redirection vers la page précédente
            window.history.back();
            return false;
        }

      if (this.isLoggedIn) {
        return true; // L'utilisateur est autorisé à accéder à la route
      } else {
        // Rediriger l'utilisateur vers une page d'erreur ou de connexion
        this.router.navigate(['/auth/connexion']);
        return false;
      }
    }
   

    
}