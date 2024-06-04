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
  ) {
   
   }

  ngOnInit() {
      this.userService.AfficherUserConnecter().pipe(takeUntil(this.destroy$)).subscribe((data) => {
          this.users = data[0];
          this.profil = this.users?.profil;
      });
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userService.AfficherUserConnecter().pipe(
      takeUntil(this.destroy$),
      switchMap((data) => {
        const user = data[0];
        const profil = user?.profil;
        const profilCompleter = user.profilCompleter;
        const isLoggedIn = this.storageService.isLoggedIn();
        const roles = isLoggedIn ? this.storageService.getUser().roles : [];

        if (isLoggedIn && !profilCompleter && state.url !== '/auth/completer-profil') {
          this.router.navigate(['/auth/completer-profil']);
          return of(false);
        }

        const isAuthorized = ['ADMIN', 'PROPRIETAIRE', 'AGENCE', 'AGENT'].includes(profil);
        const restrictedUrls = ['/userpages/ajouter-bien', '/userpages/modifier-bien/'];

        if (restrictedUrls.some(url => state.url.startsWith(url)) && !isAuthorized) {
          window.history.back();
          return of(false);
        }

        if (isLoggedIn) {
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
