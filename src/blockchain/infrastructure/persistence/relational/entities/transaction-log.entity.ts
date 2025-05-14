import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'transaction_log',
})
export class TransactionLogEntity extends EntityRelationalHelper {
  @Column({
    nullable: false,
    type: String,
  })
  transactionHash: string;

  @Column({
    nullable: false,
    type: String,
  })
  status: 'success' | 'pending' | 'failed';

  @Column({
    nullable: false,
    type: String,
  })
  from: string;

  @Column({
    nullable: false,
    type: String,
  })
  to: string;

  @Column({
    nullable: true,
    type: String,
  })
  data?: string;

  @Column({
    nullable: true,
    type: String,
  })
  value?: string;

  @Column({
    nullable: true,
    type: Number,
  })
  blockNumber?: number;

  @Column({
    nullable: true,
    type: String,
  })
  error?: string;

  @Column({
    nullable: false,
    type: Number,
  })
  chainId: number;

  @Column({
    nullable: true,
    type: 'jsonb',
  })
  metadata?: Record<string, any>;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
