import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WalletService } from './wallet.service';
import { TransactionService } from './transaction.service';

@Module({
  imports: [ConfigModule],
  providers: [WalletService, TransactionService],
  exports: [WalletService, TransactionService],
})
export class WalletModule {}
