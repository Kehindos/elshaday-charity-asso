import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VolunteersService } from './volunteers.service';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { UpdateVolunteerStatusDto } from './dto/update-volunteer-status.dto';
import { FilterVolunteerDto } from './dto/filter-volunteer.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Volunteers')
@Controller('volunteers')
export class VolunteersController {
  constructor(private readonly volunteersService: VolunteersService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Public: Volunteer Registration Form submission' })
  @ApiResponse({ status: 201, description: 'Application registered successfully in Pending status' })
  register(@Body() createVolunteerDto: CreateVolunteerDto) {
    return this.volunteersService.register(createVolunteerDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Admin: Get all volunteers with filters, search, and pagination' })
  findAll(@Query() filterDto: FilterVolunteerDto) {
    return this.volunteersService.findAll(filterDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('statistics')
  @ApiOperation({ summary: 'Admin: Get volunteer statistics summary' })
  getStatistics() {
    return this.volunteersService.getStatistics();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Admin: Get single volunteer registration details' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.volunteersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id/status')
  @ApiOperation({ summary: 'Admin: Update volunteer status (Pending, Approved, Rejected, Active, Inactive)' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateVolunteerStatusDto,
    @CurrentUser('name') adminName: string,
  ) {
    return this.volunteersService.updateStatus(id, updateStatusDto, adminName);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Admin: Update volunteer information details' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVolunteerDto: UpdateVolunteerDto,
  ) {
    return this.volunteersService.update(id, updateVolunteerDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Admin: Delete volunteer registration' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.volunteersService.remove(id);
  }
}
