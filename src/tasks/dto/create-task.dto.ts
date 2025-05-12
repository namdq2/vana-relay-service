import {
  // decorators here

  IsNumber,
  IsString,
  IsOptional,
  IsDate,
  IsEnum,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

import {
  // decorators here

  Transform,
} from 'class-transformer';

import { TaskState } from '../domain/task-state.enum';

export class CreateTaskDto {
  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  lastCheckedMessage?: string | null;

  @ApiProperty({
    required: false,
    type: () => Date,
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  lastCheckedAt?: Date | null;

  @ApiProperty({
    required: true,
    enum: TaskState,
    enumName: 'TaskState',
    default: TaskState.CheckPending,
  })
  @IsEnum(TaskState)
  taskState: TaskState;

  @ApiProperty({
    required: false,
    type: () => Number,
  })
  @IsOptional()
  @IsNumber()
  blockNumber?: number | null;

  @ApiProperty({
    required: false,
    type: () => Date,
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  executedAt?: Date | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  transactionHash?: string | null;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  chainId: number;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
