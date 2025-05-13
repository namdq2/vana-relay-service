import { IsString, IsEthereumAddress, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for requesting a reward for a data labeling contribution
 */
export class RequestRewardDto {
  @ApiProperty({
    description: 'Address of the contributor requesting the reward',
    example: '0x1234567890123456789012345678901234567890',
  })
  @IsEthereumAddress()
  @IsNotEmpty()
  contributorAddress: string;

  @ApiProperty({
    description: 'Identifier of the contribution',
    example: 'contribution-123456',
  })
  @IsString()
  @IsNotEmpty()
  contributionId: string;

  @ApiProperty({
    description: 'Hash of the proof of contribution',
    example:
      '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  })
  @IsString()
  @IsNotEmpty()
  proofHash: string;

  @ApiProperty({
    description: 'Amount of tokens to be rewarded',
    example: '1000000000000000000', // 1 token in wei
  })
  @IsString()
  @IsNotEmpty()
  rewardAmount: string;
}
