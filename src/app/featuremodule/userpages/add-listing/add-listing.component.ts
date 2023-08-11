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
  valuesSelect: any = ['1', '2', '3', '4', '4 et plus'];
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
  valuesFileCurrent: any = 'assets/img/mediaimg-2.jpg';
  errorMessage: any = '';
  isSuccess: any = false;
  files: any = [];

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
        this.form.commodite,
        this.form.type,
        this.form.commune,
        this.form.nb_piece,
        this.form.nom,
        this.form.chambre,
        this.form.cuisine,
        this.form.toilette,
        this.form.surface,
        this.form.prix,
        this.form.statut,
        this.form.description,
        this.form.quartier,
        this.form.rue,
        this.form.porte,
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
}
