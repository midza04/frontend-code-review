import { Component } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';
import { CreateMessageComponent } from '../chat/components/message/create-message/create-message.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [ChatComponent, CreateMessageComponent],
  templateUrl: './layout.component.html',
  styles: ``,
})
export class LayoutComponent {
  title = 'Chat';
}
