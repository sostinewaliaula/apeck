import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PesapalService } from './pesapal.service';

@Module({
  controllers: [PaymentsController],
  providers: [PesapalService],
  exports: [PesapalService],
})
export class PaymentsModule {}
