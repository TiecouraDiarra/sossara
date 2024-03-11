import { Message } from "./message";

export class Chat {

    chatId: Number | undefined;
    expediteur: string | undefined;
    destinateur: string | undefined;
    messageList: Message[] | undefined;

    constructor() {

    }
}
