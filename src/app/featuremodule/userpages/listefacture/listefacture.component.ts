import { Component, HostListener, Inject, LOCALE_ID } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { DataService } from 'src/app/service/data.service';
import { FactureService } from 'src/app/service/facture/facture.service';
import { ModepaiementService } from 'src/app/service/modepaiement/modepaiement.service';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-listefacture',
  templateUrl: './listefacture.component.html',
  styleUrls: ['./listefacture.component.scss']
})
export class ListefactureComponent {
  public routes = routes;

  id: any
  locale!: string;
  paiement: any;
  modepaiement: any;
  bien: any;
  photoImmo: any;
  transaction: any;
  locataire: any;
  proprietaire: any;
  modePaiement: any;
  facture: any;
  // Déclarez une variable pour stocker l'ID du BienImmo sélectionné
  selectedFactureId: any;
  selectedPaymentMode: any;
  selectedBienImmoId: any;
  CandidatureUser: any;
  public electronics: any = []

  isMobile = false;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 767;
  }

  constructor(
    private paiementService: ModepaiementService,
    @Inject(LOCALE_ID) private localeId: string,
    private DataService: DataService,
    private serviceUser: UserService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private serviceBienImmo: BienimmoService,
    private router: Router,
    private modepaiementService: ModepaiementService,
    private serviceFacture: FactureService,

  ) {
    this.locale = localeId;
    this.electronics = this.DataService.electronicsList;
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
    //AFFICHER UN PAIEMENT EN FONCTION DE SON ID
    this.serviceFacture.AfficherFactureParBien(this.id).subscribe(data => {
      this.facture = data;
      this.paiement = this.facture?.paiments;
      this.modePaiement = data[0]?.modePaiement;
      this.bien = data[0]?.bien;
      this.locataire = data[0]?.locataire;
      this.proprietaire = data[0]?.bien?.proprietaire;
      this.transaction = data[0]?.transaction;
      this.photoImmo = data[0]?.bien?.photoImmos;
    })
  }

  //FORMATER LE PRIX
  formatPrice(price: number): string {
    return price?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  sortData(sort: Sort) {
    const data = this.electronics.slice();

    if (!sort.active || sort.direction === '') {
      this.electronics = data;
    } else {
      this.electronics = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS Facture
  goToDettailFacture(id: number) {
    return this.router.navigate(['userpages/facturepaiement', id]);
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE RECU
  goToPageRecu(id: number) {
    return this.router.navigate(['userpages/recufacture', id])
  }
}
