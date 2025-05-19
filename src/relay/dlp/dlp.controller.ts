import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DlpContractService } from '../../blockchain/contracts/services';
import { RequestRewardDto } from './dto';
import { TransactionResponse } from '../common/interfaces';
import { TransactionService } from '../common/services/transaction.service';

@ApiTags('DLP')
@Controller('relay/dlp')
export class DlpController {
  constructor(
    private readonly dlpContractService: DlpContractService,
    private readonly transactionService: TransactionService,
  ) {}

  @Post('request-reward')
  @ApiOperation({
    summary: 'Request a reward for a data labeling contribution',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The reward request has been successfully submitted',
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
            proofIndex: { type: 'number', example: 0 },
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
  async requestReward(
    @Body() requestRewardDto: RequestRewardDto,
  ): Promise<TransactionResponse> {
    try {
      const transactionHash = await this.dlpContractService.requestReward(
        requestRewardDto.fileId,
        requestRewardDto.proofIndex,
      );

      // Store transaction in the database
      const transaction = await this.transactionService.createTransaction(
        transactionHash,
        'requestReward',
        Number(this.dlpContractService.getChainId()),
        {
          fileId: requestRewardDto.fileId,
          proofIndex: requestRewardDto.proofIndex,
        },
        {
          fileId: requestRewardDto.fileId,
          proofIndex: requestRewardDto.proofIndex,
        },
      );

      // Convert to response
      return this.transactionService.transactionToResponse(transaction);
    } catch (error) {
      throw new HttpException(
        `Failed to request reward: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
