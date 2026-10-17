import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Admin Statistics & Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Admin Dashboard: Overall aggregated counts, distributions, and recent items' })
  @ApiResponse({ status: 200, description: 'Aggregated dashboard summary returned' })
  getDashboardOverview() {
    return this.statisticsService.getDashboardOverview();
  }

  @Get('volunteers')
  @ApiOperation({ summary: 'Admin: Volunteer detailed statistics and status percentages' })
  getVolunteerStats() {
    return this.statisticsService.getVolunteerStats();
  }
}
