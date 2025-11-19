import { Body, Controller, Post } from '@nestjs/common';

import { ContactService } from './contact.service';
import { SendContactMessageDto } from './dto/send-contact-message.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async sendContactMessage(@Body() dto: SendContactMessageDto) {
    await this.contactService.sendContactMessage(dto);
    return {
      success: true,
      message: 'Thank you! Your message has been received.',
    };
  }
}
