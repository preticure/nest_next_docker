import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { Request } from "express";
import * as cookieParser from "cookie-parser";
import * as csurf from "csurf";

import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	app.enableCors({
		credentials: true,
		origin: "http://localhost:8080",
	});
	app.use(cookieParser());
	await app.listen(3000);
}
bootstrap();
