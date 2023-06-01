import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
/**
 * How to generate a module
 * nest g module "module"
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
