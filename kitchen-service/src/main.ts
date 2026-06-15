import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBIT_MQ_URL!],
        queue: 'kitchen_queue',
        queueOptions: {
          durable: process.env.NODE_ENV === 'production',
        },
      },
    },
  );
  await app.listen();
  console.log(`🔥 Kitchen service is listeing on kitchen_queue`);
}
void bootstrap();
