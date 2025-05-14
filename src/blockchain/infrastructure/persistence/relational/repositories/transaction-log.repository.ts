import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionLogEntity } from '../entities/transaction-log.entity';

@Injectable()
export class TransactionLogRepository {
  constructor(
    @InjectRepository(TransactionLogEntity)
    private readonly repository: Repository<TransactionLogEntity>,
  ) {}

  async create(
    log: Partial<TransactionLogEntity>,
  ): Promise<TransactionLogEntity> {
    const entity = this.repository.create(log);
    return this.repository.save(entity);
  }

  async findByTransactionHash(
    transactionHash: string,
  ): Promise<TransactionLogEntity | null> {
    return this.repository.findOne({
      where: { transactionHash },
    });
  }

  async update(
    transactionHash: string,
    data: Partial<TransactionLogEntity>,
  ): Promise<TransactionLogEntity | null> {
    await this.repository.update({ transactionHash }, data);
    return this.findByTransactionHash(transactionHash);
  }
}
