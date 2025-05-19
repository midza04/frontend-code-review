import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private readonly apiUrl = 'http://127.0.0.1:4010/messages';
  messages: Message[] = [];

  constructor(private http: HttpClient) {}

  /**
   * Using Angular's HttpClient to return an Observable allows better integration with Angular's reactive patterns.
   * It's cancellable, composable, and works seamlessly with RxJS operators and the async pipe in templates.
   */
  fetchMessages(): Observable<Message[]> {
    return this.http
      .get<{ messages: any[] }>(this.apiUrl)
      .pipe(
        map((res) =>
          res.messages.map((msg) => new Message(msg.text, msg.status)),
        ),
      );
  }

  async send(text: string): Promise<Message> {
    const message = new Message(text, 'pending');
    try {
      console.log(JSON.stringify({ text }));
      const res = await fetch(this.apiUrl + '/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      message.status = res.status === 204 ? 'sent' : 'failed';
      this.messages.push(message);
      return message;
    } catch (error) {
      message.status = 'failed';
      console.error('Send failed', error);
      this.messages.push(message);
      return message;
    }
  }

  add(message: Message): void {
    this.messages.push(message);
  }

  getMessages(): Message[] {
    return this.messages;
  }
}
