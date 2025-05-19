import { Module } from '@nestjs/common';
import { BlockchainModule } from '../../blockchain/blockchain.module';
import { DlpController } from './dlp.controller';
import { LoggingModule } from '../common/logging.module';

@Module({
  imports: [BlockchainModule, LoggingModule],
  controllers: [DlpController],
})
export class DlpModule {}
