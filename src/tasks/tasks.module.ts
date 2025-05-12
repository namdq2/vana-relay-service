import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { RelationalTaskPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    // do not remove this comment
    RelationalTaskPersistenceModule,
    AuthModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService, RelationalTaskPersistenceModule],
})
export class TasksModule {}
