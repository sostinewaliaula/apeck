import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface PesapalPaymentRequest {
  id: string;
  currency: string;
  amount: number;
  description: string;
  callback_url: string;
  redirect_mode?: string;
  notification_id?: string;
  billing_address?: {
    email_address: string;
    phone_number?: string;
    country_code: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    line_1?: string;
    line_2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    zip_code?: string;
  };
}

export interface PesapalOrderResponse {
  order_tracking_id: string;
  merchant_reference: string;
  redirect_url: string;
  status: string;
  message: string;
}

@Injectable()
export class PesapalService {
  private readonly logger = new Logger(PesapalService.name);
  private readonly consumerKey: string;
  private readonly consumerSecret: string;
  private readonly baseUrl: string;
  private readonly ipnCache = new Map<string, string>();

  constructor(private readonly configService: ConfigService) {
    this.consumerKey = this.configService.get<string>(
      'pesapal.consumerKey',
      '',
    );
    this.consumerSecret = this.configService.get<string>(
      'pesapal.consumerSecret',
      '',
    );
    const isSandbox = this.configService.get<boolean>('pesapal.sandbox', true);
    this.baseUrl = isSandbox
      ? 'https://cybqa.pesapal.com/pesapalv3'
      : 'https://pay.pesapal.com/v3';

    if (!this.consumerKey || !this.consumerSecret) {
      this.logger.warn('Pesapal credentials not configured');
    }
  }

  /**
   * Generate OAuth token for Pesapal API authentication
   */
  private async getAccessToken(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/Auth/RequestToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          consumer_key: this.consumerKey,
          consumer_secret: this.consumerSecret,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to get access token: ${response.status} - ${errorText}`,
        );
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      this.logger.error('Error getting Pesapal access token:', error);
      throw error;
    }
  }

  /**
   * Register IPN (Instant Payment Notification) URL
   */
  async registerIPN(ipnUrl: string): Promise<string> {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(`${this.baseUrl}/api/URLSetup/RegisterIPN`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          url: ipnUrl,
          ipn_notification_type: 'GET',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to register IPN: ${response.status} - ${errorText}`,
        );
      }

      const data = await response.json();
      return data.ipn_id;
    } catch (error) {
      this.logger.error('Error registering IPN:', error);
      throw error;
    }
  }

  /**
   * Cached helper so we don't register the same IPN URL on every request
   */
  async getOrCreateIpnId(ipnUrl: string): Promise<string | null> {
    if (!ipnUrl) {
      return null;
    }
    if (this.ipnCache.has(ipnUrl)) {
      return this.ipnCache.get(ipnUrl) ?? null;
    }
    try {
      const ipnId = await this.registerIPN(ipnUrl);
      this.ipnCache.set(ipnUrl, ipnId);
      return ipnId;
    } catch (error) {
      this.logger.error('Failed to register IPN url with Pesapal:', error);
      return null;
    }
  }

  /**
   * Submit order to Pesapal and get redirect URL
   */
  async submitOrder(
    paymentRequest: PesapalPaymentRequest,
  ): Promise<PesapalOrderResponse> {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(
        `${this.baseUrl}/api/Transactions/SubmitOrderRequest`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(paymentRequest),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to submit order: ${response.status} - ${errorText}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      this.logger.error('Error submitting Pesapal order:', error);
      throw error;
    }
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(orderTrackingId: string): Promise<any> {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(
        `${this.baseUrl}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to get transaction status: ${response.status} - ${errorText}`,
        );
      }

      return await response.json();
    } catch (error) {
      this.logger.error('Error getting transaction status:', error);
      throw error;
    }
  }
}
