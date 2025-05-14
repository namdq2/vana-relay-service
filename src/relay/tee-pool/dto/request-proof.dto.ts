import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * DTO for requesting a contribution proof from the TEE Pool
 */
export class RequestProofDto {
  @ApiProperty({
    description: 'ID of the file in the Data Registry',
    example: 1,
    type: Number,
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  fileId: number;
}
