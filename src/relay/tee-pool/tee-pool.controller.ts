import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TeePoolContractService } from '../../blockchain/contracts/services';
import { RequestProofDto } from './dto';
import { TransactionResponse } from '../common/interfaces';
import { TransactionsService } from '../../transactions/transactions.service';
import { TransactionStatus } from '../../transactions/domain/transaction.status';

@ApiTags('TEE Pool')
@Controller('relay/tee-pool')
export class TeePoolController {
  constructor(
    private readonly teePoolContractService: TeePoolContractService,
    private readonly transactionService: TransactionsService,
  ) {}

  @Post('request-contribution-proof')
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
            fileId: { type: 'number', example: 1 },
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
          requestProofDto.fileId,
          requestProofDto.teeFee,
        );

      // Store transaction in the database
      const transaction = await this.transactionService.create({
        transactionHash,
        method: 'requestContributionProof',
        chainId: Number(this.teePoolContractService.getChainId()),
        parameters: {
          fileId: requestProofDto.fileId,
          teeFee: requestProofDto.teeFee,
        },
        metadata: {
          fileId: requestProofDto.fileId,
          teeFee: requestProofDto.teeFee,
        },
        transactionState: TransactionStatus.PENDING,
      });

      return {
        transactionHash: transactionHash,
        status: transaction.transactionState,
        timestamp: transaction.createdAt.toISOString(),
        metadata: transaction.metadata,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to request contribution proof: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
