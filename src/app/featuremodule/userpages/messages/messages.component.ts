import { Component, OnInit } from '@angular/core';
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
  searchText: any;

  selectedConversationId!: number;

  IdConver: any
  nombreconversation: number = 0

  MessageForm: any = {
    content: null,
  }


  selectedConversation: Conversation | null = null;
  nomConversation: any
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
    private mercureService: MercureService,
    private router: Router,
  ) { }
  ngOnInit(): void {

    this.mercureService.subscribeToTopic('conversation').subscribe((message: any) => {
      this.conversation.push(message);
    });

    //AFFICHER LA LISTE DES CONVERSATIONS EN FONCTION DE USER
    this.serviceMessage.AfficherLaListeConversation().subscribe(data => {
      this.messages = data.conversation;
      this.IdConver = this.messages.id
      console.log(this.messages);
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


  onConversationSelected(conversationId: number) {
    this.selectedConversationId = conversationId;

    // Appel au service pour récupérer les détails de la conversation sélectionnée
    this.serviceMessage.AfficherUneConversation(this.selectedConversationId).subscribe(data => {
      this.conversation = data.reverse();
      this.filteredMessagesUserCurrent = this.conversation.filter((message: { mine: boolean; }) => message.mine === true);
      this.filteredMessages = this.conversation.filter((message: { mine: boolean; }) => message.mine === false);
      this.nombreconversation = data.length;
      console.log(this.conversation);

      // Mettre à jour le nom de la conversation sélectionnée
      this.nomConversation = this.messages[0].nom; // Remplacez par le nom de la conversation issu des données
      //  const nomConversationDiv = document.getElementById('nom-conversation');
      //  nomConversationDiv.textContent = nomConversation;

      console.log(this.nomConversation);
    });
  }

  //METHODE PERMETTANT D'ENVOYER UN MESSAGE
  EnvoyerMessage(conversationId: number): void {

    const user = this.storageService.getUser();
    this.selectedConversationId = conversationId;

    if (user && user.token) {
      // Définissez le token dans le service CommentaireService
      this.serviceUser.setAccessToken(user.token);



      // Appelez la méthode FaireCommentaire() avec le contenu et l'ID
      this.serviceMessage.EnvoyerMessage(this.MessageForm.content, this.selectedConversationId).subscribe(
        data => {
          console.log("Message envoyé avec succès:", data);
          // this.isSuccess = false;

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

    //Faire un Commentaire
    //  this.serviceCommentaire.FaireCommentaire(this.CommentaireForm.contenu, this.id).subscribe(data=>{
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
