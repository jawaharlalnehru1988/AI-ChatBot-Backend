import { PartialType } from '@nestjs/swagger';
import { CreateReactLearningDto } from './create-react-learning.dto';

export class UpdateReactLearningDto extends PartialType(CreateReactLearningDto) {}
