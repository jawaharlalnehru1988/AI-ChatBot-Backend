import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReactLearningDto } from './dto/create-react-learning.dto';
import { UpdateReactLearningDto } from './dto/update-react-learning.dto';
import { ReactLearning } from './entities/react-learning.entity';

@Injectable()
export class ReactLearningService {
  constructor(
    @InjectModel(ReactLearning.name) private reactLearningModel: Model<ReactLearning>,
  ) {}

  async create(createReactLearningDto: CreateReactLearningDto): Promise<ReactLearning> {
    const createdSection = new this.reactLearningModel(createReactLearningDto);
    return createdSection.save();
  }

  async findAll(): Promise<ReactLearning[]> {
    return this.reactLearningModel.find().populate('topicIds').exec();
  }

  async findByLevel(level: string): Promise<ReactLearning[]> {
    return this.reactLearningModel.find({ level }).populate('topicIds').exec();
  }

  async findBySectionId(sectionId: string): Promise<ReactLearning> {
    const section = await this.reactLearningModel.findOne({ sectionId }).populate('topicIds').exec();
    if (!section) {
      throw new NotFoundException(`Section with sectionId ${sectionId} not found`);
    }
    return section;
  }

  async findOne(id: string): Promise<ReactLearning> {
    const section = await this.reactLearningModel.findById(id).populate('topicIds').exec();
    if (!section) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }
    return section;
  }

  async update(id: string, updateReactLearningDto: UpdateReactLearningDto): Promise<ReactLearning> {
    const updatedSection = await this.reactLearningModel
      .findByIdAndUpdate(id, updateReactLearningDto, { new: true })
      .exec();
    if (!updatedSection) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }
    return updatedSection;
  }

  async remove(id: string): Promise<ReactLearning> {
    const deletedSection = await this.reactLearningModel.findByIdAndDelete(id).exec();
    if (!deletedSection) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }
    return deletedSection;
  }

  // Topic-specific operations
  async getTopics(id: string): Promise<any[]> {
    const section = await this.findOne(id);
    return section.topicIds || [];
  }

  async addTopicToSection(sectionId: string, topicId: string): Promise<ReactLearning> {
    const section = await this.reactLearningModel.findById(sectionId).exec();
    if (!section) {
      throw new NotFoundException(`Section with ID ${sectionId} not found`);
    }
    
    if (!section.topicIds.includes(topicId as any)) {
      section.topicIds.push(topicId as any);
      return section.save();
    }
    
    return section;
  }

  async removeTopicFromSection(sectionId: string, topicId: string): Promise<ReactLearning> {
    const section = await this.reactLearningModel.findById(sectionId).exec();
    if (!section) {
      throw new NotFoundException(`Section with ID ${sectionId} not found`);
    }
    
    section.topicIds = section.topicIds.filter(id => id.toString() !== topicId);
    return section.save();
  }

  async getLevelStatistics(level: string): Promise<any> {
    const sections = await this.findByLevel(level);
    
    const totalTopics = sections.reduce((sum, section) => sum + (section.topicIds?.length || 0), 0);
    
    // Note: Completed topics count would need to be fetched from ReactTopic collection
    // This is a simplified version
    return {
      level,
      totalSections: sections.length,
      totalTopics,
      sections: sections.map(section => ({
        sectionId: section.sectionId,
        title: section.title,
        totalTopics: section.topicIds?.length || 0,
      })),
    };
  }
}
