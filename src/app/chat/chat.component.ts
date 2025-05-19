import { Component, OnInit } from '@angular/core';
import { MessageComponent } from './components/message/message.component';
import { MessageService } from './services/message.service';
import { Message } from './models/message.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [MessageComponent],
  templateUrl: './chat.component.html',
  styles: ``,
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.messageService.fetchMessages().subscribe((messages) => {
      this.messages = messages;
    });
  }
}
