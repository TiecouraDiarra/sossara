// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// import { StorageService } from './service/auth/storage.service';
// import { UserService } from './service/auth/user.service';
// import { Observable, Subject, of, switchMap, takeUntil } from 'rxjs';

// @Injectable({
//     providedIn: 'root'
// })

// export class AuthGuard implements CanActivate {
//   isLoggedIn = false;
//   users: any;
//   profil: any;
//   private destroy$ = new Subject<void>();
//   completer: any;

//   constructor(
//       private router: Router,
//       private storageService: StorageService,
//       private userService: UserService,
//   ) { }

//   ngOnInit() {
//       this.userService.AfficherUserConnecter().pipe(takeUntil(this.destroy$)).subscribe((data) => {
//           this.users = data[0];
//           this.profil = this.users?.profil;
//       });
//   }

//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
//     return this.userService.AfficherUserConnecter().pipe(
//       takeUntil(this.destroy$),
//       switchMap((data) => {
//         this.users = data[0];
//         this.profil = this.users?.profil;
//         this.completer = this.users?.profilCompleter;
  
//         if (this.storageService.isLoggedIn()) {
//           this.isLoggedIn = true;
//         }

//         if (state.url === '/auth/completer-profil' && this.completer !== false) {
//           window.history.back();
//           return of(false);
//         }

//         if (state.url === '/userpages/ajouter-bien' && !(this.profil === 'ADMIN' || this.profil === 'PROPRIETAIRE' || this.profil === 'AGENCE' || this.profil === 'AGENT')) {
//           this.router.navigate(['/userpages/dashboard']);
//           return of(false);
//         }

//         if (state.url.startsWith('/userpages/modifier-bien/') && !(this.profil === 'ADMIN' || this.profil === 'PROPRIETAIRE' || this.profil === 'AGENCE' || this.profil === 'AGENT')) {
//           window.history.back();
//           return of(false);
//         }

//         if (this.isLoggedIn && (state.url === '/auth/connexion' || state.url === '/auth/inscription' || state.url === '/auth/reset-password/' || state.url === '/auth/activate-account/'|| state.url === '/auth/mdp-oublie')) {
//           this.router.navigate(['/userpages/dashboard']);
//           return of(false);
//         }

//         if ((state.url === '/auth/connexion' || state.url === '/auth/inscription' || state.url === '/auth/activate-account/' || state.url === '/auth/reset-password/' || state.url === '/auth/mdp-oublie') && !this.isLoggedIn) {
//           return of(true);
//         }
        
//         if (this.isLoggedIn) {
//           return of(true);
//         } else {
//           this.router.navigate(['/auth/connexion']);
//           return of(false);
//         }
//       })
//     );
//   }
  
//   ngOnDestroy() {
//       this.destroy$.next();
//       this.destroy$.complete();
//   }
// }



// // import { Injectable } from '@angular/core';
// // import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// // import { StorageService } from './service/auth/storage.service';
// // import { UserService } from './service/auth/user.service';
// // import { Observable, Subject, of, switchMap, takeUntil } from 'rxjs';

// // @Injectable({
// //     providedIn: 'root'
// // })

// // export class AuthGuard implements CanActivate {
// //   isLoggedIn = false;
// //   users: any;
// //   profil: any;
// //   private destroy$ = new Subject<void>();
// //   completer: any;

// //   constructor(
// //       private router: Router,
// //       private storageService: StorageService,
// //       private userService: UserService,
// //   ) {
   
// //    }

// //   ngOnInit() {
// //       this.userService.AfficherUserConnecter().pipe(takeUntil(this.destroy$)).subscribe((data) => {
// //           this.users = data[0];
// //           this.profil = this.users?.profil;
// //       });
// //   }

// //   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
// //     return this.userService.AfficherUserConnecter().pipe(
// //       takeUntil(this.destroy$),
// //       switchMap((data) => {
// //         this.users = data[0];
// //         this.profil = this.users?.profil;
  
// //         this.completer=this.users.profilCompleter
  
// //         if (this.storageService.isLoggedIn()) {
// //           this.isLoggedIn = true;
// //         }
        

// //         if (state.url === '/auth/completer-profil' && !(this.completer==false)) {
// //           window.history.back();
// //           return of(false);
// //         }
        
  
// //         if (state.url === '/userpages/ajouter-bien' && !( this.profil==='ADMIN' ||  this.profil==='PROPRIETAIRE' || this.profil==='AGENCE'  || this.profil==='AGENT')) {
// //           // alert('Vous n\'avez pas le droit d\'accéder à cette page');
// //           this.router.navigate(['/userpages/dashboard']);
// //           // window.history.back();
// //           return of(false);
// //         }
  
// //         if (state.url.startsWith('/userpages/modifier-bien/') && !( this.profil==='ADMIN' ||  this.profil==='PROPRIETAIRE' || this.profil==='AGENCE'  || this.profil==='AGENT')) {
// //           window.history.back();
// //           return of(false);
// //         }
        
  
// //         if (this.isLoggedIn ) {
         
// //             return of(true);
    
// //         } else {
// //           this.router.navigate(['/auth/connexion']);
// //           return of(false);
// //         }
// //       })
// //     );
// //   }
  
// //   ngOnDestroy() {
// //       this.destroy$.next();
// //       this.destroy$.complete();
// //   }
// // }





import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { StorageService } from './service/auth/storage.service';
import { UserService } from './service/auth/user.service';
import { Observable, Subject, of, switchMap, takeUntil } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  isLoggedIn = false;
  users: any;
  profil: any;
  private destroy$ = new Subject<void>();
  completer: any;

  constructor(
      private router: Router,
      private storageService: StorageService,
      private userService: UserService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userService.AfficherUserConnecter().pipe(
      takeUntil(this.destroy$),
      switchMap((data) => {
        this.users = data[0];
        this.profil = this.users?.profil;
        this.completer = this.users?.profilCompleter;

        this.isLoggedIn = this.storageService.isLoggedIn();

        if (state.url === '/auth/completer-profil' && this.completer) {
          this.router.navigate(['/userpages/profil']);
          return of(false);
        }

        if (state.url === '/userpages/ajouter-bien' && !['ADMIN', 'PROPRIETAIRE', 'AGENCE', 'AGENT'].includes(this.profil)) {
          this.router.navigate(['/userpages/dashboard']);
          return of(false);
        }

        if (state.url.startsWith('/userpages/modifier-bien/') && !['ADMIN', 'PROPRIETAIRE', 'AGENCE', 'AGENT'].includes(this.profil)) {
          window.history.back();
          return of(false);
        }

        if (this.isLoggedIn && ['/auth/connexion', '/auth/inscription', '/auth/reset-password/', '/auth/activate-account/', '/auth/mdp-oublie'].some(url => state.url.startsWith(url))) {
          this.router.navigate(['/userpages/dashboard']);
          return of(false);
        }

        if (!this.isLoggedIn && ['/auth/connexion', '/auth/inscription', '/auth/activate-account/', '/auth/reset-password/', '/auth/mdp-oublie'].some(url => state.url.startsWith(url))) {
          return of(true);
        }

        if (this.isLoggedIn) {
          return of(true);
        } else {
          this.router.navigate(['/auth/connexion']);
          return of(false);
        }
      })
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

