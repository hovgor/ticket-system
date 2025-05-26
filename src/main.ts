import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { useSwagger } from "./swagger/swagger";
import { Logger } from "@nestjs/common";
import * as dotenv from "dotenv";
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
  Logger.verbose(process.env.PORT);
}
bootstrap();
