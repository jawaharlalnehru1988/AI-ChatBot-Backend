import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

class McqContent {
  @ApiProperty({ description: 'MCQ question text' })
  @Prop({ required: true })
  question: string;

  @ApiProperty({ description: 'Array of answer options' })
  @Prop({ type: [String], required: true })
  options: string[];

  @ApiProperty({ description: 'The correct answer' })
  @Prop({ required: true })
  correctAnswer: string;
}

@Schema({ timestamps: true })
export class ReactTopic extends Document {
  @ApiProperty({ description: 'Unique identifier for the topic', example: 'what-is-react' })
  @Prop({ required: true, unique: true })
  topicId: string;

  @ApiProperty({ description: 'Title of the topic', example: 'What is React?' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ description: 'Description of the topic' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ description: 'Estimated time to complete', example: '30 min' })
  @Prop({ required: true })
  estimatedTime: string;

  @ApiProperty({ description: 'HTML content for the topic', required: false })
  @Prop()
  htmlContent?: string;

  @ApiProperty({ description: 'Array of MCQ questions', type: [McqContent], required: false })
  @Prop({ type: [McqContent] })
  mcqContent?: McqContent[];

  @ApiProperty({ description: 'Whether the topic is completed', default: false })
  @Prop({ default: false })
  isCompleted: boolean;

  @ApiProperty({ description: 'Reference to the section this topic belongs to' })
  @Prop({ type: Types.ObjectId, ref: 'ReactLearning', required: true })
  sectionId: Types.ObjectId;
}

export const ReactTopicSchema = SchemaFactory.createForClass(ReactTopic);
