import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const configService = app.get(ConfigService);

  SwaggerModule.setup(
    "api",
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle("dropzone")
        .setDescription("SwapSDK API documentation")
        .setVersion("1.0")
        .addTag("dropzone")
        .build()
    )
  );

  await app.listen(configService.get("RESTFUL_PORT") || 3000);
}

bootstrap();
