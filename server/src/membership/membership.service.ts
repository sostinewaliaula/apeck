import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import { KNEX_CONNECTION } from '../database/database.constants';
import { EmailService } from '../email/email.service';
import { EmailRecipientsService } from '../email-recipients/email-recipients.service';
import { RecipientType } from '../email-recipients/dto/create-email-recipient.dto';
import { CreateMembershipApplicationDto } from './dto/create-membership-application.dto';

@Injectable()
export class MembershipService {
  private readonly logger = new Logger(MembershipService.name);

  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex: Knex,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly emailRecipientsService: EmailRecipientsService,
  ) {}

  async createApplication(dto: CreateMembershipApplicationDto) {
    const id = uuid();

    const [application] = await this.knex('membership_applications')
      .insert({
        id,
        full_name: dto.fullName,
        phone: dto.phone,
        id_number: dto.idNumber,
        email: dto.email,
        county: dto.county,
        sub_county: dto.subCounty || null,
        ward: dto.ward || null,
        diaspora_country: dto.diasporaCountry || null,
        mpesa_code: dto.mpesaCode || null,
        payment_reference: dto.paymentReference,
        payment_gateway: dto.paymentGateway,
        amount_paid: dto.amountPaid,
        membership_tier: dto.membershipTier,
        status: 'pending',
        email_sent: false,
      })
      .returning('*');

    this.logger.log(`Created membership application: ${id}`);

    // Send email asynchronously (don't wait for it)
    this.sendApplicationEmail(application, dto).catch((error) => {
      this.logger.error('Failed to send application email:', error);
    });

    return application;
  }

  private async sendApplicationEmail(application: any, dto: CreateMembershipApplicationDto) {
    try {
      // Get recipients from database, fallback to env if none configured
      let recipientEmails: string[] = [];
      
      try {
        recipientEmails = await this.emailRecipientsService.findActiveByType(RecipientType.MEMBERSHIP);
      } catch (error) {
        // Table might not exist yet (migration not run), log and continue with env fallback
        this.logger.warn('Could not fetch email recipients from database, using env fallback:', error);
      }
      
      if (recipientEmails.length === 0) {
        // Fallback to env variable if no recipients configured
        const envRecipient = this.configService.get<string>('email.membershipRecipient', 'membership@apeck.org');
        if (envRecipient) {
          recipientEmails = [envRecipient];
        }
      }

      if (recipientEmails.length === 0) {
        this.logger.warn('No email recipients configured for membership applications');
        return;
      }

      const emailSent = await this.emailService.sendMembershipApplicationEmail({
        recipientEmails,
        applicantName: dto.fullName,
        applicantEmail: dto.email,
        paymentReference: dto.paymentReference,
        membershipTier: dto.membershipTier,
        amountPaid: dto.amountPaid,
        formData: {
          fullName: dto.fullName,
          phone: dto.phone,
          idNumber: dto.idNumber,
          email: dto.email,
          county: dto.county,
          subCounty: dto.subCounty,
          ward: dto.ward,
          diasporaCountry: dto.diasporaCountry,
          mpesaCode: dto.mpesaCode,
        },
      });

      if (emailSent) {
        await this.knex('membership_applications')
          .where({ id: application.id })
          .update({
            email_sent: true,
            email_sent_at: this.knex.fn.now(),
          });
        this.logger.log(`Email sent for application: ${application.id}`);
      }
    } catch (error) {
      this.logger.error(`Error sending email for application ${application.id}:`, error);
    }
  }

  async findAll() {
    return this.knex('membership_applications').orderBy('created_at', 'desc');
  }

  async findById(id: string) {
    return this.knex('membership_applications').where({ id }).first();
  }

  async findByPaymentReference(reference: string) {
    return this.knex('membership_applications').where({ payment_reference: reference }).first();
  }
}

