import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, interval, throwError } from 'rxjs';
import { catchError, startWith, switchMap } from 'rxjs/operators';
import { AuthService } from '../service/auth/auth.service';
import { Router } from '@angular/router';
import { StorageService } from '../service/auth/storage.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  users: any;

  constructor(private authService: AuthService, private router: Router,  private storageService: StorageService ,
    private storagservice:StorageService,
  ) {
    this.users=storagservice?.getUser().token
    console.log("je suis l'utilisaruer token",this.users)
  
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
              // console.log(res);
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
            console.log("intercept")
          if(this.users){
            console.log("utilisateur existe")

            this.authService.voirTokenValidite(this.users).subscribe(
              data => {
                console.log("je suis ici et c'est a moi ",data)
                if(!data.status){
                  this.authService.logout().subscribe({
                    next: res => {
                      // console.log(res);
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
    
}
