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

    // Determine payment reference - use Pesapal reference if available, otherwise M-Pesa code
    const paymentRef =
      dto.paymentReference || dto.mpesaCode || `MPESA-${Date.now()}`;
    const paymentGateway =
      dto.paymentGateway || (dto.paymentReference ? 'pesapal' : 'mpesa');
    const amountPaid = dto.amountPaid || 0;

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
        church_name: dto.churchName || null,
        title: dto.title || null,
        title_other: dto.titleOther || null,
        referral_name: dto.referralName || null,
        referral_apeck_number: dto.referralApeckNumber || null,
        referral_phone: dto.referralPhone || null,
        signature: dto.signature || null,
        declaration_date: dto.declarationDate || null,
        organization_name: dto.organizationName || null,
        organization_registration_number:
          dto.organizationRegistrationNumber || null,
        organization_kra_pin: dto.organizationKraPin || null,
        headquarters_location: dto.headquartersLocation || null,
        organization_email: dto.organizationEmail || dto.email,
        organization_phone: dto.organizationPhone || dto.phone,
        chairperson_name: dto.chairpersonName || null,
        chairperson_id_number: dto.chairpersonIdNumber || null,
        chairperson_kra_pin: dto.chairpersonKraPin || null,
        chairperson_phone: dto.chairpersonPhone || null,
        chairperson_email: dto.chairpersonEmail || null,
        secretary_name: dto.secretaryName || null,
        secretary_id_number: dto.secretaryIdNumber || null,
        secretary_kra_pin: dto.secretaryKraPin || null,
        secretary_phone: dto.secretaryPhone || null,
        secretary_email: dto.secretaryEmail || null,
        treasurer_name: dto.treasurerName || null,
        treasurer_id_number: dto.treasurerIdNumber || null,
        treasurer_kra_pin: dto.treasurerKraPin || null,
        treasurer_phone: dto.treasurerPhone || null,
        treasurer_email: dto.treasurerEmail || null,
        payment_reference: paymentRef,
        payment_gateway: paymentGateway,
        amount_paid: amountPaid,
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

  private async sendApplicationEmail(
    application: any,
    dto: CreateMembershipApplicationDto,
  ) {
    try {
      // Get recipients from database, fallback to env if none configured
      let recipientEmails: string[] = [];

      try {
        recipientEmails = await this.emailRecipientsService.findActiveByType(
          RecipientType.MEMBERSHIP,
        );
      } catch (error) {
        // Table might not exist yet (migration not run), log and continue with env fallback
        this.logger.warn(
          'Could not fetch email recipients from database, using env fallback:',
          error,
        );
      }

      if (recipientEmails.length === 0) {
        // Fallback to env variable if no recipients configured
        const envRecipient = this.configService.get<string>(
          'email.membershipRecipient',
          'membership@apeck.org',
        );
        if (envRecipient) {
          recipientEmails = [envRecipient];
        }
      }

      if (recipientEmails.length === 0) {
        this.logger.warn(
          'No email recipients configured for membership applications',
        );
        return;
      }

      const paymentRef = dto.paymentReference || dto.mpesaCode || 'N/A';
      const amountPaid = dto.amountPaid || 0;

      const emailSent = await this.emailService.sendMembershipApplicationEmail({
        recipientEmails,
        applicantName: dto.fullName,
        applicantEmail: dto.email,
        paymentReference: paymentRef,
        membershipTier: dto.membershipTier,
        amountPaid: amountPaid,
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
          churchName: dto.churchName,
          title: dto.title,
          titleOther: dto.titleOther,
          referralName: dto.referralName,
          referralApeckNumber: dto.referralApeckNumber,
          referralPhone: dto.referralPhone,
          signature: dto.signature,
          declarationDate: dto.declarationDate,
          organizationName: dto.organizationName,
          organizationRegistrationNumber: dto.organizationRegistrationNumber,
          organizationKraPin: dto.organizationKraPin,
          headquartersLocation: dto.headquartersLocation,
          organizationEmail: dto.organizationEmail || dto.email,
          organizationPhone: dto.organizationPhone || dto.phone,
          chairpersonName: dto.chairpersonName,
          chairpersonIdNumber: dto.chairpersonIdNumber,
          chairpersonKraPin: dto.chairpersonKraPin,
          chairpersonPhone: dto.chairpersonPhone,
          chairpersonEmail: dto.chairpersonEmail,
          secretaryName: dto.secretaryName,
          secretaryIdNumber: dto.secretaryIdNumber,
          secretaryKraPin: dto.secretaryKraPin,
          secretaryPhone: dto.secretaryPhone,
          secretaryEmail: dto.secretaryEmail,
          treasurerName: dto.treasurerName,
          treasurerIdNumber: dto.treasurerIdNumber,
          treasurerKraPin: dto.treasurerKraPin,
          treasurerPhone: dto.treasurerPhone,
          treasurerEmail: dto.treasurerEmail,
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
      this.logger.error(
        `Error sending email for application ${application.id}:`,
        error,
      );
    }
  }

  async findAll() {
    return this.knex('membership_applications').orderBy('created_at', 'desc');
  }

  async findById(id: string) {
    return this.knex('membership_applications').where({ id }).first();
  }

  async findByPaymentReference(reference: string) {
    return this.knex('membership_applications')
      .where({ payment_reference: reference })
      .first();
  }
}
