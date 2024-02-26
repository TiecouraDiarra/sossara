import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import Swal from 'sweetalert2';
const URL_PHOTO: string = environment.Url_PHOTO;
@Component({
  selector: 'app-mes-reclamations',
  templateUrl: './mes-reclamations.component.html',
  styleUrls: ['./mes-reclamations.component.scss']
})
export class MesReclamationsComponent  implements OnInit{
 
  reclamationUser: any
  transactionVendue: any
  photos: any;
  maxImageCount: number = 0; // Limite maximale d'images
  selectedFiles: any;
  image: File[] = [];
  images: File[] = [];
  locale!: string;

  isButtonDisabled: boolean = false; // Variable pour désactiver le bouton si la limite est atteinte
  // @ViewChild('exampleModal') modal: any; // Ajoutez cette ligne pour obtenir une référence au modal
  form: any = {
    contenu: null,
    type: null,
    prix_estimatif: null,
    photos: null,
  };

  formProcessus: any = {
    somme: null,
  };

  factureNumber: number = 1; // Numéro de facture initial

  // IMAGE PAR DEFAUT DES BIENS
  DEFAULT_IMAGE_URL = 'assets/img/gallery/gallery1/gallery-1.jpg';
  User: any;
  today: Date;

  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }

  constructor(
    private storageService: StorageService,
    public router: Router,
    private serviceBienImmo: BienimmoService,
    private serviceUser: UserService,
    @Inject(LOCALE_ID) private localeId: string,
  
    
  ) {
    this.locale = localeId;
      this.User = this.storageService.getUser();
    // console.log(this.User);
    this.today = new Date();
    // egisterLocaleData(localeFr); // Enregistrez la locale française
  }

      //FORMATER LE PRIX
      formatPrice(price: number): string {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }
    

  ngOnInit(): void {

     //AFFICHER LA LISTE DES RECLAMATIONS FAITES PAR UTILISATEUR
     this.serviceBienImmo.AfficherListeReclamationFaitesParUser().subscribe(data => {
      this.reclamationUser = data.reverse();
      // this.photos = this.reclamation.bien;
      console.log(this.reclamationUser);
      // console.log(this.photos);
    });
  }

    //IMAGE
    generateImageUrl(photoFileName: string): string {
      const baseUrl = URL_PHOTO;
      return baseUrl + photoFileName;
    }
}
