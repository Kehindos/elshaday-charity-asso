import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { VolunteersModule } from '../volunteers/volunteers.module';
import { ContentModule } from '../content/content.module';
import { MessagesModule } from '../messages/messages.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [VolunteersModule, ContentModule, MessagesModule, AdminModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
