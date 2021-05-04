import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { global } from './_shared_/config/env.config';
import { setupDocs } from './_shared_/config/swagger.config';
import * as helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
import loggerConfig from './_shared_/config/logger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(loggerConfig),
  });

  const logger = app.get(Logger);
  process.on('unhandledRejection', (e) => {
    logger.error(e);
    process.exit(1);
  });
  app.use(helmet());
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  setupDocs(app);

  await app.listen(global.port, () =>
    new Logger('APP').verbose('Server running on port ' + global.port + '...'),
  );
}
bootstrap();
