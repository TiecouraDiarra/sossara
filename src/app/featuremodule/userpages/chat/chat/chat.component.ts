import { Component, HostListener, Inject, LOCALE_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { UserService } from 'src/app/service/auth/user.service';
import { ChatserviceService } from '../chatservice/chatservice.service';
import { ChatMessage } from '../model/chat-message';
import { StorageService } from 'src/app/service/auth/storage.service';
import { environment } from 'src/app/environments/environment';

const URL_PHOTO: string = environment.Url_PHOTO;

interface GroupedMessages {
  date: string;
  messages: any[];
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  public routes = routes;
  locale!: string;
  isLocataire = false;
  isAgence = false;
  isProprietaire = false;
  profil: any;
  isMobile = false;
  users: any;
  chat: any;
  searchText: any;
  senderCheck: any;
  // messageInput: string = '';
  // userId: string="";
  // messageList: any[] = [];



  // constructor(
  //   private serviceUser: UserService,
  //   private chatService: ChatserviceService,
  //   private route: ActivatedRoute,
  //   @Inject(LOCALE_ID) private localeId: string,

  //   private router: Router,

  // ) {
  //   this.locale = localeId;

  // }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 767;

  }
  // ngOnInit(): void {
  //   // this.serviceUser.AfficherUserConnecter().subscribe((data) => {
  //   //   this.profil = data[0]?.profil;
  //   //   if (this.profil == 'LOCATAIRE') {
  //   //     this.isLocataire = true;
  //   //   } else if (this.profil == 'AGENCE' ) {
  //   //     this.isAgence = true; 
  //   //   } else if (this.profil == 'AGENT') {
  //   //     // this.isAgent = true
  //   //   } else if (this.profil == 'PROPRIETAIRE') {
  //   //     this.isProprietaire = true;
  //   //   }else {
  //   //   }
  //   // })

  // }

  messageInput: string = '';
  userId: string = "";
  messageList: any[] = [];
  message: any;
  NomSender: any;
  uuidChat: any;
  initialDest: any;
  initialEspe: any;
  initial: any;
  isChatPresent:Boolean=false;
  selectedConversation: any | null = null; // Conversation sélectionnée

  constructor(private chatService: ChatserviceService,
    private route: ActivatedRoute,
    @Inject(LOCALE_ID) private localeId: string,
    private storageService: StorageService,
    private serviceUser: UserService,
  ) {
    this.locale = localeId;
  }

  ngOnInit(): void {
    // this.userId = this.route.snapshot.params["userId"];
    this.uuidChat = window.sessionStorage.getItem("chatUuid")
    this.chatService.joinRoom(this.uuidChat);
    this.lisenerMessage();
    this.loadMessages(this.uuidChat);
    if(this.uuidChat=="null"){
      this.isChatPresent=false;
    }

    const Ma = new Date()
    console.log(Ma);
    

    //AFFICHER LA LISTE DES PERIODES
    this.chatService.AfficherChatUserConnecte().subscribe((data) => {
      this.chat = data;
    });
    this.serviceUser.AfficherUserConnecter().subscribe((data) => {
      this.users = data && data.length > 0 ? data[0] : null;
      this.profil = data[0]?.profil;
      this.senderCheck = this.users?.email;
      if (this.profil == 'LOCATAIRE') {
        this.isLocataire = true;
      } else if (this.profil == 'AGENCE') {
        this.isAgence = true;
      } else if (this.profil == 'AGENT') {
        // this.isAgent = true
      } else if (this.profil == 'PROPRIETAIRE') {
        this.isProprietaire = true;
      } else {
      }
    })
  }

  sendMessage() {
    if (this.storageService.isLoggedIn()) {
      this.serviceUser.AfficherUserConnecter().subscribe(
        (data) => {
          this.users = data && data.length > 0 ? data[0] : null;
          this.profil = data[0]?.profil;
          if (this.profil == 'AGENCE') {
            this.NomSender = this.users?.nomAgence;
          } else {
            this.NomSender = this.users?.nom;
          }

          const chatMessage = {
            message: this.messageInput,
            senderEmail: this.users?.email,
            senderNom: this.NomSender,
            time: new Date(),
          } as ChatMessage
          this.uuidChat = window.sessionStorage.getItem("chatUuid")
          this.chatService.sendMessage(this.uuidChat, chatMessage);
          this.messageInput = '';
        })
    }
  }

  groupedMessageList: GroupedMessages[] = [];

  lisenerMessage() {
    if (this.storageService.isLoggedIn()) {
      this.serviceUser.AfficherUserConnecter().subscribe(
        (data) => {
          this.users = data && data.length > 0 ? data[0] : null;
          this.chatService.getMessageSubject().subscribe((messages: any[]) => {
            this.messageList = messages.map((item: any) => ({
              ...item,
              message_side: item.senderEmail === this.users.email ? 'sender' : 'receiver',
              initials: this.getInitials(item.senderNom),
              timestamp: item.time ? new Date(item.time) : new Date()
            }));
            this.groupedMessageList = this.groupMessagesByDate(this.messageList);
          });
        },
        (error) => {
          console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error);
        }
      );
    }
  }
  

  getInitials(name: string): string {
    if (!name) {
      return '';
    }
    return name.split(' ').map((word: string) => word.charAt(0)).join('');
  }

  // Cette méthode pourrait être utilisée pour le routage vers les détails d'une conversation
  loadChatByEmail(destinateur: any, expediteur: any): void {
    // Implémente la navigation vers les détails de la conversation ici
    this.selectedConversation = { destinateur, expediteur };
    // this.loadMessages(); // Charge les messages de la conversation sélectionnée
  }

  loadMessages(uuid: any): void {
    // Implémente la logique pour charger les messages de la conversation sélectionnée
    // Par exemple, en appelant un service pour récupérer les messages
    // Exemple hypothétique :

    window.sessionStorage.setItem("chatUuid", uuid);
    if(window.sessionStorage.getItem("chatUuid")!="null"){
      // alert("je suis la")
      this.isChatPresent=true;
      this.chatService.getChatByUuid(uuid)
        .subscribe((messages) => {
          this.message = messages;
          this.initialDest = this.message?.destinateur?.nom.split(' ').map((name: string) => name.charAt(0)).join('');
          this.initialEspe = this.message?.destinateur?.nom.split(' ').map((name: string) => name.charAt(0)).join('');
  
          this.chatService.joinRoom(this.message?.uuid);
  
        });
    }
  }
  joinRoom(roomId: string) {
    return this.chatService.joinRoom(roomId);
  }

  // IMAGE PAR DEFAUT USER
  handleAuthorImageError(event: any) {
    event.target.src = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=';
  }
  //IMAGE
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO;
    return baseUrl + photoFileName;
  }

  expediteurImageError: boolean = false;
  destinateurImageError: boolean = false;

  handleImageError(event: Event, userType: string): void {
    (event.target as HTMLImageElement).style.display = 'none';
    if (userType === 'expediteur') {
      this.expediteurImageError = true;
    } else if (userType === 'destinateur') {
      this.destinateurImageError = true;
    }
  }

  groupMessagesByDate(messages: any[]): GroupedMessages[] {
    const groupedMessages: { [key: string]: any[] } = {};
    const today = new Date();
  
    messages.forEach(message => {
      const messageDate = new Date(message.timestamp);
      let displayDate;
  
      // Vérifier si c'est aujourd'hui
      if (
        messageDate.getDate() === today.getDate() &&
        messageDate.getMonth() === today.getMonth() &&
        messageDate.getFullYear() === today.getFullYear()
      ) {
        displayDate = 'Aujourd\'hui';
      }
      // Vérifier si c'était hier
      else if (
        messageDate.getDate() === today.getDate() - 1 &&
        messageDate.getMonth() === today.getMonth() &&
        messageDate.getFullYear() === today.getFullYear()
      ) {
        displayDate = 'Hier';
      }
      // Autres jours jusqu'à une semaine (7 jours)
      else if (
        messageDate >= new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6)
      ) {
        const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        displayDate = days[messageDate.getDay()];
      }
      // Sinon, afficher la date complète
      else {
        displayDate = messageDate.toLocaleDateString();
      }
  
      if (!groupedMessages[displayDate]) {
        groupedMessages[displayDate] = [];
      }
      groupedMessages[displayDate].push(message);
    });
  
    // Convertir l'objet en tableau de GroupedMessages
    return Object.keys(groupedMessages).map(date => ({
      date,
      messages: groupedMessages[date]
    }));
  }
  
  
  
  
  
}
