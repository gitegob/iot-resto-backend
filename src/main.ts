import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import env from './env';
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
  await app.listen(env.PORT || 5000, () =>
    console.log('Server running on ' + (env.PORT || 5000)),
  );
}
bootstrap();
