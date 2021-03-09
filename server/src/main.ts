import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: ['http://localhost:8080', 'http://192.168.31.32:8080'], credentials: true });
  await app.listen(3000);
}
bootstrap();