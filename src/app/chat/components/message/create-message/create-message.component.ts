import { Component } from '@angular/core';
import { MessageComponent } from '../message.component';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { Message } from '../../../models/message.model';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-create-message',
  standalone: true,
  imports: [MessageComponent, FormsModule, NgClass, NgIf],
  templateUrl: './create-message.component.html',
  styles: ``,
})
export class CreateMessageComponent {
  message: Message = new Message('', 'draft');
  constructor(private messageService: MessageService) {}

  async onSubmit() {
    try {
      const { text } = this.message;
      await this.messageService.send(text);
      this.message = new Message('', 'draft');
    } catch (error) {
      this.message.status = 'failed';
    } finally {
      this.message = new Message('', 'draft');
    }
  }
}
