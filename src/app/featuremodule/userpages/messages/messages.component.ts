import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
import { Chat } from '../message/models/chat';
import { Message } from '../message/models/message';

// interface Message {
//   content: string;
//   isUser: boolean;
// }

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
  isProprietaire= false;
  roles: string[] = [];
  public chatData: any;
  searchText: any;
  secondUserName = "";

  chatId: any = sessionStorage.getItem('chatId');

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
  messageList: any;
  users: any;
  senderCheck: any;

  chatForm: FormGroup;

  chatObj: Chat = new Chat();
  messageObj: Message = new Message('', '', '');
  public chatList: any = [];

  timesRun2 = 0;

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
    private chatService: MessageService,
  ) {
    this.locale = localeId;
    this.chatForm = new FormGroup({
      replymessage: new FormControl()
    });
  }
  ngOnInit(): void {
   
    if (this.storageService.isLoggedIn()) {
      // this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
       if (this.roles.includes("ROLE_LOCATAIRE")) {
        this.isLocataire = true
      } else if (this.roles.includes("ROLE_AGENCE")) {
        this.isAgence = true
      } else if (this.roles.includes("ROLE_AGENT")) {
        // this.isAgent = true
      } else if (this.roles.includes("ROLE_PROPRIETAIRE")) {
        this.isProprietaire = true
      }
    }
    this.users=this.storageService.getUser()
    this.senderCheck = this.users.email;

    this.mercureService.subscribeToTopic('conversation').subscribe((message: any) => {
      this.conversation.push(message);
    });

    //AFFICHER LA LISTE DES CONVERSATIONS EN FONCTION DE USER
    this.serviceMessage.AfficherLaListeConversation().subscribe(data => {
      this.conversations = data.conversation.reverse();
      this.IdConver = this.conversations.id
    

      // Initialisation de la première conversation ici, par exemple :
      if (this.conversations && this.conversations.length > 0) {
        this.firstConversation = this.conversations[0]; // Supposons que conversations soit votre tableau de conversations
      }
    }
    );

   
    let getByname = setInterval(() => {
      // For getting all the chat list whose ever is logged in.
      this.chatService.getChatByFirstUserNameOrSecondUserName(this.senderCheck).subscribe(data => {
        this.chatData = data;
        
        this.chatList = this.chatData;
      });

      this.timesRun2 += 1;
      if (this.timesRun2 === 2) {
        clearInterval(getByname);
      }
    }, 1000);

    setInterval(() => {
      this.chatService.getChatById(sessionStorage.getItem("chatId")).subscribe(data => {
        this.chatData = data;
        this.messageList = this.chatData[0].messages;
        this.secondUserName = this.chatData[0].expediteurInfo.nom;
        // this.firstUserName = this.chatData.firstUserName;
      });
    }, 1000);
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
             this.storageService.clean();
            this.router.navigateByUrl("/auth/connexion")
          },
          error: err => {
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
 

      // Recherchez la conversation sélectionnée dans la liste des conversations
      const selectedConversation = this.conversations.find((conversation: { conversationId: number; }) => conversation.conversationId === conversationId);

      // Vérifiez si la conversation a été trouvée
      if (selectedConversation) {
        this.nomConversation = selectedConversation.nom;
        this.photoUserConversation = selectedConversation.photo;
        // Le nom de l'utilisateur est déjà inclus dans la conversation, vous pouvez l'utiliser ici
      }

  
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
       
          this.MessageForm.content = ''

          // Appel au service pour récupérer les détails de la conversation sélectionnée
          this.onConversationSelected(this.selectedConversationId)
        },
        error => {
        
        }
      );
    } else {
    
    }

    
  }

  ngOnDestroy() {
    // N'oubliez pas de vous désabonner lorsque le composant est détruit
    this.mercureService.unsubscribeFromTopic('messages');
  }
  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO;
    return baseUrl + photoFileName;
  }

  loadChatByEmail(event: string, event1: string) {
    // For removing the previous chatId
    sessionStorage.removeItem("chatId");

    // window.location.reload();

    // For checking the chat room by both the emails , if there is present then it will give the chat Id in sessionStorage
    this.chatService.getChatByFirstUserNameAndSecondUserName(event, event1).subscribe(data => {
       this.chatData = data;
      this.chatId = this.chatData[0].chatId;
      sessionStorage.setItem('chatId', this.chatId)
      window.location.reload();

      setInterval(() => {
        this.chatService.getChatById(this.chatId).subscribe(data => {
          this.chatData = data;
          this.messageList = this.chatData.messageList;
          this.secondUserName = this.chatData.secondUserName;
          // this.firstUserName = this.chatData.firstUserName;
        });
      }, 1000)

    });

  }

  sendMessage() {
    // This will call the update chat method when ever user send the message
    this.messageObj.message = this.MessageForm.content;
    this.messageObj.senderEmail = this.senderCheck; // Utilisation de l'opérateur de coalescence nulle pour fournir une valeur par défaut si la valeur récupérée est null
    this.chatService.updateChat(this.messageObj, this.chatId).subscribe(data => {
      this.MessageForm.content = ''
      // for displaying the messageList by the chatId
      this.chatService.getChatById(this.chatId).subscribe(data => {
        this.chatData = data;
        this.messageList = this.chatData.messageList;
        this.secondUserName = this.chatData.secondUserName;
        // this.firstUserName = this.chatData.firstUserName;

      })
    })
  }

  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }
}
