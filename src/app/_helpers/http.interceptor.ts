import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../service/auth/auth.service';
import { Router } from '@angular/router';
import { StorageService } from '../service/auth/storage.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,    private router: Router,    private storageService: StorageService

    ) { } // Injectez le service d'authentification

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Ajouter le token JWT à l'en-tête de la requête
    let token = localStorage.getItem('token');
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Gérer les erreurs HTTP et les erreurs d'expiration du token JWT
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // console.log('Le token JWT a expiré');
          this.authService.logout().subscribe({
            next: res => {
              // console.log(res);
              this.storageService.clean();
              // this.router.navigateByUrl("/auth/connexion")
              this.router.navigate(['/auth/connexion']).then(() => {
                // window.location.reload();
              })
            },
            error: err => {
              // console.log(err);
            }
          });
        } else if (error.error === 'Veuillez vous connecter pour accéder à cette ressources') {
          // Déconnecter l'utilisateur en cas d'expiration du token JWT
          this.authService.logout();
          console.log('Le token JWT a expiré');
        }
        return throwError(error);
      })
    );
  }

}
