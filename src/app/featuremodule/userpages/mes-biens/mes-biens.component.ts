import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { AuthService } from 'src/app/service/auth/auth.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { DataService } from 'src/app/service/data.service';
import Swal from 'sweetalert2';



const URL_PHOTO: string = environment.Url_PHOTO;


@Component({
  selector: 'app-mes-biens',
  templateUrl: './mes-biens.component.html',
  styleUrls: ['./mes-biens.component.css']
})
export class MesBiensComponent implements OnInit {
  // Référence au modal que vous souhaitez convertir en PDF
  @ViewChild('facturelocation')
  facturelocation!: ElementRef;

  loading = false;
  bonAccord = false;
  prendEnCharge = false;
  locale!: string;
  selectedTab: string = 'home'; // Déclaration de la variable selectedTab avec la valeur par défaut 'home'

  @ViewChild('factureachat')
  factureachat!: ElementRef;
  bienImmoDejaLoueLocataires: any;

  public routes = routes;
  User: any;
  p2: number = 1;
  p3: number = 1;
  p4: number = 1;
  p5: number = 1;
  p6: number = 1;
  p7: number = 1;
  p8: number = 1;
  public albumsOne: any = [];
  isLocataire = false;
  isAgence = false;
  isProprietaire= false;
  isAgent = false;
  roles: string[] = [];
  bienImmoDejaLoueLocataire: any[] = []
  valuesSelect: any = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  public electronics: any = []

  today: Date;
  profil: any;
  // Méthode pour changer l'onglet sélectionné
  changeTab(tab: string) {
    this.selectedTab = tab;
  }

  // Méthode pour vérifier si un onglet est actif
  isTabActive(tab: string): boolean {
    return this.selectedTab === tab;
  }

  constructor(
    private DataService: DataService,
    private storageService: StorageService,
    private serviceUser : UserService,
    public router: Router,
    private authService: AuthService,
  ) {
    this.electronics = this.DataService.electronicsList,
      this.User = this.storageService.getUser();
     this.today = new Date();
    // egisterLocaleData(localeFr); // Enregistrez la locale française
  }

 
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      // Récupérer les données de l'utilisateur connecté
    this.serviceUser.AfficherUserConnecter().subscribe((data) => {
      this.profil = data[0]?.profil;
      if (this.profil == 'LOCATAIRE') {
        this.isLocataire = true;
        this.selectedTab = 'home';
      } else if (this.profil == 'AGENCE' ) {
        this.isAgence = true;
        this.selectedTab = 'homeagence'; // Sélectionnez l'onglet correspondant à ROLE_AGENCE
      } else if (this.profil == 'AGENT') {
        this.isAgent = true
        this.selectedTab = 'home'; // Sélectionnez l'onglet correspondant à ROLE_AGENCE
      } else if (this.profil == 'PROPRIETAIRE') {
        this.isProprietaire = true;
      }else {
        this.selectedTab = 'home';
      }
    })
      // this.isLoggedIn = true;
      //  if (this.roles.includes("ROLE_LOCATAIRE")) {
      //   this.isLocataire = true;
      //   this.selectedTab = 'home';
      // } else if (this.roles.includes("ROLE_AGENCE")) {
      //   this.isAgence = true;
      //   this.selectedTab = 'homeagence'; // Sélectionnez l'onglet correspondant à ROLE_AGENCE
      // } else if (this.roles.includes("ROLE_PROPRIETAIRE")) {
      //   this.isProprietaire = true
      // }
      // else if (this.roles.includes("ROLE_AGENT")) {
      //   this.isAgent = true;
      //   this.selectedTab = 'home'; // Sélectionnez l'onglet correspondant à ROLE_AGENCE
      // } else {
      //   this.selectedTab = 'home';
      // }
    }
    this.User = this.storageService.getUser().id;
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
  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS BIEN
  goToDettailBien(id: number) {
    return this.router.navigate(['details-bien', id])
  }
  //METHODE PERMETTANT DE SE DECONNECTER
  logout(): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'swal2-confirm btn',
        cancelButton: 'swal2-cancel btn',
      },
      heightAuto: false
    })
    swalWithBootstrapButtons.fire({
      // title: 'Etes-vous sûre de vous déconnecter?',
      text: "Etes-vous sûre de vous déconnecter?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout().subscribe({
          next: res => {
            this.storageService.clean();
            this.router.navigateByUrl("/auth/connexion")
          },
          error: err => {
          }
        });
      }
    })

  }
}
