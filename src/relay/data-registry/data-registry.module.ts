import { Module } from '@nestjs/common';
import { BlockchainModule } from '../../blockchain/blockchain.module';
import { DataRegistryController } from './data-registry.controller';
import { LoggingModule } from '../common/logging.module';

@Module({
  imports: [BlockchainModule, LoggingModule],
  controllers: [DataRegistryController],
})
export class DataRegistryModule {}
