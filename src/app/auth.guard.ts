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
        //const isAuthenticated = true; // Remplacez ceci par votre propre logique d'authentification

        if (this.isLoggedIn) {
            return true; // L'utilisateur est autorisé à accéder à la route
        } else {
            // Rediriger l'utilisateur vers une page d'erreur ou de connexion
            this.router.navigate(['/auth/connexion']);
            return false;
        }
    }
}