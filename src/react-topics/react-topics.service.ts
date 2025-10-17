import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateReactTopicDto } from './dto/create-react-topic.dto';
import { UpdateReactTopicDto } from './dto/update-react-topic.dto';
import { ReactTopic } from './entities/react-topic.entity';

@Injectable()
export class ReactTopicsService {
  constructor(
    @InjectModel(ReactTopic.name) private reactTopicModel: Model<ReactTopic>,
  ) {}

  async create(createReactTopicDto: CreateReactTopicDto): Promise<ReactTopic> {
    const createdTopic = new this.reactTopicModel(createReactTopicDto);
    return createdTopic.save();
  }

  async findAll(): Promise<ReactTopic[]> {
    return this.reactTopicModel.find().exec();
  }

  async findByTopicId(topicId: string): Promise<ReactTopic> {
    const topic = await this.reactTopicModel.findOne({ topicId }).exec();
    if (!topic) {
      throw new NotFoundException(`Topic with topicId ${topicId} not found`);
    }
    return topic;
  }

  async findByIds(topicIds: string[]): Promise<ReactTopic[]> {
    const objectIds = topicIds.map(id => new Types.ObjectId(id));
    return this.reactTopicModel.find({ _id: { $in: objectIds } }).exec();
  }

  async findOne(id: string): Promise<ReactTopic> {
    const topic = await this.reactTopicModel.findById(id).exec();
    if (!topic) {
      throw new NotFoundException(`Topic with ID ${id} not found`);
    }
    return topic;
  }

  async update(id: string, updateReactTopicDto: UpdateReactTopicDto): Promise<ReactTopic> {
    const updatedTopic = await this.reactTopicModel
      .findByIdAndUpdate(id, updateReactTopicDto, { new: true })
      .exec();
    if (!updatedTopic) {
      throw new NotFoundException(`Topic with ID ${id} not found`);
    }
    return updatedTopic;
  }

  async remove(id: string): Promise<ReactTopic> {
    const deletedTopic = await this.reactTopicModel.findByIdAndDelete(id).exec();
    if (!deletedTopic) {
      throw new NotFoundException(`Topic with ID ${id} not found`);
    }
    return deletedTopic;
  }

  async markAsCompleted(id: string): Promise<ReactTopic> {
    const topic = await this.reactTopicModel
      .findByIdAndUpdate(id, { isCompleted: true }, { new: true })
      .exec();
    if (!topic) {
      throw new NotFoundException(`Topic with ID ${id} not found`);
    }
    return topic;
  }

  async markAsIncomplete(id: string): Promise<ReactTopic> {
    const topic = await this.reactTopicModel
      .findByIdAndUpdate(id, { isCompleted: false }, { new: true })
      .exec();
    if (!topic) {
      throw new NotFoundException(`Topic with ID ${id} not found`);
    }
    return topic;
  }
}
