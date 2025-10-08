import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSystemdesignDto } from './dto/create-systemdesign.dto';
import { UpdateSystemdesignDto } from './dto/update-systemdesign.dto';
import { Systemdesign, SystemdesignDocument } from './entities/systemdesign.entity';

@Injectable()
export class SystemdesignService {
  constructor(
    @InjectModel(Systemdesign.name) 
    private systemdesignModel: Model<SystemdesignDocument>
  ) {}

  async create(createSystemdesignDto: CreateSystemdesignDto): Promise<Systemdesign> {
    const createdSystemdesign = new this.systemdesignModel(createSystemdesignDto);
    return createdSystemdesign.save();
  }

  async findAll(): Promise<Systemdesign[]> {
    return this.systemdesignModel.find().exec();
  }

  async findOne(id: string): Promise<Systemdesign> {
    const systemdesign = await this.systemdesignModel.findById(id).exec();
    if (!systemdesign) {
      throw new NotFoundException(`Systemdesign with ID ${id} not found`);
    }
    return systemdesign;
  }

  async findByCategory(category: string): Promise<Systemdesign[]> {
    return this.systemdesignModel.find({ category }).exec();
  }

  async findBySectionLink(sectionLink: string): Promise<Systemdesign> {
    const systemdesign = await this.systemdesignModel.findOne({ sectionLink }).exec();
    if (!systemdesign) {
      throw new NotFoundException(`Systemdesign with sectionLink ${sectionLink} not found`);
    }
    return systemdesign;
  }

  async update(id: string, updateSystemdesignDto: UpdateSystemdesignDto): Promise<Systemdesign> {
    const updatedSystemdesign = await this.systemdesignModel
      .findByIdAndUpdate(id, updateSystemdesignDto, { new: true })
      .exec();
    
    if (!updatedSystemdesign) {
      throw new NotFoundException(`Systemdesign with ID ${id} not found`);
    }
    return updatedSystemdesign;
  }

  async remove(id: string): Promise<void> {
    const result = await this.systemdesignModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Systemdesign with ID ${id} not found`);
    }
  }

  async search(query: string): Promise<Systemdesign[]> {
    return this.systemdesignModel.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } }
      ]
    }).exec();
  }
}
