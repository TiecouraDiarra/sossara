export class Message {
    senderEmail: string;
    time: string;
    message: string;
  
    constructor(senderEmail: string, time: string = '', message: string = '') {
        this.senderEmail = senderEmail || ''; // Utilisation de l'opérateur de coalescence nulle pour fournir une valeur par défaut si senderEmail est null
        this.time = time;
        this.message = message;
    }
  }
  
