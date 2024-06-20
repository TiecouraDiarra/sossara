import { Component, Inject, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';
import { AuthService } from 'src/app/service/auth/auth.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';


const URL_PHOTO: string = environment.Url_PHOTO;


@Component({
  selector: 'app-candidatures-annuler',
  templateUrl: './candidatures-annuler.component.html',
  styleUrls: ['./candidatures-annuler.component.scss']
})
export class CandidaturesAnnulerComponent {
  candidatureAnnuler: any;
  locale!: string;



  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    @Inject(LOCALE_ID) private localeId: string,
    private serviceBienImmo: BienimmoService,
    private router: Router,
  ) {
    this.locale = localeId;

  }

  ngOnInit(): void {
    //AFFICHER LA LISTE DES BIENS LOUES DONT LES CANDIDATURES SONT ACCEPTEES EN FONCTION DES LOCATAIRES
    //fait
    this.serviceBienImmo.AfficherCandidatureAnnulerDeUserConnecter().subscribe(data => {
      this.candidatureAnnuler = data.reverse();
      // console.log(this.candidatureAnnuler);
      
    });
  }

  //FORMATER LE PRIX
  formatPrice(price: number): string {
    return price?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO;
    return baseUrl + photoFileName;
  }

  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE CONTRAT
  goToPageContrat(id: number) {
    return this.router.navigate(['userpages/contrat', id])
  }

}
