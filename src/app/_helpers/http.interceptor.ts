import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, interval, throwError } from 'rxjs';
import { catchError, startWith, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../service/auth/auth.service';
import { Router } from '@angular/router';
import { StorageService } from '../service/auth/storage.service';
import { environment } from '../environments/environment';
const URL_BASE: string = environment.Url_BASE
import { CookieService } from 'ngx-cookie-service'; // Importez le service CookieService


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  users: any;

  constructor(private authService: AuthService, private router: Router,  private storageService: StorageService ,
    private storagservice:StorageService, private cookieService: CookieService
  ) {
    this.users=storagservice?.getUser().token
  
    if (this.users) { // Vérifiez si le token utilisateur est défini
      // Vérifiez la validité du token toutes les 30 secondes
      interval(86400000).pipe(
        startWith(0),
        switchMap(() => this.authService.voirTokenValidite(this.users))
      ).subscribe(
        data => {
         if(!data.status){
          this.authService.logout().subscribe({
            next: res => {
              this.storageService.clean();
              // this.router.navigateByUrl("/auth/connexion")
              this.router.navigate(['/auth/connexion']).then(() => {
                window.location.reload();
              })
            },
            error: err => {
            }
          }
          );
        }
        }
        
      );
    }
  }
  
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
    
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) { // Si le statut de l'erreur est 401 (non autorisé)
         
            // Vérifiez la validité du token
          if(this.users){

            this.authService.voirTokenValidite(this.users).subscribe(
              data => {
                if(!data.status){
                  this.authService.logout().subscribe({
                    next: res => {
                      this.storageService.clean();
                      // this.router.navigateByUrl("/auth/connexion")
                      this.router.navigate(['/auth/connexion']).then(() => {
                        window.location.reload();
                      })
                    },
                    error: err => {
                    }
                  }
                  );
                }
              }
              
            );
          }
          }
          return throwError(error);
        })
      );
      
    }


    intercept2(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // Vérifiez si la requête est la requête de connexion
      if (req.url === URL_BASE + '/auth/signin') {
        // Interceptez la réponse
        return next.handle(req).pipe(
          tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              // Accédez au cookie de session dans les en-têtes de réponse
              const cookie = event.headers.get('Set-Cookie');
  
              // Stockez le cookie dans le service de stockage approprié (par exemple, localStorage ou un service de gestion des cookies dédié)
              this.cookieService.set('session_cookie', cookie);
            }
          })
        );
      }
  
      // Passez la requête au prochain intercepteur ou au gestionnaire
      return next.handle(req);
    }
    
}
