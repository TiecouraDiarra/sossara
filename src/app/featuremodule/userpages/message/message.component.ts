import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Chat } from './models/chat';
import { Message } from './models/message';
import { MessageService } from 'src/app/service/message/message.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/auth/user.service';
import { StorageService } from 'src/app/service/auth/storage.service';




@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  chatForm: FormGroup;
  chatObj: Chat = new Chat();
  messageObj: Message = new Message('', '', '');

  
  // messages: Message[] = [];
  // chatId: number = 22;
  public messageList: any = [];
  public chatList: any = [];
  replymessage: String = "checking";
  public chatData: any;
  msg = "Good work";
  chatId: any = sessionStorage.getItem('chatId');
  color = "";
  secondUserName = "";
  public alluser: any = [];
  check = this.storageServices.getUser();
  timesRun = 0;
  timesRun2 = 0;


  
  senderEmail = sessionStorage.getItem('username');

  users: any;
  expediteur: any;
  senderCheck: any;
  chat: any;

  constructor(    private storageServices: StorageService,private chatService: MessageService, private router: Router, private userService: UserService) {
    this.chatForm = new FormGroup({
      replymessage: new FormControl()
    });

  }

  ngOnInit(): void {
    setInterval(() => {
      this.chatService.getChatById(sessionStorage.getItem('chatId')).subscribe(data => {
        this.chatData = data;
        console.log("mes datas dd",this.chatData)
        this.messageList = this.chatData.messages;
        this.secondUserName = this.chatData.destinateur;
        // this.firstUserName = this.chatData.firstUserName;
      });
    }, 1000);

    this.users=this.storageServices.getUser()
    console.log(this.users.email)
    this.senderCheck = this.users.email;

    let getByname = setInterval(() => {
      // For getting all the chat list whose ever is logged in.
      this.chatService.getChatByFirstUserNameOrSecondUserName(this.senderCheck).subscribe(data => {
        console.log("mine", data);
        this.chatData = data;
        this.chatList = this.chatData;
      });

      this.timesRun2 += 1;
      if (this.timesRun2 === 2) {
        clearInterval(getByname);
      }
    }, 1000);

    let all = setInterval(() => {

      this.userService.AfficherLaListeAgence().subscribe((data) => {
        console.log("d", data);
        this.alluser = data;

      })

      this.timesRun += 1;
      if (this.timesRun === 2) {
        clearInterval(all);
      }
    }, 1000);


  }

  loadChatByEmail(event: string, event1: string) {
    console.log(event, event1);
    // For removing the previous chatId
    sessionStorage.removeItem("chatId");

    // window.location.reload();

    // For checking the chat room by both the emails , if there is present then it will give the chat Id in sessionStorage
    this.chatService.getChatByFirstUserNameAndSecondUserName(event, event1).subscribe(data => {
      // console.log(data);
      this.chatData = data;
      this.chatId = this.chatData[0].chatId;
      console.log(this.chatId);
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
    console.log(this.chatForm.value);

    // This will call the update chat method when ever user send the message
    this.messageObj.message = this.chatForm.value.replymessage;
    this.messageObj.senderEmail = this.senderCheck; // Utilisation de l'opérateur de coalescence nulle pour fournir une valeur par défaut si la valeur récupérée est null
   
    console.log("mes message", this.messageObj)
    this.chatService.updateChat(this.messageObj, this.chatId).subscribe(data => {
      console.log(data);
      this.chatForm.reset();

      // for displaying the messageList by the chatId
      this.chatService.getChatById(this.chatId).subscribe(data => {
        console.log(data);
        this.chatData = data;
        // console.log(this.chatData.messageList);console.log(JSON.stringify(this.chatData.messageList));
        this.messageList = this.chatData.messageList;
        this.secondUserName = this.chatData.secondUserName;
        // this.firstUserName = this.chatData.firstUserName;

      })
    })
  }

  routeX() {
    // this.router.navigateByUrl('/navbar/recommendation-service');
    sessionStorage.clear();
    // window.location.reload();
    this.router.navigateByUrl('');
  }

  routeHome() {
    this.router.navigateByUrl('');
  }


  goToChat(username: any) {
    this.chatService.getChatByFirstUserNameAndSecondUserName(username, this.users.email).subscribe(
      (data) => {
        this.chat = data;

        this.chatId = this.chat[0].chatId;
        console.log("chaId",)
        sessionStorage.setItem("chatId", this.chatId);
      },
      (error) => {
        if (error.status == 404) {
          this.chatObj.expediteur =this.users.email; // Utilisation de l'opérateur de coalescence nulle pour fournir une valeur par défaut si la valeur récupérée est null
          this.chatObj.destinateur = username;
          this.chatService.createChatRoom(this.chatObj).subscribe(
            (data) => {
              this.chatData = data;
              this.chatId = this.chatData.chatId;
              sessionStorage.setItem("chatId", this.chatData.chatId);
            })
        } else {

        }
      });

  }

}
