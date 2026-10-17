import { Injectable } from '@nestjs/common';
import { VolunteersService } from '../volunteers/volunteers.service';
import { ContentService } from '../content/content.service';
import { MessagesService } from '../messages/messages.service';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly volunteersService: VolunteersService,
    private readonly contentService: ContentService,
    private readonly messagesService: MessagesService,
    private readonly adminService: AdminService,
  ) {}

  async getVolunteerStats() {
    return this.volunteersService.getStatistics();
  }

  async getDashboardOverview() {
    const [volunteers, content, messages, adminCount] = await Promise.all([
      this.volunteersService.getStatistics(),
      this.contentService.getContentStats(),
      this.messagesService.getStats(),
      this.adminService.count(),
    ]);

    return {
      summary: {
        totalVolunteers: volunteers.total,
        pendingApplications: volunteers.pending,
        activeVolunteers: volunteers.active,
        approvedVolunteers: volunteers.approved,
        inactiveVolunteers: volunteers.inactive,
        totalPrograms: content.programs,
        totalEvents: content.events,
        totalNews: content.news,
        totalGalleryMedia: content.gallery,
        unreadMessages: messages.unread,
        totalMessages: messages.total,
        totalAdmins: adminCount,
      },
      volunteerStatusDistribution: volunteers.breakdown,
      recentVolunteers: volunteers.recent,
      contentDistribution: content,
      messageStats: messages,
    };
  }
}
