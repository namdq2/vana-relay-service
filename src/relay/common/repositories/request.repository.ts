import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestEntity } from '../entities/request.entity';

@Injectable()
export class RequestRepository {
  constructor(
    @InjectRepository(RequestEntity)
    private readonly requestRepository: Repository<RequestEntity>,
  ) {}

  async create(data: Partial<RequestEntity>): Promise<RequestEntity> {
    const newEntity = await this.requestRepository.save(
      this.requestRepository.create(data),
    );
    return newEntity;
  }

  async findById(id: string): Promise<RequestEntity | null> {
    return this.requestRepository.findOne({
      where: { id },
      relations: ['transaction'],
    });
  }

  async update(
    id: string,
    data: Partial<RequestEntity>,
  ): Promise<RequestEntity | null> {
    await this.requestRepository.update({ id }, data);
    return this.findById(id);
  }

  async findByUserId(userId: string): Promise<RequestEntity[]> {
    return this.requestRepository.find({
      where: { userId },
      relations: ['transaction'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByEndpoint(endpoint: string): Promise<RequestEntity[]> {
    return this.requestRepository.find({
      where: { endpoint },
      relations: ['transaction'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByTransactionId(transactionId: string): Promise<RequestEntity[]> {
    return this.requestRepository.find({
      where: { transactionId },
      relations: ['transaction'],
    });
  }
}
