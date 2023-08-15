import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { AuthService } from 'src/app/service/auth/auth.service';
import { StorageService } from 'src/app/service/auth/storage.service';
import { UserService } from 'src/app/service/auth/user.service';
import { DataService } from 'src/app/service/data.service';
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

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit{
  public routes=routes;
  messages: any
  conversation : any
  selectedConversationId!: number;
  
  IdConver : any
  nombreconversation: number = 0

  MessageForm: any = {
    content: null,
  }


  selectedConversation: Conversation | null = null;
  newMessage: string = '';

  selectConversation(conversation: Conversation) {
    this.selectedConversation = conversation;
  }
  constructor(
    private dataservice:DataService,
    private authService: AuthService,
    private storageService: StorageService,
    private serviceMessage: MessageService,
    private serviceUser: UserService,
    private router: Router,
    ){}
  ngOnInit(): void {

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
        this.nombreconversation = data.length;
        console.log(this.conversation);
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

          //AFFICHER LA LISTE DES MESSAGES
          // this.serviceCommentaire.AfficherCommentaireParBien(this.id).subscribe(data => {
          //   this.commentaire = data.reverse();
          //   console.log(this.commentaire);
          // });
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
}
