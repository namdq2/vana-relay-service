import {
  IsString,
  IsNumber,
  IsArray,
  IsEthereumAddress,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for adding a file to the Data Registry with permissions
 */
export class AddFileDto {
  @ApiProperty({
    description: 'Unique identifier for the file',
    example: 'file-123456',
  })
  @IsString()
  @IsNotEmpty()
  fileId: string;

  @ApiProperty({
    description: 'Hash of the file content',
    example:
      '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  })
  @IsString()
  @IsNotEmpty()
  fileHash: string;

  @ApiProperty({
    description: 'Size of the file in bytes',
    example: 1024,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  fileSize: number;

  @ApiProperty({
    description: 'Type/format of the file',
    example: 'application/json',
  })
  @IsString()
  @IsNotEmpty()
  fileType: string;

  @ApiProperty({
    description:
      'Array of user addresses who have permission to access the file',
    example: [
      '0x1234567890123456789012345678901234567890',
      '0x0987654321098765432109876543210987654321',
    ],
    type: [String],
  })
  @IsArray()
  @IsEthereumAddress({ each: true })
  permissionedUsers: string[];
}
