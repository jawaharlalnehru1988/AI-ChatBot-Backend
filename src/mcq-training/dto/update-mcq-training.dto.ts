import { PartialType } from '@nestjs/swagger';
import { CreateMcqTrainingDto } from './create-mcq-training.dto';

export class UpdateMcqTrainingDto extends PartialType(CreateMcqTrainingDto) {}
