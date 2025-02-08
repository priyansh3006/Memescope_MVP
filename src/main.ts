import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as winston from 'winston';
import { ConsoleLogger } from '@nestjs/common';

const WinstonCloudWatch = require('winston-cloudwatch');

// Load environment variables
dotenv.config();

// Configure CloudWatch Logger
const cloudWatchLogger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new (WinstonCloudWatch as any)({
      logGroupName: process.env.CLOUDWATCH_LOG_GROUP || 'memescope-logs',
      logStreamName: 'nestjs-logs',
      awsRegion: process.env.AWS_REGION || 'us-east-1',
    }),
  ],
});


// Custom Logger for NestJS to send logs to CloudWatch
class CustomLogger extends ConsoleLogger {
  log(message: string) {
    super.log(message);
    cloudWatchLogger.info(message);
  }

  error(message: string, trace: string) {
    super.error(message, trace);
    cloudWatchLogger.error(message, { trace });
  }

  warn(message: string) {
    super.warn(message);
    cloudWatchLogger.warn(message);
  }

  debug(message: string) {
    super.debug(message);
    cloudWatchLogger.debug(message);
  }

  verbose(message: string) {
    super.verbose(message);
    cloudWatchLogger.verbose(message);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(), // Use CloudWatch logger
  });

  await app.listen(process.env.PORT || 4000);
}

bootstrap();
