import { Component, HostListener, Inject, LOCALE_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { UserService } from 'src/app/service/auth/user.service';
import { ChatserviceService } from '../chatservice/chatservice.service';
import { ChatMessage } from '../model/chat-message';
import { StorageService } from 'src/app/service/auth/storage.service';

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
  uuidChat: any;
  initialDest: any;
  initialEspe: any;
  initial: any;
  isChatPresent:Boolean=false;
  selectedConversation: any | null = null; // Conversation sélectionnée

  constructor(private chatService: ChatserviceService,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private serviceUser: UserService,
  ) {

  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params["userId"];
    this.uuidChat = window.sessionStorage.getItem("chatUuid")
    this.chatService.joinRoom(this.uuidChat);
    this.lisenerMessage();
    this.loadMessages(this.uuidChat);
    if(this.uuidChat=="null"){
      this.isChatPresent=false;

    }

    //AFFICHER LA LISTE DES PERIODES
    this.chatService.AfficherChatUserConnecte().subscribe((data) => {
      this.chat = data;
      // console.log(this.chat);
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
          // console.log(this.users);

          const chatMessage = {
            message: this.messageInput,
            senderEmail: this.users?.email,
            senderNom: this.users?.nom
          } as ChatMessage
          this.uuidChat = window.sessionStorage.getItem("chatUuid")
          this.chatService.sendMessage(this.uuidChat, chatMessage);
          this.messageInput = '';
        })
    }
  }

  lisenerMessage() {
    if (this.storageService.isLoggedIn()) {
      this.serviceUser.AfficherUserConnecter().subscribe(
        (data) => {
          this.users = data && data.length > 0 ? data[0] : null;
          this.chatService.getMessageSubject().subscribe((messages: any) => {
            // console.log(messages);
            // this.initial = this.message?.senderNom?.split(' ').map((name: string) => name.charAt(0)).join('');
            
            this.messageList = messages.map((item: any) => ({
              ...item,
              message_side: item.senderEmail === this.users.email ? 'sender' : 'receiver',
              initials: this.getInitials(item.senderNom)
            }))
          });
        })
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
    // console.log('Load chat for:', destinateur, expediteur);
    this.selectedConversation = { destinateur, expediteur };
    // this.loadMessages(); // Charge les messages de la conversation sélectionnée
  }

  loadMessages(uuid: any): void {
    // Implémente la logique pour charger les messages de la conversation sélectionnée
    // Par exemple, en appelant un service pour récupérer les messages
    // Exemple hypothétique :

    window.sessionStorage.setItem("chatUuid", uuid);
    if(window.sessionStorage.getItem("chatUuid")!="null"){
      alert("je suis la")
      this.isChatPresent=true;
    }
    this.chatService.getChatByUuid(uuid)
      .subscribe((messages) => {
        this.message = messages;
        // console.log(this.message);
        this.initialDest = this.message?.destinateur?.nom.split(' ').map((name: string) => name.charAt(0)).join('');
        this.initialEspe = this.message?.destinateur?.nom.split(' ').map((name: string) => name.charAt(0)).join('');
        // console.log(initials);
        
        this.chatService.joinRoom(this.message?.uuid);

      });
  }
  joinRoom(roomId: string) {
    return this.chatService.joinRoom(roomId);
  }
}
