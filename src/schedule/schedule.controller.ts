import { Controller } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ScheduleService } from './schedule.service';

@Controller('schedule')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handlCron() {
    await this.scheduleService.collectDataInGameAndInsertDb();
  }
}
