import { ApiProperty } from '@nestjs/swagger';
import { TaskState } from './task-state.enum';

export class Task {
  @ApiProperty({
    enum: TaskState,
    enumName: 'TaskState',
    default: TaskState.CheckPending,
  })
  taskState: TaskState;

  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  blockNumber?: number | null;

  @ApiProperty({
    type: () => Date,
    nullable: true,
  })
  executedAt?: Date | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  transactionHash?: string | null;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  chainId: number;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
