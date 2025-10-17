import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class ReactLearning extends Document {
  @ApiProperty({ description: 'Difficulty level', example: 'Beginner' })
  @Prop({ required: true })
  level: string;

  @ApiProperty({ description: 'Section title', example: 'React Basics' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ description: 'Emoji representation', example: '🟢' })
  @Prop({ required: true })
  emoji: string;

  @ApiProperty({ description: 'Section description' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ description: 'Color theme', example: 'green' })
  @Prop({ required: true })
  color: string;

  @ApiProperty({ description: 'Gradient CSS class', example: 'from-green-400 to-emerald-500' })
  @Prop({ required: true })
  gradient: string;

  @ApiProperty({ 
    description: 'Array of topic IDs (references to ReactTopic collection)', 
    type: [String],
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012']
  })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'ReactTopic' }], default: [] })
  topicIds: Types.ObjectId[];
}

export const ReactLearningSchema = SchemaFactory.createForClass(ReactLearning);
