import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TeePoolContractService } from '../../../blockchain/contracts/services';
import { RequestProofDto } from './dto';
import { TransactionResponse } from '../../common/interfaces';

@ApiTags('TEE Pool')
@Controller('api/relay/tee-pool')
export class TeePoolController {
  constructor(
    private readonly teePoolContractService: TeePoolContractService,
  ) {}

  @Post('request-proof')
  @ApiOperation({ summary: 'Request a contribution proof from the TEE Pool' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'The contribution proof request has been successfully submitted',
    schema: {
      type: 'object',
      properties: {
        transactionHash: {
          type: 'string',
          example:
            '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        },
        status: {
          type: 'string',
          example: 'success',
          enum: ['success', 'pending', 'failed'],
        },
        timestamp: { type: 'string', example: '2023-09-15T12:34:56.789Z' },
        metadata: {
          type: 'object',
          properties: {
            contributorAddress: {
              type: 'string',
              example: '0xabcdef1234567890abcdef1234567890abcdef12',
            },
            dataId: { type: 'string', example: 'data123' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'An error occurred while processing the request',
  })
  async requestProof(
    @Body() requestProofDto: RequestProofDto,
  ): Promise<TransactionResponse> {
    try {
      const transactionHash =
        await this.teePoolContractService.requestContributionProof(
          requestProofDto.contributorAddress,
          requestProofDto.dataId,
          requestProofDto.contributionHash,
        );

      return {
        transactionHash,
        status: 'success',
        timestamp: new Date().toISOString(),
        metadata: {
          contributorAddress: requestProofDto.contributorAddress,
          dataId: requestProofDto.dataId,
        },
      };
    } catch (error) {
      throw new HttpException(
        `Failed to request contribution proof: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
