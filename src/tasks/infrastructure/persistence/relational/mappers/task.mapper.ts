import { Task } from '../../../../domain/task';

import { TaskEntity } from '../entities/task.entity';

export class TaskMapper {
  static toDomain(raw: TaskEntity): Task {
    const domainEntity = new Task();
    domainEntity.blockNumber = raw.blockNumber;

    domainEntity.executeAt = raw.executeAt;

    domainEntity.transactionHash = raw.transactionHash;

    domainEntity.chainId = raw.chainId;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Task): TaskEntity {
    const persistenceEntity = new TaskEntity();
    persistenceEntity.blockNumber = domainEntity.blockNumber;

    persistenceEntity.executeAt = domainEntity.executeAt;

    persistenceEntity.transactionHash = domainEntity.transactionHash;

    persistenceEntity.chainId = domainEntity.chainId;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
