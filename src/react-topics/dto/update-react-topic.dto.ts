import { PartialType } from '@nestjs/swagger';
import { CreateReactTopicDto } from './create-react-topic.dto';

export class UpdateReactTopicDto extends PartialType(CreateReactTopicDto) {}
