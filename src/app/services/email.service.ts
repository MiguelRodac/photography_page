import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmailService {
  private readonly serviceId = environment.emailJs.serviceId;
  private readonly templateId = environment.emailJs.templateId;
  private readonly publicKey = environment.emailJs.publicKey;

  sendForm(data: Record<string, unknown>): Promise<void> {
    return emailjs
      .send(this.serviceId, this.templateId, data, this.publicKey)
      .then(() => undefined);
  }
}
