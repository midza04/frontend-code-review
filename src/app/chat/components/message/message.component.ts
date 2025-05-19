import {Component, Input} from '@angular/core';
import {Message} from "../../models/message.model";
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [NgClass],
  templateUrl: './message.component.html',
  styles: ``,
})
export class MessageComponent {
  @Input({ required: true }) message!: Message;
  @Input() no: number | string = '';
}
