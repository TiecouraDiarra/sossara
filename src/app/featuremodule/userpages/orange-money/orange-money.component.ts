import { Component, Inject, LOCALE_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { CommoditeService } from 'src/app/service/commodite/commodite.service';
import { FactureService } from 'src/app/service/facture/facture.service';
import { ModepaiementService } from 'src/app/service/modepaiement/modepaiement.service';
import Swal from 'sweetalert2';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-proprietaire',
  templateUrl: './orange-money.component.html',
  styleUrls: ['./orange-money.component.scss']
})
export class OrangeMoneyComponent {
  public routes = routes;
  id: any
  locale!: string;
  candidature: any;
  bien: any;
  photoImmo: any;
  nombreMoisChoisi: number = 0;
  nombreJourChoisi: number = 0;
  nombreSemaineChoisi: number = 0;
  paiementForm: any = {
    nombreMois: null,
    nombreSemaine: null,
    nombreJours: null,
    sommePayer: null,
    numeroPaiement: null,
    modePaiement: null,
  }
  errorMessage: any;
  isError: any = false;
  facture: any;
  contrat: any;

  constructor(
    private paiementService: ModepaiementService,
    @Inject(LOCALE_ID) private localeId: string,
    private router: Router,
    private serviceUser: UserService,
    private serviceFacture: FactureService,
    private storageService: StorageService,
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
  // Supposons que vous avez une image par défaut dans votre projet
  defaultImageUrl: string = 'assets/img/typebien/villa.png';
  setDefaultImage(event: any): void {
    // Si le chargement de l'image échoue, utilisez l'image par défaut
    event.target.src = this.defaultImageUrl;
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
    this.serviceFacture.AfficherFactureParUuId(this.id).subscribe(data => {
      this.facture = data;
      this.contrat = data?.contrat;
      this.candidature = data;
      this.bien = data?.bien;
      this.photoImmo = data?.bien?.photoImmos;
      
    })
  }
  //FORMATER LE PRIX
  formatPrice(price: number): string {
    return price?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
  onNombreMoisChange(): void {
    // const selectElement = event.target as HTMLSelectElement;
    // this.nombreMoisChoisi = parseInt(selectElement.value, 10);
  }
  onNombreJourChange(): void {
    // Vous pouvez accéder à this.nombreMoisChoisi ici pour obtenir la nouvelle valeur
    // Faites tout traitement supplémentaire ici si nécessaire
  }

  onNombreSemaineChange(): void {
    // Vous pouvez accéder à this.nombreMoisChoisi ici pour obtenir la nouvelle valeur
    // Faites tout traitement supplémentaire ici si nécessaire
  }

  loadingPaiement = false;

  //FAIRE LE PAIEMENT AVEC ORANGE MONEY
  FairePaiement(uuid:any): void {
    const { contenu, nombreMois, nombreSemaine, nombreJours, sommePayer, numeroPaiement, modePaiement, } = this.paiementForm;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'swal2-confirm btn',
        cancelButton: 'swal2-cancel btn',
      },
      heightAuto: false
    })
    const numeroPaiementSansTiret = numeroPaiement.replace(/\-/g, '');

    if (!/^7|^8[0-4]|^9[0-4]/.test(numeroPaiementSansTiret)) {
      Swal.fire({
        position: 'center',
        text: "Veuillez saisir un numéro orange valide",
        title: 'Erreur',
        icon: 'error',
        heightAuto: false,
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#e98b11',
        showDenyButton: false,
        showCancelButton: false,
        allowOutsideClick: false,
      })
      return; // Sortez de la fonction pour éviter d'exécuter le reste du code
    }



    swalWithBootstrapButtons.fire({
      // title: 'Etes-vous sûre de vous déconnecter?',
      text: "Etes-vous sûre de faire le paiement?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingPaiement = true;
        const user = this.storageService.getUser();
        if (user && user.token) {
          // Définissez le token dans le service serviceUser
          this.serviceUser.setAccessToken(user.token);
          //RECUPERER L'UUID D'UN BLOG 
    this.id = this.route.snapshot.params["uuid"]
    //AFFICHER UNE CANDIDATURE EN FONCTION DE SON ID
    this.serviceFacture.AfficherFactureParUuId(this.id).subscribe(data => {
      this.facture = data;
      
      this.contrat = data?.contrat;
      this.candidature = data;
      this.bien = data?.bien;
      this.photoImmo = data?.bien?.photoImmos;
      if (this.bien.statut.nom === 'A louer' && this.bien?.periode?.nom === 'Mensuel') {
        if(this.facture.mensuel){
          this.paiementForm.sommePayer = this.bien.prix;
        }else{
           // Vérifier si à la fois avance et caution sont égaux à zéro
        if (this.bien.avance === 0 && this.bien.caution === 0) {
          // Calculer sommePayer en utilisant le prix du bien
          this.paiementForm.sommePayer = this.bien.prix;
        } else {
          // Calculer nombreMois comme étant égal à avance + caution
          this.paiementForm.nombreMois = this.bien.avance + this.bien.caution;
          // Calculer sommePayer en utilisant le prix du bien multiplié par nombreMois
          this.paiementForm.sommePayer = this.bien.prix * this.paiementForm.nombreMois;
        }
        }
        this.paiementForm.nombreJours = 0;
        this.paiementForm.nombreSemaine = 0;
        // this.paiementForm.sommePayer = this.bien?.prix * this.paiementForm.nombreMois
      } else if (this.bien?.periode?.nom === 'Journalier') {
        this.paiementForm.nombreJours = this.contrat?.nombreJour;
        this.paiementForm.sommePayer = this.bien?.prix * this.contrat?.nombreJour;
      } else if (this.bien?.periode?.nom === 'Hebdomadaire') {
        this.paiementForm.nombreSemaine = this.contrat?.nombreSemaine;
        this.paiementForm.sommePayer = this.bien?.prix * this.contrat?.nombreSemaine;
      } else if (this.bien.statut.nom === 'A vendre' && this.bien?.periode?.nom === 'Mensuel') {
        this.paiementForm.sommePayer = this.bien?.prix;
      }
      this.paiementForm.modePaiement = 1;
      this.paiementService.FairePaiement(uuid, this.paiementForm.nombreMois, this.paiementForm.nombreSemaine, this.paiementForm.nombreJours, this.paiementForm.sommePayer, numeroPaiementSansTiret, 1).subscribe({
        next: (data) => {
          if (data.status) {
            this.loadingPaiement = false;
            let timerInterval = 2000;
            Swal.fire({
              position: 'center',
              text: "Paiement effectué avec succès",
              title: "Paiement",
              icon: 'success',
              heightAuto: false,
              showConfirmButton: false,
              confirmButtonColor: '#e98b11',
              showDenyButton: false,
              showCancelButton: false,
              allowOutsideClick: false,
              timer: timerInterval,
              timerProgressBar: true,
            }).then(() => {
              this.goToPageRecu(data.message)
            });
          } else {
            this.loadingPaiement = false;
            Swal.fire({
              position: 'center',
              text: data.message,
              title: 'Erreur',
              icon: 'error',
              heightAuto: false,
              showConfirmButton: true,
              confirmButtonText: 'OK',
              confirmButtonColor: '#e98b11',
              showDenyButton: false,
              showCancelButton: false,
              allowOutsideClick: false,
            }).then((result) => { });
          }
        },
        error: (err) => {

          this.errorMessage = err.error.message;
          this.isError = true
          // Gérez les erreurs ici
        }
      }
      );
    })

         
        } else {
        }
      }
    })
  }

  onKeyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // Caractère non numérique, empêcher l'entrée
      event.preventDefault();
    }

    // Insérer un tiret après chaque paire de chiffres
    const inputValue = event.target.value.replace(/\-/g, ''); // Supprimer les tirets existants
    let formattedValue = '';
    for (let i = 0; i < inputValue.length; i += 2) {
      formattedValue += inputValue.slice(i, i + 2) + '-';
    }
    // Supprimer le tiret final s'il dépasse la limite de 8 caractères
    formattedValue = formattedValue.slice(0, 10);

    // Mettre à jour la valeur dans l'input
    event.target.value = formattedValue;
  }


  islongNumero(telephone: string): boolean {
    // Votre méthode actuelle pour vérifier la longueur du numéro de téléphone
    return telephone.length === 8 && /^[0-9-]+$/.test(telephone);
  }

  startsWithValidPrefix(telephone: string): boolean {
    // Vérifie si le numéro commence par l'un des préfixes spécifiés
    return /^(7|8|90|91|92|93|94)/.test(telephone);
  }

  containsOnlyDigits(telephone: string): boolean {
    // Vérifie si le numéro contient uniquement des chiffres
    return /^[0-9]+$/.test(telephone);
  }

  // Vérifie le numéro de téléphone complet avec tous les critères
  isValidPhoneNumber(telephone: string): boolean {
    return (
      this.startsWithValidPrefix(telephone) &&
      this.islongNumero(telephone) &&
      this.containsOnlyDigits(telephone)
    );
  }




  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE RECU
  goToPageRecu(id: number) {
    return this.router.navigate(['userpages/recufacture', id])
  }
}
