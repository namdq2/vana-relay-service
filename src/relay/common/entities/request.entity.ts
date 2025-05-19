import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../utils/relational-entity-helper';
import { TransactionEntity } from './transaction.entity';

export enum RequestStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
}

@Entity({
  name: 'request',
})
export class RequestEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  endpoint: string;

  @Column({ type: 'varchar', length: 255 })
  method: string;

  @Column({ type: 'jsonb', nullable: true })
  requestBody: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  responseBody: Record<string, any>;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.SUCCESS,
  })
  status: RequestStatus;

  @Column({ type: 'integer' })
  statusCode: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ipAddress: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userAgent: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userId: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  errorMessage: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  transactionId: string | null;

  @ManyToOne(() => TransactionEntity, { nullable: true })
  @JoinColumn({ name: 'transactionId' })
  transaction: TransactionEntity | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
