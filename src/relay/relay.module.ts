import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DataRegistryModule } from './data-registry/data-registry.module';
import { TeePoolModule } from './tee-pool/tee-pool.module';
import { DlpModule } from './dlp/dlp.module';
import { LoggingModule } from './common/logging.module';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';

@Module({
  imports: [DataRegistryModule, TeePoolModule, DlpModule, LoggingModule],
})
export class RelayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('relay/*');
  }
}
