import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET",],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  });

  await app.listen(process.env.BACKEND_PORT ?? 3001);
}

bootstrap();
 