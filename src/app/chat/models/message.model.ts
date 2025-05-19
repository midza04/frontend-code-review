export class Message {
  constructor(public text: string, public status: 'draft' | 'pending' | 'sent' | 'failed') {}

  isEmpty(): boolean {
    return this.text.trim() === '';
  }
}
