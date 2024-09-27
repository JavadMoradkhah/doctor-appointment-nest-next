import { RedisModule } from '@nestjs-modules/ioredis';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfigSchema from 'src/common/schemas/app-config.schema';
import appConfig from 'src/config/app.config';
import databaseConfig from 'src/config/database.config';
import { IamModule } from 'src/modules/iam/iam.module';
import { UsersModule } from 'src/modules/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpecializationsModule } from '../specializations/specializations.module';

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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        synchronize: configService.get<boolean>('database.synchronize'),
        autoLoadEntities: true,
      }),
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
    // ThrottlerModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     throttlers: [{ ttl: minutes(1), limit: 1 }],
    //     storage: new ThrottlerStorageRedisService(
    //       new Redis({
    //         host: configService.get('redis.host'),
    //         port: configService.get('redis.port'),
    //       }),
    //     ),
    //   }),
    // }),
    UsersModule,
    IamModule,
    SpecializationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
