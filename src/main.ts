import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { global } from './_shared_/config/env.config';
import { setupDocs } from './_shared_/config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
