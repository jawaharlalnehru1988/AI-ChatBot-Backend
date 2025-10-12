import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAgenticAiDto } from './dto/create-agentic-ai.dto';
import { UpdateAgenticAiDto } from './dto/update-agentic-ai.dto';
import { AgenticAi } from './entities/agentic-ai.entity';

@Injectable()
export class AgenticAiService {
  constructor(
    @InjectModel(AgenticAi.name) private agenticAiModel: Model<AgenticAi>,
  ) {}

  async create(createAgenticAiDto: CreateAgenticAiDto): Promise<AgenticAi> {
    const createdAgenticAi = new this.agenticAiModel(createAgenticAiDto);
    return createdAgenticAi.save();
  }

  async findAll(): Promise<AgenticAi[]> {
    return this.agenticAiModel.find().exec();
  }

  async findOne(id: string): Promise<AgenticAi> {
    const agenticAi = await this.agenticAiModel.findById(id).exec();
    if (!agenticAi) {
      throw new NotFoundException(`AgenticAi with ID ${id} not found`);
    }
    return agenticAi;
  }

  async findByCategory(category: string): Promise<AgenticAi[]> {
    return this.agenticAiModel.find({ category }).exec();
  }

  async findBySectionLink(sectionLink: string): Promise<AgenticAi> {
    const agenticAi = await this.agenticAiModel.findOne({ sectionLink }).exec();
    if (!agenticAi) {
      throw new NotFoundException(`AgenticAi with sectionLink ${sectionLink} not found`);
    }
    return agenticAi;
  }

  async update(id: string, updateAgenticAiDto: UpdateAgenticAiDto): Promise<AgenticAi> {
    const updatedAgenticAi = await this.agenticAiModel
      .findByIdAndUpdate(id, updateAgenticAiDto, { new: true })
      .exec();
    if (!updatedAgenticAi) {
      throw new NotFoundException(`AgenticAi with ID ${id} not found`);
    }
    return updatedAgenticAi;
  }

  async remove(id: string): Promise<AgenticAi> {
    const deletedAgenticAi = await this.agenticAiModel.findByIdAndDelete(id).exec();
    if (!deletedAgenticAi) {
      throw new NotFoundException(`AgenticAi with ID ${id} not found`);
    }
    return deletedAgenticAi;
  }

  async search(query: string): Promise<AgenticAi[]> {
    return this.agenticAiModel
      .find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
        ],
      })
      .exec();
  }
}
