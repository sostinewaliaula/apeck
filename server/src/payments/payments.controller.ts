import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PesapalService } from './pesapal.service';
import { ConfigService } from '@nestjs/config';

interface InitializePaymentDto {
  amount: number;
  currency?: string;
  description: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  reference: string;
  callbackUrl?: string;
}

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private readonly pesapalService: PesapalService,
    private readonly configService: ConfigService,
  ) {}

  @Post('pesapal/initialize')
  @HttpCode(HttpStatus.OK)
  async initializePayment(@Body() dto: InitializePaymentDto) {
    try {
      const frontendUrl = this.configService.get<string>(
        'app.frontendUrl',
        'http://localhost:5173',
      );
      const callbackUrl =
        dto.callbackUrl || `${frontendUrl}/membership?payment=success`;
      const ipnUrl = `${this.configService.get<string>('app.url', 'http://localhost:4000')}/api/payments/pesapal/ipn`;

      const ipnId = await this.pesapalService.getOrCreateIpnId(ipnUrl);
      if (!ipnId) {
        throw new Error(
          'Failed to register Pesapal IPN. Try again later or contact support.',
        );
      }

      const paymentRequest = {
        id: dto.reference,
        currency: dto.currency || 'KES',
        amount: dto.amount,
        description: dto.description,
        callback_url: callbackUrl,
        redirect_mode: 'PARENT_WINDOW',
        notification_id: ipnId,
        billing_address: {
          email_address: dto.email,
          phone_number: dto.phone || '',
          country_code: 'KE',
          first_name: dto.firstName || '',
          last_name: dto.lastName || '',
        },
      };

      const result = await this.pesapalService.submitOrder(paymentRequest);
      this.logger.log('Pesapal order response', result);

      return {
        success: true,
        redirectUrl: result.redirect_url,
        orderTrackingId: result.order_tracking_id,
        merchantReference: result.merchant_reference,
      };
    } catch (error) {
      this.logger.error('Error initializing Pesapal payment:', error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to initialize payment',
      };
    }
  }

  @Get('pesapal/status')
  async getPaymentStatus(@Query('orderTrackingId') orderTrackingId: string) {
    try {
      if (!orderTrackingId) {
        return {
          success: false,
          message: 'Order tracking ID is required',
        };
      }

      const status =
        await this.pesapalService.getTransactionStatus(orderTrackingId);
      return {
        success: true,
        status,
      };
    } catch (error) {
      this.logger.error('Error getting payment status:', error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to get payment status',
      };
    }
  }

  @Get('pesapal/ipn')
  async handleIPN(
    @Query('OrderTrackingId') orderTrackingId: string,
    @Query('OrderMerchantReference') merchantReference: string,
  ) {
    try {
      this.logger.log(
        `IPN received: OrderTrackingId=${orderTrackingId}, MerchantReference=${merchantReference}`,
      );

      // Get transaction status
      const status =
        await this.pesapalService.getTransactionStatus(orderTrackingId);

      // Here you would typically update your database with the payment status
      // For now, we'll just log it
      this.logger.log(`Payment status: ${JSON.stringify(status)}`);

      return {
        success: true,
        message: 'IPN received',
      };
    } catch (error) {
      this.logger.error('Error handling IPN:', error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to handle IPN',
      };
    }
  }
}
