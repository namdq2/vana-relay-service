import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import { RequestEntity } from './entities/request.entity';
import { TransactionRepository } from './repositories/transaction.repository';
import { RequestRepository } from './repositories/request.repository';
import { TransactionService } from './services/transaction.service';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity, RequestEntity])],
  providers: [
    TransactionRepository,
    RequestRepository,
    TransactionService,
    RequestLoggerMiddleware,
  ],
  exports: [
    TransactionRepository,
    RequestRepository,
    TransactionService,
    RequestLoggerMiddleware,
  ],
})
export class LoggingModule {}
