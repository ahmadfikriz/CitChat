import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { UsersModule } from './users/users.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { LoggerModule } from 'nestjs-pino';
import { HealthModule } from './health/health.module';
import { MessageModule } from './message/message.module';
import { ConversationModule } from './conversation/conversation.module';
import { GroupModule } from './group/group.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import configuration from './config/configuration';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        genReqId: (req) => {
          return req['x-correlation-id'];
        },
        redact: {
          paths: [
            'req.headers.authorization',
            'req.headers["user-agent"]',
            'req.headers.accept',
            'req.headers["accept-encoding"]',
            'req.headers["accept-language"]',
            'req.headers.host',
            'req.headers.connection',
            'req.headers.cookie',
            'req.headers["sec-ch-ua"]',
            'req.headers["sec-ch-ua-mobile"]',
            'req.headers["sec-ch-ua-platform"]',
            'req.headers["upgrade-insecure-requests"]',
            'req.headers["sec-fetch-site"]',
            'req.headers["sec-fetch-mode"]',
            'req.headers["sec-fetch-user"]',
            'req.headers["sec-fetch-dest"]',
            'req.headers["if-none-match"]',
          ],
          remove: true,
        },
      },
    }),
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_CLIENT: Joi.valid('mysql', 'postgres'),
        DATABASE_HOST: Joi.string(),
        DATABASE_NAME: Joi.string(),
        DATABASE_USERNAME: Joi.string(),
        DATABASE_PASSWORD: Joi.string().empty('').default(''),
        DATABASE_PORT: Joi.number().default(5432),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get<'postgres' | 'mysql'>('database.client'),
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get<string>('database.username'),
          password: configService.get<string>('database.password'),
          database: configService.get<string>('database.name'),
          entities: [],
          synchronize: true,
          autoLoadEntities: true,
          logging: false,
          namingStrategy: new SnakeNamingStrategy(),
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    HealthModule,
    MessageModule,
    ConversationModule,
    GroupModule,
    AuthModule,
    RoleModule,
  ],
})
export class AppModule {}
