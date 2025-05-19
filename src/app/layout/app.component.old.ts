import {Component, Injectable, Input, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Injectable()  // use `@Injectable({ providedIn: 'root' })` so you don’t need to list this in every component’s providers
class MessageService {
  messages: Message[] = [];

  async all() {
    const res = await fetch('http://127.0.0.1:4010/messages')
    // wrap fetch in a try/catch and handle non-200 status, or switch to Angular’s HttpClient for built-in error handling
    const data = await res.json();
    this.messages = data.messages.map((message: any) => new Message(message.text, message.status));
    // consider returning data or an Observable so components can reactively subscribe, rather than reading a shared array
  }

  async add(message: Message) {
    this.messages.push(message);
    // right now this only updates local state; if you need persistence, call the API here instead of in the component
  }
}

class Message {
  text;
  status: string;
  constructor(message: string, status: string) {
    this.text = message;
    this.status = status;
  }

  empty() {
    return this.text === '';
    // trim whitespace here, and maybe enforce non-empty via form validators instead
  }
}

@Component({
  selector: 'app-massage',  // typo in selector; rename to "app-message" for clarity
  standalone: true,
  template: `
    <div style="background-color: #fff;">
      <span class="bg-slate-400" class="block bg-slate-200 text-slate-500">#{{no}} - {{ message.status }}</span>
      <div class="p-2" [ngClass]="{'text-slate-500': message.status === 'draft'}">
        {{message.text}}
      </div>
    </div>
  `,
  imports: [
    NgClass
  ]
})
class MessageComponent {
  @Input({ required: true }) message: any;
  @Input() no: any;  // strongly type these inputs (`message: Message`, `no: number | 'preview'`)
}

@Component({
  selector: 'app-chat',
  standalone: true,
  providers: [MessageService],  // if you move to providedIn: 'root', remove this line so service is a singleton
  imports: [
    NgForOf,
    MessageComponent
  ],
  template: `
    <div>
      <div *ngFor="let message of messages; index as i;">
        <app-massage [message]="message" [no]="i"></app-massage>
      </div>
    </div>
  `,
})
class ChatComponent implements OnInit {
  messages: Message[] = [];
  constructor(
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    // consider subscribing to an Observable returned by service.all() instead of awaiting it, to support streaming or polling
    // handle errors here and show a loading spinner or error banner

    // @ts-ignore   // A code smell here, This is a workaround for TypeScript; ideally, you should define the type of `this.messageService` in the constructor
    await this.messageService.all();
    this.messages = this.messageService.messages;
  }
}

@Component({
  selector: 'app-create-message',
  standalone: true,
  providers: [MessageService],  // share the same service instance rather than creating another for this component
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MessageComponent,
    NgIf,
    NgClass,
  ],
  template: `
    <div *ngIf="! message.empty()">
      <app-massage [message]="message" no="preview"></app-massage>
      <!-- preview uses `no="preview"`, but your component expects a number—consider overloading or altering `no` type -->
    </div>
    <form (ngSubmit)="onSubmit()">
      <label class="mt-4">
        <div>Write Message</div>
        <textarea class="block w-full" required name="text" [(ngModel)]="message.text"></textarea>
        <!-- switch to reactive form controls for better validation and state management -->
      </label>

      <button type="submit"
          [disabled]="message.status === 'pending'"
          class="pointer bg-blue-400 py-2 px-4 mt-2 w-full"
          [ngClass]="{'bg-gray-400': message.status === 'pending'}"
      >Send</button>
    </form>
  `,
  styles: ``
})
class CreateMessageComponent {
  message: Message = new Message('', 'draft');
  private messageService: MessageService;

  constructor(messageService: MessageService) {
    this.messageService = messageService;
    // you could move preview logic into a child “MessagePreviewComponent” to separate concerns
  }

  async onSubmit() {
    this.message.status = 'pending';
    // sending via GET with JSON body is non-standard; use POST and set Content-Type header
    const res = await fetch('http://127.0.0.1:4010/messages/send', {
      method: 'GET',
      body: JSON.stringify({text: this.message.text}),
    });
    res.status === 204 ? this.message.status = 'sent' : this.message.status = 'failed';
    await this.messageService.add(this.message);
    this.message = new Message('', 'draft');
    // after sending, reset form via form control rather than recreating the object to keep binding stable
  }
}

