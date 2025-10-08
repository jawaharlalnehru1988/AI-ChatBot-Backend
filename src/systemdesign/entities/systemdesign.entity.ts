import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type SystemdesignDocument = Systemdesign & Document;

@Schema({ collection: 'systemdesign' })
export class Systemdesign {
  @ApiProperty({
    description: 'MongoDB ObjectId',
    example: '652e1a8e0000000000000001',
  })
  _id?: string;

  @ApiProperty({
    description: 'Title of the system design topic',
    example: 'From Requirements to Architecture',
  })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    description: 'Detailed description of the system design topic',
    example: 'Learn how to design systems that can scale efficiently and handle high traffic loads.',
  })
  @Prop({ required: true })
  description: string;

  @ApiProperty({
    description: 'URL of the image associated with the topic',
    example: 'https://res.cloudinary.com/dbmkctsda/image/upload/v1756956557/c937db99-2e3a-4173-ace3-626cea9956f8.png',
  })
  @Prop({ required: true })
  imageUrl: string;

  @ApiProperty({
    description: 'Category of the system design topic',
    example: 'High-Level-Design',
  })
  @Prop({ required: true })
  category: string;

  @ApiProperty({
    description: 'URL-friendly link for the section',
    example: 'from-requirements-to-architecture',
  })
  @Prop({ required: true })
  sectionLink: string;

  @ApiProperty({
    description: 'URL of the audio file for the topic',
    example: 'https://raw.githubusercontent.com/jawaharlalnehru1988/bgsloka/master/assets/high%20level%20design/ep2%20-%20from%20requirements%20to%20architecture.mp3',
  })
  @Prop({ required: true })
  audioUrl: string;

  @ApiProperty({
    description: 'Detailed content or article text',
    example: '',
  })
  @Prop({ default: '' })
  content: string;
}

export const SystemdesignSchema = SchemaFactory.createForClass(Systemdesign);
