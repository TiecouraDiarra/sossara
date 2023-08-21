import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../service/auth/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   req = req.clone({
  //     withCredentials: true,
  //   });

  //   return next.handle(req);
  // }
  constructor(private authService: AuthService,public router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Vérifiez si le token JWT a expiré
    // if (this.authService.isTokenExpired()) {
      // Token expiré, déconnectez l'utilisateur et redirigez-le vers la page de connexion
      // this.authService.logout();
      // Redirection vers la page de connexion
      // Utilisez la route de votre page de connexion
      // this.router.navigate(['/auth/connexion']);
      // return throwError('Token expired, user logged out.');
    // }

    // Si le token n'a pas expiré, poursuivez la requête HTTP
    return next.handle(request).pipe(
      catchError(error => {
        // Vous pouvez également gérer les erreurs ici
        return throwError(error);
      })
    );
  }
}


// export const httpInterceptorProviders = [
//   { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
// ];