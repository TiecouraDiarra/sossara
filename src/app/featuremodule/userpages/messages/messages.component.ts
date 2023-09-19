import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/app/environments/environment';
import { AuthService } from 'src/app/service/auth/auth.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { DataService } from 'src/app/service/data.service';
import { MercureService } from 'src/app/service/mercure/mercure.service';
import { MessageService } from 'src/app/service/message/message.service';
import Swal from 'sweetalert2';

interface Message {
  content: string;
  isUser: boolean;
}

interface Conversation {
  id: number;
  name: string;
  messages: Message[];
}

const URL_PHOTO: string = environment.Url_PHOTO;


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  public routes = routes;
  messages: any
  conversation: any
  conversations: any
  locale!: string;
  isLocataire = false;
  isAgence = false;
  roles: string[] = [];

  searchText: any;

  selectedConversationId!: number;

  IdConver: any
  nombreconversation: number = 0

  MessageForm: any = {
    content: null,
  }


  selectedConversation: Conversation | null = null;
  nomConversation: any
  photoUserConversation: any
  // Déclarez la variable firstConversation
  firstConversation: any; // Vous pouvez remplacer 'any' par le type de données approprié pour vos conversations
  newMessage: string = '';
  filteredMessages: any[] = []; // Déclarez une nouvelle variable pour les messages filtrés
  filteredMessagesUserCurrent: any[] = []; // Déclarez une nouvelle variable pour les messages filtrés

  selectConversation(conversation: Conversation) {
    this.selectedConversation = conversation;
  }
  constructor(
    private dataservice: DataService,
    private authService: AuthService,
    private storageService: StorageService,
    private serviceMessage: MessageService,
    private serviceUser: UserService,
    @Inject(LOCALE_ID) private localeId: string,
    private mercureService: MercureService,
    private router: Router,
  ) {
    this.locale = localeId;
  }
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      // this.isLoggedIn = true;
      this.roles = this.storageService.getUser().user.role;
      console.log(this.roles);
      if (this.roles[0] == "ROLE_LOCATAIRE") {
        this.isLocataire = true
      } else if (this.roles[0] == "ROLE_AGENCE") {
        this.isAgence = true
      }
    }

    this.mercureService.subscribeToTopic('conversation').subscribe((message: any) => {
      this.conversation.push(message);
    });

    //AFFICHER LA LISTE DES CONVERSATIONS EN FONCTION DE USER
    this.serviceMessage.AfficherLaListeConversation().subscribe(data => {
      this.conversations = data.conversation.reverse();
      this.IdConver = this.conversations.id
      console.log(this.conversations);
      console.log(this.conversations.nom);

      // Initialisation de la première conversation ici, par exemple :
      if (this.conversations && this.conversations.length > 0) {
        this.firstConversation = this.conversations[0]; // Supposons que conversations soit votre tableau de conversations
      }
    }
    );

    //AFFICHER UNE CONVERSATION
    // this.serviceMessage.AfficherUneConversation(2).subscribe(data => {
    //   this.conversation = data.reverse();
    //   this.nombreconversation = data.length;
    //   console.log(this.conversation);
    // }
    // );
  }

  //METHODE PERMETTANT DE SE DECONNECTER
  logout(): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
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
            console.log(res);
            this.storageService.clean();
            this.router.navigateByUrl("/auth/connexion")
          },
          error: err => {
            console.log(err);
          }
        });
      }
    })

  }

  selectedUserName: string = '';
  // Ajoutez une variable de drapeau pour suivre si une conversation est sélectionnée
  conversationSelectionnee = false;



  onConversationSelected(conversationId: number) {
    this.selectedConversationId = conversationId;
    // Marquez la conversation comme sélectionnée
    this.conversationSelectionnee = true;

    // Appel au service pour récupérer les détails de la conversation sélectionnée
    this.serviceMessage.AfficherUneConversation(this.selectedConversationId).subscribe(data => {
      this.messages = data.reverse();
      // this.filteredMessagesUserCurrent = this.messages.filter((message: { mine: boolean; }) => message.mine === true);
      // this.filteredMessages = this.messages.filter((message: { mine: boolean; }) => message.mine === false);
      this.nombreconversation = data.length;
      console.log(this.messages);
      // Stockez le nom de la conversation dans this.nomConversation
      // this.nomConversation = data[0].nomConversation; // Supposons que le nom de la conversation est dans data[0]

      // Mettez à jour le nom de l'utilisateur sélectionné
      // this.selectedUserName = data[0].nomUtilisateur; // Supposons que le nom de l'utilisateur est dans data[0]

      // console.log(this.messages);
      // console.log(this.conversations.nom);

      // Recherchez la conversation sélectionnée dans la liste des conversations
      const selectedConversation = this.conversations.find((conversation: { conversationId: number; }) => conversation.conversationId === conversationId);

      // Vérifiez si la conversation a été trouvée
      if (selectedConversation) {
        this.nomConversation = selectedConversation.nom;
        this.photoUserConversation = selectedConversation.photo;
        // Le nom de l'utilisateur est déjà inclus dans la conversation, vous pouvez l'utiliser ici
      }

      console.log(this.nomConversation);
      console.log(this.photoUserConversation);
    });
  }

  //METHODE PERMETTANT D'ENVOYER UN MESSAGE
  EnvoyerMessage(conversationId: number): void {

    const user = this.storageService.getUser();
    this.selectedConversationId = conversationId;

    if (user && user.token) {
      // Définissez le token dans le service notificationService
      this.serviceUser.setAccessToken(user.token);



      // Appelez la méthode Fairenotification() avec le contenu et l'ID
      this.serviceMessage.EnvoyerMessage(this.MessageForm.content, this.selectedConversationId).subscribe(
        data => {
          console.log("Message envoyé avec succès:", data);
          // this.isSuccess = false;
          this.MessageForm.content = ''

          // Appel au service pour récupérer les détails de la conversation sélectionnée
          this.onConversationSelected(this.selectedConversationId)
        },
        error => {
          console.error("Erreur lors de l'envoi du message :", error);
          // Gérez les erreurs ici
        }
      );
    } else {
      console.error("Token JWT manquant");
    }

    //Faire un notification
    //  this.servicenotification.Fairenotification(this.notificationForm.contenu, this.id).subscribe(data=>{
    //   console.log(data);
    // });
  }

  ngOnDestroy() {
    // N'oubliez pas de vous désabonner lorsque le composant est détruit
    this.mercureService.unsubscribeFromTopic('messages');
  }
  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO + '/uploads/images/';
    return baseUrl + photoFileName;
  }

  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }
}
