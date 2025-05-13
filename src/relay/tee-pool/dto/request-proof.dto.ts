import { IsString, IsEthereumAddress, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for requesting a contribution proof from the TEE Pool
 */
export class RequestProofDto {
  @ApiProperty({
    description: 'Address of the contributor requesting the proof',
    example: '0x1234567890123456789012345678901234567890',
  })
  @IsEthereumAddress()
  @IsNotEmpty()
  contributorAddress: string;

  @ApiProperty({
    description: 'Identifier of the data being contributed',
    example: 'data-123456',
  })
  @IsString()
  @IsNotEmpty()
  dataId: string;

  @ApiProperty({
    description: 'Hash of the contribution data',
    example:
      '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  })
  @IsString()
  @IsNotEmpty()
  contributionHash: string;
}
