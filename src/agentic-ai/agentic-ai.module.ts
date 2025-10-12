import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AgenticAiService } from './agentic-ai.service';
import { AgenticAiController } from './agentic-ai.controller';
import { AgenticAi, AgenticAiSchema } from './entities/agentic-ai.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AgenticAi.name, schema: AgenticAiSchema },
    ]),
  ],
  controllers: [AgenticAiController],
  providers: [AgenticAiService],
  exports: [AgenticAiService],
})
export class AgenticAiModule {}
