import { Module } from '@nestjs/common';
import { BlockchainModule } from '../../blockchain/blockchain.module';
import { TeePoolController } from './tee-pool.controller';
import { LoggingModule } from '../common/logging.module';

@Module({
  imports: [BlockchainModule, LoggingModule],
  controllers: [TeePoolController],
})
export class TeePoolModule {}
