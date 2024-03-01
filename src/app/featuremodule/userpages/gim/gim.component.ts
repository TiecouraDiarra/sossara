import { Component, Inject, LOCALE_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { CommoditeService } from 'src/app/service/commodite/commodite.service';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-gim',
  templateUrl: './gim.component.html',
  styleUrls: ['./gim.component.scss']
})
export class GimComponent {

  public routes = routes;
  id: any
  locale!: string;
  candidature: any;
  bien: any;
  photoImmo: any;
  nombreMoisChoisi: number = 0;
  nombreJourChoisi: number = 0;
  nombreSemaineChoisi: number = 0;

  constructor(
    private serviceCommodite: CommoditeService,
    @Inject(LOCALE_ID) private localeId: string,
    private route: ActivatedRoute,
    private serviceBienImmo: BienimmoService,

  ) {
    this.locale = localeId;
  }

  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src = 'assets/img/gallery/gallery1/gallery-1.jpg';
  }
  handleAuthorImageError1(event: any) {
    event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }
  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO;
    return baseUrl + photoFileName;
  }

  ngOnInit(): void {
    //RECUPERER L'UUID D'UN BLOG 
    this.id = this.route.snapshot.params["uuid"]
    //AFFICHER UNE CANDIDATURE EN FONCTION DE SON ID
    this.serviceBienImmo.AfficherCandidatureParUuId(this.id).subscribe(data => {
      this.candidature = data;
      this.bien = data?.bien;
      this.photoImmo = data?.bien?.photoImmos;
      console.log(this.candidature);
    })
  }
  //FORMATER LE PRIX
  formatPrice(price: number): string {
    return price?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
  onNombreMoisChange(): void {
    console.log(this.nombreMoisChoisi);
    // const selectElement = event.target as HTMLSelectElement;
    // this.nombreMoisChoisi = parseInt(selectElement.value, 10);
  }
  onNombreJourChange(): void {
    // Vous pouvez accéder à this.nombreMoisChoisi ici pour obtenir la nouvelle valeur
    console.log(this.nombreJourChoisi);
    // Faites tout traitement supplémentaire ici si nécessaire
  }

  onNombreSemaineChange(): void {
    // Vous pouvez accéder à this.nombreMoisChoisi ici pour obtenir la nouvelle valeur
    console.log(this.nombreSemaineChoisi);
    // Faites tout traitement supplémentaire ici si nécessaire
  }
}
