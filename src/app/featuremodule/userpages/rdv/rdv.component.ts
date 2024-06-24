import { Component, Inject, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { AuthService } from 'src/app/service/auth/auth.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { MessageService } from 'src/app/service/message/message.service';


const URL_PHOTO: string = environment.Url_PHOTO;



@Component({
  selector: 'app-rdv',
  templateUrl: './rdv.component.html',
  styleUrls: ['./rdv.component.scss']
})
export class RdvComponent {
  public routes = routes;
  isLocataire = false;
  isAgence = false;
  isAgent = false;
  roles: string[] = [];
  rdv: any;
  locale!: string;
  isProprietaire= false;
  profil: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private serviceUser: UserService,
    @Inject(LOCALE_ID) private localeId: string,
    private serviceMessage: MessageService,
    private storageService: StorageService
  ) {
    this.locale = localeId;
  }
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.serviceUser.AfficherUserConnecter().subscribe((data) => {
        this.profil = data[0]?.profil;
        if (this.profil == 'LOCATAIRE') {
          this.isLocataire = true;
        } else if (this.profil == 'AGENCE' ) {
          this.isAgence = true; 
        } else if (this.profil == 'AGENT') {
          this.isAgent = true
        } else if (this.profil == 'PROPRIETAIRE') {
          this.isProprietaire = true
        }
      })
      // if (this.roles.includes("ROLE_LOCATAIRE")) {
      //   this.isLocataire = true
      // } else if (this.roles.includes("ROLE_AGENCE")) {
      //   this.isAgence = true
      // } else if (this.roles.includes("ROLE_AGENT")) {
      //   this.isAgent = true
      // }  else if (this.roles.includes("ROLE_PROPRIETAIRE")) {
      //   this.isProprietaire = true
      // }
    }

        //AFFICHER LA LISTE DES RDV RECU PAR USER CONNECTE
    //FAIT
    this.serviceUser.AfficherLaListeRdv().subscribe(data => {
      this.rdv = data.reverse();
      
      
     }
    );
  }
  
    // IMAGE PAR DEFAUT USER
    handleAuthorImageError(event: any) {
      event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
    }
  
      //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO;
    return baseUrl + photoFileName;
  }

}
