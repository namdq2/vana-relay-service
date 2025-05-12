import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';
import { ApiKeyRepository } from './infrastructure/persistence/api-key.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { ApiKey } from './domain/api-key';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeysService {
  constructor(
    // Dependencies here
    private readonly apiKeyRepository: ApiKeyRepository,
  ) {}

  generateApiKey(): { fullKey: string; prefix: string; hash: string } {
    // Format: prefix_randomPart (e.g., abc12345_f7d8a9b3c...)
    const randomPart = crypto
      .randomBytes(32)
      .toString('base64')
      .replace(/[+/=]/g, '')
      .substring(0, 40);

    const prefix = crypto.randomBytes(4).toString('hex');

    const fullKey = `${prefix}_${randomPart}`;

    // Hash the key for storage
    const hash = crypto.createHash('sha256').update(fullKey).digest('hex');

    return { fullKey, prefix, hash };
  }

  async create(createApiKeyDto: CreateApiKeyDto) {
    const { fullKey, prefix, hash } = this.generateApiKey();

    // Do not remove comment below.
    // <creating-property />

    const newApiKey = await this.apiKeyRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      isActive: createApiKeyDto.isActive ?? true,

      expiresAt: createApiKeyDto.expiresAt,

      description: createApiKeyDto.description,

      keyHint: prefix,

      keyHash: hash,

      name: createApiKeyDto.name,
    });

    return {
      ...newApiKey,
      apiKey: fullKey,
    };
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.apiKeyRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: ApiKey['id']) {
    return this.apiKeyRepository.findById(id);
  }

  findByIds(ids: ApiKey['id'][]) {
    return this.apiKeyRepository.findByIds(ids);
  }

  async update(
    id: ApiKey['id'],

    updateApiKeyDto: UpdateApiKeyDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.apiKeyRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      isActive: updateApiKeyDto.isActive,

      expiresAt: updateApiKeyDto.expiresAt,

      description: updateApiKeyDto.description,

      name: updateApiKeyDto.name,
    });
  }

  remove(id: ApiKey['id']) {
    return this.apiKeyRepository.remove(id);
  }
}
