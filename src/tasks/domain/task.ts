import { ApiProperty } from '@nestjs/swagger';

export class Task {
  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  blockNumber?: number | null;

  @ApiProperty({
    type: () => Date,
    nullable: true,
  })
  executeAt?: Date | null;

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
