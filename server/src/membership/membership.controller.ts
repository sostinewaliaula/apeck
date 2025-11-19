import { Body, Controller, Post, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { CreateMembershipApplicationDto } from './dto/create-membership-application.dto';

@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post('applications')
  @HttpCode(HttpStatus.CREATED)
  async createApplication(@Body() dto: CreateMembershipApplicationDto) {
    // Check if application with this payment reference already exists (if provided)
    const paymentRef = dto.paymentReference || dto.mpesaCode;
    if (paymentRef) {
      const existing = await this.membershipService.findByPaymentReference(paymentRef);
      if (existing) {
        return {
          success: true,
          message: 'Application already exists for this payment reference',
          application: existing,
        };
      }
    }

    const application = await this.membershipService.createApplication(dto);
    return {
      success: true,
      message: 'Application submitted successfully',
      application,
    };
  }

  @Get('applications')
  async findAll() {
    const applications = await this.membershipService.findAll();
    return {
      success: true,
      applications,
    };
  }

  @Get('applications/:id')
  async findById(@Param('id') id: string) {
    const application = await this.membershipService.findById(id);
    if (!application) {
      return {
        success: false,
        message: 'Application not found',
      };
    }
    return {
      success: true,
      application,
    };
  }
}

