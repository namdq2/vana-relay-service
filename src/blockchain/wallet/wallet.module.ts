import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletService } from './wallet.service';
import { TransactionService } from './transaction.service';
import { TransactionLogEntity } from '../infrastructure/persistence/relational/entities/transaction-log.entity';
import { TransactionLogRepository } from '../infrastructure/persistence/relational/repositories/transaction-log.repository';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([TransactionLogEntity])],
  providers: [WalletService, TransactionService, TransactionLogRepository],
  exports: [WalletService, TransactionService],
})
export class WalletModule {}
