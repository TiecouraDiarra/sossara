import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as Aos from 'aos';
import { routes } from 'src/app/core/helpers/routes/routes';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { CommoditeService } from 'src/app/service/commodite/commodite.service';
import { DataService } from 'src/app/service/data.service';
interface Food {
  value: string | any;
  viewValue: string;
}
interface price {
  value: string | any;
  viewValue: string;
}

@Component({
  selector: 'app-add-listing',
  templateUrl: './add-listing.component.html',
  styleUrls: ['./add-listing.component.css'],
})
export class AddListingComponent {
  requiredFileType: any;
  commodite: any;
  adresse: any;
  region: any;
  statusBien: any;
  pays: any;
  commune: any;
  typebien: any;
  bienImmo: any;
  BienLoueRecens: any;
  commodite1: any;
  commodite2: any;
  commodite3: any;
  regions: any = [];
  communes: any = [];
  fileName: any;
  valuesSelect: any = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  status: any = ['A louer', 'A vendre'];

  constructor(
    private DataService: DataService,
    public router: Router,
    private serviceCommodite: CommoditeService,
    private storageService: StorageService,
    private userService: UserService,
    private serviceBienImmo: BienimmoService
  ) { }

  public routes = routes;
  selectedValue: string | any = 'pays';
  selectedValueR: string | any = 'region';
  fliesValues: any = [];
  valuesFileCurrent: String = 'assets/img/mediaimg-2.jpg';
  errorMessage: any = '';
  isSuccess: any = false;
  files: any = [];
  photo: any;
  selectedFiles : any;
  imagesArray: string[] = []; // Array to store URLs of selected images

  //CHARGER L'IMAGE
  // chargeImg(event: any) {
  //   this.photo = event.target["files"][0]
  //   console.log(this.photo);
  // }
  // chargeImg(event: any): void {
  //   const selectedFile = event.target.files[0];
  //   console.log(selectedFile);
  //   if (selectedFile) {
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.valuesFileCurrent = e.target.result;
  //     };
  //     reader.readAsDataURL(selectedFile);
  //   }
  // }
  chargeImg(event: any): void {
    this.photo = event.target.files;
    const reader = new FileReader();
    // this.imagesArray =  [];
    console.log(this.photo);
    for (const file of this.photo) {
      reader.onload = (e: any) => {
        this.imagesArray.push(e.target.result);
      };
      reader.readAsDataURL(file);
      
    }
  }

  form: any = {
    commodite: null,
    type: null,
    commune: null,
    nb_piece: null,
    nom: null,
    chambre: null,
    cuisine: null,
    toilette: null,
    surface: null,
    prix: null,
    statut: null,
    description: null,
    quartier: null,
    rue: null,
    porte: null,
    commoditeChecked: false,
    selectedCommodities: [], // Nouveau tableau pour stocker les commodités sélectionnées
  };

  

  ngOnInit(): void {
    Aos.init({ disable: 'mobile' });

    //AFFICHER LA LISTE DES COMMODITES
    this.serviceCommodite.AfficherLaListeCommodite().subscribe((data) => {
      this.commodite = data.commodite;
      this.adresse = data;
      this.pays = data.pays;
      this.region = data.region;
      this.commune = data.commune;
      this.typebien = data.type;
      console.log(data);
    });

    // //AFFICHER LA LISTE DES BIENS IMMO
    // this.serviceBienImmo.AfficherLaListeBienImmo().subscribe((data) => {
    //   this.bienImmo = data.biens;
    //   console.log(this.bienImmo);
    // });

    // //AFFICHER LA LISTE DES BIENS IMMO RECENTS A LOUER
    // this.serviceBienImmo.AfficherLaListeBienImmo().subscribe((data) => {
    //   this.BienLoueRecens = data.biens;
    //   console.log(this.BienLoueRecens);
    // });
  }
  
  onChange(newValue: any) {
    this.regions = this.region.filter(
      (el: any) => el.pays.nom == newValue.value
    );
  }

  onChangeRegion(newValue: any) {
    this.communes = this.commune.filter(
      (el: any) => el.region.nom == newValue.value
    );
  }

  

  onFileSelected(newValue: any) {
    this.files.push(newValue.target.files[0]);
    this.valuesFileCurrent = newValue.target.value;
  }
  onSubmit(form: NgForm): void {
    if (this.photo === null) {
      console.error('La photo est manquante.');
      return;
    }
    const {
      commodite,
      type,
      commune,
      nb_piece,
      nom,
      chambre,
      cuisine,
      toilette,
      surface,
      prix,
      statut,
      description,
      quartier,
      rue,
      porte,
    } = this.form;
    console.log(this.form);
    const user = this.storageService.getUser();
    if (user && user.token) {
      this.serviceBienImmo.setAccessToken(user.token);
      this.serviceBienImmo
        .registerBien(
          commodite,
          type,
          commune,
          nb_piece,
          nom,
          chambre,
          cuisine,
          toilette,
          surface,
          prix,
          statut,
          description,
          quartier,
          rue,
          porte,
          this.photo
        )
        .subscribe({
          next: (data) => {
            console.log(data);
            this.isSuccess = false;
          },
          error: (err) => {
            console.log(err);
            this.errorMessage = err.error.message;
            this.isSuccess = true;
          },
        });
    } else {
      console.error('Token JWT manquant');
    }
  }

  removeImage(index: number) {
    this.imagesArray.splice(index, 1); // Supprime l'image du tableau
  }

  // onPhotosSelected(event: any): void {
  //   if (event.target.files && event.target.files.length > 0) {
  //     this.photo = Array.from(event.target.files);
  //   } else {
  //     this.photo = [];
  //   }
  // }
}
