import {
  Component,
  ElementRef,
  Inject,
  LOCALE_ID,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { AgenceService } from 'src/app/service/agence/agence.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { BienimmoService } from 'src/app/service/bienimmo/bienimmo.service';
import { DataService } from 'src/app/service/data.service';
import Swal from 'sweetalert2';

const URL_PHOTO: string = environment.Url_PHOTO;

@Component({
  selector: 'app-mes-agents',
  templateUrl: './mes-agents.component.html',
  styleUrls: ['./mes-agents.component.css'],
})
export class MesAgentsComponent implements OnInit {
  public routes = routes;
  locale!: string;
  isLocataire = false;
  isAgence = false;
  roles: string[] = [];
  public commune = [
    'Commune',
    'Commune 1',
    'Commune 2',
    'Commune 3',
    'Commune 4',
    'Commune 5',
    'Commune 6',
  ];

  public Bookmarksdata: any = [];
  public electronics: any = [];
  agent: any;
  MotdePasseAgent: any;
  searchText: any;
  message: string | undefined;
  nomAgence: any;
  p1: number = 1;

  // @ViewChild('motDePasseSpan', { static: false }) motDePasseSpan!: ElementRef;

  // ngAfterViewInit() {
  //   const nomAgenceSansEspaces = this.nomAgence.replace(/ /g, '_');
  //   const motDePasse = `pass_${nomAgenceSansEspaces}_123`;
  //   this.motDePasseSpan.nativeElement.textContent = motDePasse;
  // }

  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO;
    return baseUrl + photoFileName;
  }

  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src =
      'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }
  bienImmo: any;
  favoritedPropertiesCount1: { [bienId: number]: number } = {};

  errorMessage: any = '';

  agentForm: any = {
    nom: null,
    email: null,
    telephone: null,
    quartier: null,
  };

  constructor(
    private dataservice: DataService,
    @Inject(LOCALE_ID) private localeId: string,
    private serviceUser: UserService,
    private routerr: Router,
    private serviceAgence: AgenceService,
    private storageService: StorageService,
    private agenceService: AgenceService,
    private serviceBienImmo: BienimmoService
  ) {
    this.locale = localeId;
    this.Bookmarksdata = this.dataservice.Bookmarksdata;
  }
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      // this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
      this.nomAgence = this.storageService.getUser().nom;
      // console.log(this.roles);
      if (this.roles[0] == 'ROLE_LOCATAIRE') {
        this.isLocataire = true;
      } else if (this.roles[0] == 'ROLE_AGENCE') {
        this.isAgence = true;
      }
    }

    //AFFICHER LA LISTE DES AGENTS PAR AGENCE
    this.agenceService.ListeAgentParAgence().subscribe((data) => {
      this.agent = data.agents.reverse();
      console.log("vcvvc",this.agent);
    });

    //AFFICHER LA LISTE DES BIENS PAR UTILISATEUR
    // this.serviceBienImmo.AfficherBienImmoParUser().subscribe(data => {
    //   this.bienImmo = data.biens.reverse();
    //   console.log(this.bienImmo);
    //   this.bienImmo.forEach((bien: { id: string | number; }) => {
    //     if (typeof bien.id === 'number') {
    //       this.favoritedPropertiesCount1[bien.id] = this.bienImmo.length;
    //     }
    //     console.log();

    //   });
    // });
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

  //METHODE PERMETTANT D'AJOUTER UN AGENT
  AjouterAgent(): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false,
    });
    const user = this.storageService.getUser();
    if (user && user.token) {
      // Définissez le token dans le service commentaireService
      this.serviceUser.setAccessToken(user.token);

      // Vérifiez que les valeurs sont présentes avant d'appeler AjouterAgent
      if (
        this.agentForm.nom !== null &&
        this.agentForm.email !== null &&
        this.agentForm.telephone !== null 
        // this.agentForm.quartier !== null
      ) {
        swalWithBootstrapButtons
          .fire({
            text: 'Etes-vous sûre de creer cet agent ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirmer',
            cancelButtonText: 'Annuler',
            reverseButtons: true,
          })
          .then((result) => {
            if (result.isConfirmed) {
              // Appelez la méthode AjouterAgent() avec les données du formulaire
              this.agenceService
                .AjouterAgent(
                  this.agentForm.nom,
                  this.agentForm.email,
                  this.agentForm.telephone
                  
                )
                .subscribe(
                  (data) => {
                    // La réponse de la requête réussie est gérée ici
                    // console.log("Agent ajouté avec succès:", data);
                    console.log('data', data);

                    if (data.status) {
                      let timerInterval = 2000;
                      Swal.fire({
                        position: 'center',
                        text: data.message,
                        title: "Ajout d'une éducation",
                        icon: 'success',
                        heightAuto: false,
                        showConfirmButton: false,
                        confirmButtonColor: '#0857b5',
                        showDenyButton: false,
                        showCancelButton: false,
                        allowOutsideClick: false,
                        timer: timerInterval,
                        timerProgressBar: true,
                      }).then(() => {
                        // Réinitialisez le formulaire d'ajout d'agent après un succès
                        this.agentForm = {
                          nom: '',
                          email: '',
                          telephone: '',
                          quartier: '',
                        };
                        //AFFICHER LA LISTE DES AGENTS PAR AGENCE
                        this.agenceService
                          .ListeAgentParAgence()
                          .subscribe((data) => {
                            this.agent = data.agents.reverse();
                            // console.log(this.agent);
                          });
                      });
                    } else {
                      Swal.fire({
                        position: 'center',
                        text: data.message,
                        title: 'Erreur',
                        icon: 'error',
                        heightAuto: false,
                        showConfirmButton: true,
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#0857b5',
                        showDenyButton: false,
                        showCancelButton: false,
                        allowOutsideClick: false,
                      }).then((result) => {});
                    }
                  },
                  (error) => {
                    // Gérez les erreurs ici
                    // console.error("Erreur lors de l'ajout d'un agent :", error);
                    // Affichez un message d'erreur à l'utilisateur si nécessaire
                    // this.errorMessage = "Une erreur s'est produite lors de l'ajout de l'agent.";
                  }
                );
            }
          });
      } else {
        swalWithBootstrapButtons.fire(
          (this.message = ' Tous les champs sont obligatoires !')
        );
      }
    } else {
      // console.error("Token JWT manquant");
    }
  }

  //POPUP APRES CONFIRMATION DE L'AJOUT AGENT
  popUpConfirmationAjouter() {
    let timerInterval = 2000;
    Swal.fire({
      position: 'center',
      text: 'Agent a été creé avec succès.',
      title: 'Creation Agent',
      icon: 'success',
      heightAuto: false,
      showConfirmButton: false,
      // confirmButtonText: "OK",
      confirmButtonColor: '#0857b5',
      showDenyButton: false,
      showCancelButton: false,
      allowOutsideClick: false,
      timer: timerInterval, // ajouter le temps d'attente
      timerProgressBar: true, // ajouter la barre de progression du temps
    }).then((result) => {
      // Réinitialisez le formulaire d'ajout d'agent après un succès
      this.agentForm = {
        nom: '',
        email: '',
        telephone: '',
        quartier: '',
      };
      //AFFICHER LA LISTE DES AGENTS PAR AGENCE
      this.agenceService.ListeAgentParAgence().subscribe((data) => {
        this.agent = data.agents.reverse();
        // console.log(this.agent);
      });
    });
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS AGENT
  goToDettailAgent(id: number) {
    // console.log(id);
    return this.routerr.navigate(['details-agent', id]);
  }

  //METHODE PERMETTANT DE SUPPRIMER UN AGENT
  SupprimerAgent(id: number): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false,
    });
    swalWithBootstrapButtons
      .fire({
        // title: 'Etes-vous sûre de vous déconnecter?',
        text: 'Etes-vous sûre de suppimer cet agent?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          const user = this.storageService.getUser();
          if (user && user.token) {
            // Définissez le token dans le service serviceUser
            this.serviceUser.setAccessToken(user.token);

            // Appelez la méthode PrendreRdv() avec le contenu et l'ID
            this.serviceAgence.SupprimerAgent(id).subscribe({
              next: (data) => {
                // console.log("Agent supprimé avec succès:", data);
                // this.errorMessage = 'Candidature envoyée avec succès';
                // this.isCandidatureSent = true;
                // Afficher le premier popup de succès
                this.popUpConfirmation();
              },
              error: (err) => {
                // console.error("Erreur lors de la suppression :", err);
                this.errorMessage = err.error.message;
                // console.error(this.errorMessage);
                // this.isError = true
                // Gérez les erreurs ici
              },
            });
          } else {
            // console.error("Token JWT manquant");
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // L'utilisateur a annulé l'action
          const cancelNotification = Swal.fire({
            title: 'Action annulée',
            text: "Vous avez annulé la suppression de l'agent.",
            icon: 'info',
            showConfirmButton: false, // Supprime le bouton "OK"
            timer: 2000, // Durée en millisecondes (par exemple, 3000 ms pour 3 secondes)
          });

          // Vous n'avez pas besoin de setTimeout pour fermer cette notification, car "timer" le fait automatiquement après la durée spécifiée.
        }
      });
  }

  //POPUP APRES CONFIRMATION DE SUPPRESSION
  popUpConfirmation() {
    let timerInterval = 2000;
    Swal.fire({
      position: 'center',
      text: 'Agent supprimé avec succès.',
      title: 'Agent supprimé',
      icon: 'success',
      heightAuto: false,
      showConfirmButton: false,
      // confirmButtonText: "OK",
      confirmButtonColor: '#0857b5',
      showDenyButton: false,
      showCancelButton: false,
      allowOutsideClick: false,
      timer: timerInterval, // ajouter le temps d'attente
      timerProgressBar: true, // ajouter la barre de progression du temps
    }).then((result) => {
      // Après avoir réussi à supprimer, mettez à jour l'état de la page
      //AFFICHER LA LISTE DES AGENTS PAR AGENCE
      this.agenceService.ListeAgentParAgence().subscribe((data) => {
        this.agent = data.agents.reverse();
        // console.log(this.agent);
      });
    });
  }
}
