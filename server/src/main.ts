import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { redis } from './config/redis';
import { RedisIoAdapter } from './config/redis.adapter';
import { sessionMiddleware } from './config/sessionMiddleware';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  const redisIoAdapter = new RedisIoAdapter(sessionMiddleware, app);
  // redisIoAdapter.createIOServer(3000, {origin})
  app.useWebSocketAdapter(redisIoAdapter);

  app.use(sessionMiddleware);
  // app.use(
  //   rateLimit({
  //     store: new RedisStore(),
  //     windowMs: 60 * 1000, // 1 minutes
  //     max: 100, // limit each IP to 100 requests per windowMs
  //   }),
  // );

  await app.listen(8000);
}
bootstrap();
