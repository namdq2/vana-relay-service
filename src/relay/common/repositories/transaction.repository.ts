import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  TransactionEntity,
  TransactionStatus,
} from '../entities/transaction.entity';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  async create(data: Partial<TransactionEntity>): Promise<TransactionEntity> {
    const newEntity = await this.transactionRepository.save(
      this.transactionRepository.create(data),
    );
    return newEntity;
  }

  async findById(id: string): Promise<TransactionEntity | null> {
    return this.transactionRepository.findOne({
      where: { id },
    });
  }

  async findByTransactionHash(
    transactionHash: string,
  ): Promise<TransactionEntity | null> {
    return this.transactionRepository.findOne({
      where: { transactionHash },
    });
  }

  async update(
    id: string,
    data: Partial<TransactionEntity>,
  ): Promise<TransactionEntity | null> {
    await this.transactionRepository.update({ id }, data);
    return this.findById(id);
  }

  async updateStatus(
    id: string,
    status: TransactionStatus,
    errorMessage?: string,
  ): Promise<TransactionEntity | null> {
    const updateData: Partial<TransactionEntity> = { status };
    if (errorMessage) {
      updateData.errorMessage = errorMessage;
    }

    await this.transactionRepository.update({ id }, updateData);
    return this.findById(id);
  }

  async findPendingTransactions(): Promise<TransactionEntity[]> {
    return this.transactionRepository.find({
      where: { status: TransactionStatus.PENDING },
    });
  }
}
