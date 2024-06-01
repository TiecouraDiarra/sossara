import {
  Component,
  ElementRef,
  Inject,
  LOCALE_ID,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { AdresseService } from 'src/app/service/adresse/adresse.service';
import { AgenceService } from 'src/app/service/agence/agence.service';
import { AuthService } from 'src/app/service/auth/auth.service';
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
  // public commune = [
  //   'Commune',
  //   'Commune 1',
  //   'Commune 2',
  //   'Commune 3',
  //   'Commune 4',
  //   'Commune 5',
  //   'Commune 6',
  // ];

  public Bookmarksdata: any = [];
  public electronics: any = [];
  agent: any;
  MotdePasseAgent: any;
  loading = false;
  searchText: any;
  message: string | undefined;
  nomAgence: any;
  p1: number = 1;
  currentUser: any;
  commune: any;

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
    private serviceAuth: AuthService,
    private storageService: StorageService,
    private serviceAdresse: AdresseService,
    private agenceService: AgenceService,
    private serviceBienImmo: BienimmoService
  ) {
    this.locale = localeId;
    this.Bookmarksdata = this.dataservice.Bookmarksdata;
  }
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      // Charger la liste des utilisateurs lors de l'initialisation
      this.currentUser = this.storageService.getUser();
      // this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
      // this.nomAgence = this.storageService.getUser().nom;
      // Récupérer les données de l'utilisateur connecté
      if (this.roles.includes("ROLE_LOCATAIRE")) {
        this.isLocataire = true
      } else if (this.roles.includes("ROLE_AGENCE")) {
        this.isAgence = true
      } else if (this.roles.includes("ROLE_AGENT")) {
        // this.isAgent = true
      }
    }

    //AFFICHER LA LISTE DES AGENTS PAR AGENCE
    this.agenceService.ListeAgentParAgence().subscribe((data) => {
      this.agent = data.agents.reverse();
      console.log(this.agent);

    });

    //AFFICHER LA LISTE DES COMMUNES
    this.serviceAdresse.AfficherListeCommune().subscribe((data) => {
      this.commune = data;
    });
  }
  // Dans votre composant TypeScript

  // Définition de la liste des états
  states: boolean[] = [true, false]; // Par exemple, true pour actif et false pour inactif

  // Variable pour stocker l'état sélectionné
  selectedState: boolean | null = null; // initialisé à null pour inclure tous les états par défaut

  // Fonction appelée lorsqu'un état est sélectionné
  onStateSelectionChange(event: any) {
    this.selectedState = event.value;
  }

  // Méthode de filtrage pour l'état
  filterAgentsByState(agents: any[]): any[] {
    if (this.selectedState === null) {
        return agents; // Si aucun état n'est sélectionné, retournez tous les agents
    } else if (this.selectedState === true || this.selectedState === false) {
        return agents.filter(agent => agent.etat === this.selectedState); // Filtrer par l'état sélectionné
    } else if (this.selectedState === 'Inactif') {
        return agents.filter(agent => agent.etat === false); // Filtrer pour "Inactif"
    }
    
    return agents; // Cas de retour par défaut si aucun des cas précédents n'est rencontré
}




  selectedCommune: any;

  //RECHERCHER PAR COMMUNE
  onCommuneSelectionChange(event: any) {
    this.selectedCommune = event.value;
  }

  selectedEtat: any;
  //RECHERCHER PAR ETAT
  onEtatSelectionChange(event: any) {
    this.selectedEtat = event.value;
  }

  // Déclarez une variable pour stocker l'ID du Agent sélectionné
  selectedAgentId: any;
  public Toggledata = true;
  type = true;
  selectedCategory: any = '';
  public categories: any = [];
  categoriesDataSource = new MatTableDataSource();
  searchInputCategory: any;
  searchCategory(value: any): void {
    const filterValue = value;
    this.categoriesDataSource.filter = filterValue.trim().toLowerCase();
    this.categories = this.categoriesDataSource.filteredData;
  }

  toggleStatut(event: any) {
    this.agent.statut = event.target.checked;
  }
  iconLogle() {
    this.Toggledata = !this.Toggledata;
  }

  openIsActiveModal(agentId: number) {
    // Stockez l'ID du Agent sélectionné dans la variable
    this.selectedAgentId = agentId;
    console.log(this.selectedAgentId);

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
              this.loading = true; // Affiche l'indicateur de chargement
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
                    if (data.status) {
                      let timerInterval = 2000;
                      Swal.fire({
                        position: 'center',
                        text: data.message,
                        title: "Ajout d'un agent",
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
                        // Une fois la génération terminée, masquez l'indicateur de chargement
                        this.loading = false;
                        window.location.reload();
                        //AFFICHER LA LISTE DES AGENTS PAR AGENCE
                        this.agenceService
                          .ListeAgentParAgence()
                          .subscribe((data) => {
                            this.agent = data.agents.reverse();
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
                      }).then((result) => {
                        // Une fois la génération terminée, masquez l'indicateur de chargement
                        this.loading = false;
                      });
                    }
                  },
                  (error) => {

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
      });
    });
  }

  //LA METHODE PERMETTANT DE NAVIGUER VERS LA PAGE DETAILS AGENT
  goToDettailAgent(id: number) {
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
                // this.errorMessage = 'Candidature envoyée avec succès';
                // this.isCandidatureSent = true;
                // Afficher le premier popup de succès
                this.popUpConfirmation();
              },
              error: (err) => {

                this.errorMessage = err.error.message;

              },
            });
          } else {

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
      });
    });
  }

  form: any = {
    telephoneOrEmail: null,
    password: null,
  };

  resetForm() {
    // Réinitialiser le formulaire ici
    this.form = {
      telephoneOrEmail: null,
      password: null,
    };
  }


  Active() {
    this.form.telephoneOrEmail = this.currentUser?.email || this.currentUser?.telephone;
    const { telephoneOrEmail, password } = this.form;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: '',
        cancelButton: '',
      },
      heightAuto: false
    });

    this.serviceAuth.login(telephoneOrEmail, password).subscribe((data) => {
      return this.serviceUser.active(this.selectedAgentId).subscribe(
        (response) => {
          if (response.status) {
            let timerInterval = 2000;
            Swal.fire({
              position: 'center',
              text: response.message,
              title: "Modification de profil",
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
              window.location.reload();
              //AFFICHER LA LISTE DES AGENTS PAR AGENCE
              this.agenceService.ListeAgentParAgence().subscribe((data) => {
                this.agent = data.agents.reverse();
              });
            });
          } else {
            Swal.fire({
              position: 'center',
              text: response.message,
              title: 'Erreur',
              icon: 'error',
              heightAuto: false,
              showConfirmButton: true,
              confirmButtonText: 'OK',
              confirmButtonColor: '#0857b5',
              showDenyButton: false,
              showCancelButton: false,
              allowOutsideClick: false,
            }).then((result) => {
              // Actions à entreprendre après fermeture de l'alerte
            });
          }
        },
        (error) => {
          // Gestion des erreurs de l'appel API bannir
          Swal.fire({
            position: 'center',
            text: "Erreur lors de la tentative de bannissement",
            title: 'Erreur',
            icon: 'error',
            heightAuto: false,
            showConfirmButton: true,
            confirmButtonText: 'OK',
            confirmButtonColor: '#0857b5',
            showDenyButton: false,
            showCancelButton: false,
            allowOutsideClick: false,
          });
        }
      );
    }, (error) => {
      // Gestion des erreurs en cas d'échec de la connexion
      const errorMessage = error.error && error.error.message ? error.error.message : 'Erreur inconnue';
      swalWithBootstrapButtons.fire(
        "",
        `<h1 style='font-size: 1em !important; font-weight; bold; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>Mot de passe incorrect</h1>`,
        "error"
      );
    });
  }
}
