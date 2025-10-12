import { PartialType } from '@nestjs/swagger';
import { CreateAgenticAiDto } from './create-agentic-ai.dto';

export class UpdateAgenticAiDto extends PartialType(CreateAgenticAiDto) {}
