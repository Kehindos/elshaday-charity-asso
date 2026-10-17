import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { VolunteersModule } from './modules/volunteers/volunteers.module';
import { ContentModule } from './modules/content/content.module';
import { MessagesModule } from './modules/messages/messages.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { UploadModule } from './modules/upload/upload.module';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env'],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USERNAME', 'root'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_DATABASE', 'charity_db'),
        autoLoadEntities: true,
        synchronize: config.get<string>('DB_SYNCHRONIZE', 'true') === 'true',
        logging: config.get<string>('DB_LOGGING', 'false') === 'true',
        charset: 'utf8mb4_unicode_ci',
      }),
    }),

    ServeStaticModule.forRoot(
      {
        rootPath: path.resolve(process.cwd(), 'public'),
        serveRoot: '/',
        exclude: ['/api/(.*)'],
      },
      {
        rootPath: path.resolve(process.cwd(), 'uploads'),
        serveRoot: '/uploads',
        serveStaticOptions: {
          index: false,
        },
      },
    ),

    AdminModule,
    AuthModule,
    VolunteersModule,
    ContentModule,
    MessagesModule,
    StatisticsModule,
    UploadModule,
    DatabaseModule,
  ],
})
export class AppModule {}
