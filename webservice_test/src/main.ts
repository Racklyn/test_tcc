import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  //app.enableCors();

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
