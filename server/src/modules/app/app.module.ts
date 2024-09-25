import appConfigSchema from 'src/common/schemas/app-config.schema';
import appConfig from 'src/config/app.config';
import { IamModule } from 'src/modules/iam/iam.module';
import { UsersModule } from 'src/modules/users/users.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, minutes } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import databaseConfig from 'src/config/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const NODE_ENV = process.env.NODE_ENV;
const ENV_FILE = !NODE_ENV ? '.env.dev' : `.env.${NODE_ENV}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ENV_FILE,
      cache: true,
      load: [appConfig, databaseConfig],
      validationSchema: appConfigSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT || 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: configService.get('redis.url'),
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
        },
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [{ ttl: minutes(1), limit: 1 }],
        storage: new ThrottlerStorageRedisService(
          new Redis({
            host: configService.get('redis.host'),
            port: configService.get('redis.port'),
          }),
        ),
      }),
    }),
    UsersModule,
    IamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
