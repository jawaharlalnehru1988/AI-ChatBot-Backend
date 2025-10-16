import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

class McqContent {
  @ApiProperty({ description: 'MongoDB auto-generated ID', required: false })
  _id?: Types.ObjectId;

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

class Topic {
  @ApiProperty({ description: 'MongoDB auto-generated ID for the topic', required: false })
  _id?: Types.ObjectId;

  @ApiProperty({ description: 'Unique identifier for the topic' })
  @Prop({ required: true })
  topicId: string;

  @ApiProperty({ description: 'Title of the topic' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ description: 'Description of the topic' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ description: 'Estimated time to complete' })
  @Prop({ required: true })
  estimatedTime: string;

  @ApiProperty({ description: 'HTML content for the topic' })
  @Prop()
  htmlContent?: string;

  @ApiProperty({ description: 'Array of MCQ questions', type: [McqContent] })
  @Prop({ type: [McqContent] })
  mcqContent?: McqContent[];

  @ApiProperty({ description: 'Whether the topic is completed' })
  @Prop({ default: false })
  isCompleted: boolean;
}

export { Topic, McqContent };

@Schema({ timestamps: true })
export class ReactLearning extends Document {
  @ApiProperty({ description: 'Unique identifier for the section', example: 'react-basics' })
  @Prop({ required: true, unique: true })
  sectionId: string;

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
