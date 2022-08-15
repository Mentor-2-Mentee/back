import { PartialType } from '@nestjs/mapped-types';
import { CreateTestScheduleDto } from './create-test-schedule.dto';

export class UpdateTestScheduleDto extends PartialType(CreateTestScheduleDto) {}
