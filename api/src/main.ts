import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('LinkLoom API')
    .setDescription('The official API documentation for the LinkLoom URL shortener project. This API handles the creation, retrieval, and redirection of shortened links')
    .setVersion('0.1.0')
    .setContact('Andrey Nosov', 'https://github.com/swankygawk', 'swanky.gawk@gmail.com')
    .addServer('http://localhost:3000', 'Local Development Server')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
