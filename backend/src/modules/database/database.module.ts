import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SeederService } from './seeder.service';
import { Admin } from '../admin/entities/admin.entity';
import { ContentItem } from '../content/entities/content-item.entity';
import { SiteSetting } from '../content/entities/site-setting.entity';
import { Volunteer } from '../volunteers/entities/volunteer.entity';
import { Message } from '../messages/entities/message.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Admin, ContentItem, SiteSetting, Volunteer, Message]),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class DatabaseModule {}
