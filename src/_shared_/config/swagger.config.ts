import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

const config = new DocumentBuilder()
  //   .addBearerAuth({ type: 'http', scheme: 'bearer' })
  .setTitle('PressMe')
  .setDescription('The PressMe documentation')
  .setVersion('1.0.0')
  .addTag('App', 'App welcome endpoint')
  // .addTag('Auth', 'Authentication Endpoints')
  .addTag('Tables', 'Table Endpoints')
  .addTag('Items', 'Items Endpoints')
  .addTag('Orders', 'Orders Endpoints')
  .addTag('Order Items', 'Order Items Endpoints')
  .build();

const customOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
  customSiteTitle: 'RealtApp API',
};

export function setupDocs(app: INestApplication): void {
  const document = SwaggerModule.createDocument(app, config);
  return SwaggerModule.setup('api', app, document, customOptions);
}