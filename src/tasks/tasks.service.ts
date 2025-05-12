import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskRepository } from './infrastructure/persistence/task.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Task } from './domain/task';

@Injectable()
export class TasksService {
  constructor(
    // Dependencies here
    private readonly taskRepository: TaskRepository,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.taskRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      lastCheckedMessage: createTaskDto.lastCheckedMessage,

      lastCheckedAt: createTaskDto.lastCheckedAt,

      taskState: createTaskDto.taskState,

      blockNumber: createTaskDto.blockNumber,

      executedAt: createTaskDto.executedAt,

      transactionHash: createTaskDto.transactionHash,

      chainId: createTaskDto.chainId,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.taskRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Task['id']) {
    return this.taskRepository.findById(id);
  }

  findByIds(ids: Task['id'][]) {
    return this.taskRepository.findByIds(ids);
  }

  async update(
    id: Task['id'],

    updateTaskDto: UpdateTaskDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.taskRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      lastCheckedMessage: updateTaskDto.lastCheckedMessage,

      lastCheckedAt: updateTaskDto.lastCheckedAt,

      taskState: updateTaskDto.taskState,

      blockNumber: updateTaskDto.blockNumber,

      executedAt: updateTaskDto.executedAt,

      transactionHash: updateTaskDto.transactionHash,

      chainId: updateTaskDto.chainId,
    });
  }

  remove(id: Task['id']) {
    return this.taskRepository.remove(id);
  }
}
