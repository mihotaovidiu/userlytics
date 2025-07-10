import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    }),
  );
  app.setGlobalPrefix('api');
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', '..', 'client', 'dist', 'dashboard', 'browser'),
    exclude: ['/api*'],
  }),
    await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
