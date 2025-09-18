import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // Ativa o ValidationPipe global com transformação
  app.useGlobalPipes(new ValidationPipe({ transform: true })); // TODO: verificar

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  if (process.env.WEBSERVICE_SWAGGER === 'true') {
    const config = new DocumentBuilder()
        .setTitle('Brand Analyzer - Swagger')
        .setVersion('1.0')
        .addTag('user')
        .addTag('brand')
        .addTag('page')
        .addTag('post')
        .addTag('comment')
        .addTag('commentAnalysis')
        .addTag('item')
        .addTag('itemAnalysisResult')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

  }


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
