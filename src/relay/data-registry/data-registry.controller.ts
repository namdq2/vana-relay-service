import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DataRegistryContractService } from '../../blockchain/contracts/services';
import { AddFileDto } from './dto';
import { TransactionResponse } from '../common/interfaces';
import { TransactionsService } from '../../transactions/transactions.service';
import { TransactionStatus } from '../../transactions/domain/transaction.status';

@ApiTags('Data Registry')
@Controller('relay/data-registry')
export class DataRegistryController {
  constructor(
    private readonly dataRegistryContractService: DataRegistryContractService,
    private readonly transactionService: TransactionsService,
  ) {}

  @Post('add-file-with-permissions')
  @ApiOperation({ summary: 'Add a file to the registry with permissions' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The file has been successfully added to the registry',
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
            url: {
              type: 'string',
              example: 'https://example.com/files/file-123456',
            },
            permissionsCount: { type: 'number', example: 2 },
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
  async addFile(@Body() addFileDto: AddFileDto): Promise<TransactionResponse> {
    try {
      const transactionHash =
        await this.dataRegistryContractService.addFileWithPermissions(
          addFileDto.url,
          addFileDto.ownerAddress,
          addFileDto.permissions,
        );

      // Store transaction in the database
      const transaction = await this.transactionService.create({
        transactionHash,
        method: 'addFileWithPermissions',
        chainId: Number(this.dataRegistryContractService.getChainId()),
        parameters: {
          url: addFileDto.url,
          ownerAddress: addFileDto.ownerAddress,
          permissions: addFileDto.permissions,
        },
        metadata: {
          url: addFileDto.url,
          permissionsCount: addFileDto.permissions.length,
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
        `Failed to add file to registry: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
