import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { EmailRecipientsService } from './email-recipients.service';
import { CreateEmailRecipientDto, RecipientType } from './dto/create-email-recipient.dto';
import { UpdateEmailRecipientDto } from './dto/update-email-recipient.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('email-recipients')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class EmailRecipientsController {
  constructor(private readonly emailRecipientsService: EmailRecipientsService) {}

  @Get()
  async findAll() {
    const recipients = await this.emailRecipientsService.findAllForAdmin();
    return {
      success: true,
      recipients,
    };
  }

  @Get('membership')
  async findMembershipRecipients() {
    const recipients = await this.emailRecipientsService.findActiveByType(RecipientType.MEMBERSHIP);
    return {
      success: true,
      recipients,
    };
  }

  @Post()
  async create(@Body() dto: CreateEmailRecipientDto) {
    const recipient = await this.emailRecipientsService.create(dto);
    return {
      success: true,
      recipient,
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateEmailRecipientDto) {
    const recipient = await this.emailRecipientsService.update(id, dto);
    return {
      success: true,
      recipient,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.emailRecipientsService.delete(id);
    return {
      success: true,
      message: 'Email recipient deleted successfully',
    };
  }
}

