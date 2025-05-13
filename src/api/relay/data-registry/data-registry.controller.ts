import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DataRegistryContractService } from '../../../blockchain/contracts/services';
import { AddFileDto } from './dto';
import { TransactionResponse } from '../../common/interfaces';

@ApiTags('Data Registry')
@Controller('api/relay/data-registry')
export class DataRegistryController {
  constructor(
    private readonly dataRegistryContractService: DataRegistryContractService,
  ) {}

  @Post('add-file')
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
            fileId: { type: 'string', example: 'file123' },
            fileType: { type: 'string', example: 'image/jpeg' },
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
        await this.dataRegistryContractService.addFileWithPermission(
          addFileDto.fileId,
          addFileDto.fileHash,
          addFileDto.fileSize,
          addFileDto.fileType,
          addFileDto.permissionedUsers,
        );

      return {
        transactionHash,
        status: 'success',
        timestamp: new Date().toISOString(),
        metadata: {
          fileId: addFileDto.fileId,
          fileType: addFileDto.fileType,
        },
      };
    } catch (error) {
      throw new HttpException(
        `Failed to add file to registry: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
