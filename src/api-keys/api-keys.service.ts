import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';
import { ApiKeyRepository } from './infrastructure/persistence/api-key.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { ApiKey } from './domain/api-key';

@Injectable()
export class ApiKeysService {
  constructor(
    // Dependencies here
    private readonly apiKeyRepository: ApiKeyRepository,
  ) {}

  async create(createApiKeyDto: CreateApiKeyDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.apiKeyRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      isActive: createApiKeyDto.isActive,

      expiresAt: createApiKeyDto.expiresAt,

      description: createApiKeyDto.description,

      keyHint: createApiKeyDto.keyHint,

      keyHash: createApiKeyDto.keyHash,

      name: createApiKeyDto.name,
    });
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

      keyHint: updateApiKeyDto.keyHint,

      keyHash: updateApiKeyDto.keyHash,

      name: updateApiKeyDto.name,
    });
  }

  remove(id: ApiKey['id']) {
    return this.apiKeyRepository.remove(id);
  }
}
