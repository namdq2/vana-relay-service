import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'task',
})
export class TaskEntity extends EntityRelationalHelper {
  @Column({
    nullable: true,
    type: Number,
  })
  blockNumber?: number | null;

  @Column({
    nullable: true,
    type: Date,
  })
  executeAt?: Date | null;

  @Column({
    nullable: true,
    type: String,
  })
  transactionHash?: string | null;

  @Column({
    nullable: false,
    type: Number,
  })
  chainId: number;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
