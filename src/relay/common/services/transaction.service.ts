import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../repositories/transaction.repository';
import {
  TransactionEntity,
  TransactionStatus,
} from '../entities/transaction.entity';
import { TransactionResponse } from '../interfaces/transaction-response.interface';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async createTransaction(
    transactionHash: string,
    method: string,
    chainId: number,
    parameters?: Record<string, any>,
    metadata?: Record<string, any>,
  ): Promise<TransactionEntity> {
    return this.transactionRepository.create({
      transactionHash,
      method,
      chainId,
      parameters,
      metadata,
      status: TransactionStatus.PENDING,
    });
  }

  async updateTransactionStatus(
    id: string,
    status: TransactionStatus,
    errorMessage?: string,
  ): Promise<TransactionEntity | null> {
    return this.transactionRepository.updateStatus(id, status, errorMessage);
  }

  async findPendingTransactions(): Promise<TransactionEntity[]> {
    return this.transactionRepository.findPendingTransactions();
  }

  async findByTransactionHash(
    transactionHash: string,
  ): Promise<TransactionEntity | null> {
    return this.transactionRepository.findByTransactionHash(transactionHash);
  }

  transactionToResponse(transaction: TransactionEntity): TransactionResponse {
    return {
      transactionHash: transaction.transactionHash,
      status: transaction.status.toLowerCase() as
        | 'success'
        | 'pending'
        | 'failed',
      timestamp: transaction.createdAt.toISOString(),
      metadata: transaction.metadata,
    };
  }
}
