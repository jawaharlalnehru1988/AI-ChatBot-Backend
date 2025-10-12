import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMcqTrainingDto } from './dto/create-mcq-training.dto';
import { UpdateMcqTrainingDto } from './dto/update-mcq-training.dto';
import { ValidateAnswerDto } from './dto/validate-answer.dto';
import { McqTraining } from './entities/mcq-training.entity';

@Injectable()
export class McqTrainingService {
  constructor(
    @InjectModel(McqTraining.name) private mcqTrainingModel: Model<McqTraining>,
  ) {}

  async create(createMcqTrainingDto: CreateMcqTrainingDto): Promise<McqTraining> {
    // Validate that choices array has exactly 4 items
    if (createMcqTrainingDto.choices.length !== 4) {
      throw new BadRequestException('Each question must have exactly 4 choices');
    }

    // Validate that correctAnswer matches one of the choice IDs
    const validChoiceIds = createMcqTrainingDto.choices.map(c => c.id);
    if (!validChoiceIds.includes(createMcqTrainingDto.correctAnswer)) {
      throw new BadRequestException('correctAnswer must match one of the choice IDs');
    }

    const createdMcq = new this.mcqTrainingModel(createMcqTrainingDto);
    return createdMcq.save();
  }

  async findAll(): Promise<McqTraining[]> {
    return this.mcqTrainingModel.find().exec();
  }

  async findOne(id: string): Promise<McqTraining> {
    const mcq = await this.mcqTrainingModel.findById(id).exec();
    if (!mcq) {
      throw new NotFoundException(`MCQ question with ID ${id} not found`);
    }
    return mcq;
  }

  async getAvailableTopics(): Promise<string[]> {
    const topics = await this.mcqTrainingModel.distinct('topic').exec();
    return topics;
  }

  async getLevelsByTopic(topic: string): Promise<number[]> {
    const levels = await this.mcqTrainingModel
      .distinct('level', { topic })
      .exec();
    return levels.sort((a, b) => a - b);
  }

  async getQuestionsByTopicAndLevel(topic: string, level: number): Promise<McqTraining[]> {
    const questions = await this.mcqTrainingModel
      .find({ topic, level })
      .select('-correctAnswer -explanation') // Hide correct answer and explanation
      .exec();
    
    if (questions.length === 0) {
      throw new NotFoundException(`No questions found for topic "${topic}" and level ${level}`);
    }

    return questions;
  }

  async validateAnswer(validateAnswerDto: ValidateAnswerDto): Promise<{
    isCorrect: boolean;
    correctAnswer: string;
    explanation: string;
    points: number;
  }> {
    const mcq = await this.mcqTrainingModel.findById(validateAnswerDto.questionId).exec();
    
    if (!mcq) {
      throw new NotFoundException(`MCQ question with ID ${validateAnswerDto.questionId} not found`);
    }

    const isCorrect = mcq.correctAnswer === validateAnswerDto.selectedAnswer;
    
    return {
      isCorrect,
      correctAnswer: mcq.correctAnswer,
      explanation: mcq.explanation,
      points: isCorrect ? mcq.points : 0,
    };
  }

  async update(id: string, updateMcqTrainingDto: UpdateMcqTrainingDto): Promise<McqTraining> {
    // If choices are being updated, validate length
    if (updateMcqTrainingDto.choices && updateMcqTrainingDto.choices.length !== 4) {
      throw new BadRequestException('Each question must have exactly 4 choices');
    }

    // If correctAnswer is being updated, validate it matches a choice ID
    if (updateMcqTrainingDto.correctAnswer && updateMcqTrainingDto.choices) {
      const validChoiceIds = updateMcqTrainingDto.choices.map(c => c.id);
      if (!validChoiceIds.includes(updateMcqTrainingDto.correctAnswer)) {
        throw new BadRequestException('correctAnswer must match one of the choice IDs');
      }
    }

    const updatedMcq = await this.mcqTrainingModel
      .findByIdAndUpdate(id, updateMcqTrainingDto, { new: true })
      .exec();
    
    if (!updatedMcq) {
      throw new NotFoundException(`MCQ question with ID ${id} not found`);
    }
    
    return updatedMcq;
  }

  async remove(id: string): Promise<McqTraining> {
    const deletedMcq = await this.mcqTrainingModel.findByIdAndDelete(id).exec();
    if (!deletedMcq) {
      throw new NotFoundException(`MCQ question with ID ${id} not found`);
    }
    return deletedMcq;
  }

  async getQuestionCount(topic: string, level: number): Promise<number> {
    return this.mcqTrainingModel.countDocuments({ topic, level }).exec();
  }

  // Group by functionality
  async getAllTopicsWithStats(): Promise<Array<{
    topic: string;
    totalQuestions: number;
    levels: Array<{ level: number; count: number }>;
  }>> {
    const topics = await this.mcqTrainingModel.distinct('topic').exec();
    
    const topicsWithStats = await Promise.all(
      topics.map(async (topic) => {
        const levels = await this.mcqTrainingModel.distinct('level', { topic }).exec();
        
        const levelStats = await Promise.all(
          levels.map(async (level) => ({
            level,
            count: await this.mcqTrainingModel.countDocuments({ topic, level }).exec(),
          }))
        );

        const totalQuestions = levelStats.reduce((sum, stat) => sum + stat.count, 0);

        return {
          topic,
          totalQuestions,
          levels: levelStats.sort((a, b) => a.level - b.level),
        };
      })
    );

    return topicsWithStats.sort((a, b) => a.topic.localeCompare(b.topic));
  }

  async getTopicStats(topic: string): Promise<{
    topic: string;
    totalQuestions: number;
    levels: Array<{ level: number; count: number; difficulties: Record<string, number> }>;
    difficultyBreakdown: Record<string, number>;
  }> {
    // Check if topic exists
    const topicExists = await this.mcqTrainingModel.findOne({ topic }).exec();
    if (!topicExists) {
      throw new NotFoundException(`Topic "${topic}" not found`);
    }

    const levels = await this.mcqTrainingModel.distinct('level', { topic }).exec();
    
    const levelStats = await Promise.all(
      levels.map(async (level) => {
        const questions = await this.mcqTrainingModel.find({ topic, level }).exec();
        const count = questions.length;
        
        // Count questions by difficulty for this level
        const difficulties: Record<string, number> = {};
        questions.forEach(q => {
          const diff = q.difficulty || 'medium';
          difficulties[diff] = (difficulties[diff] || 0) + 1;
        });

        return { level, count, difficulties };
      })
    );

    // Calculate overall difficulty breakdown
    const allQuestions = await this.mcqTrainingModel.find({ topic }).exec();
    const difficultyBreakdown: Record<string, number> = {};
    allQuestions.forEach(q => {
      const diff = q.difficulty || 'medium';
      difficultyBreakdown[diff] = (difficultyBreakdown[diff] || 0) + 1;
    });

    const totalQuestions = allQuestions.length;

    return {
      topic,
      totalQuestions,
      levels: levelStats.sort((a, b) => a.level - b.level),
      difficultyBreakdown,
    };
  }

  async getTopicLevels(topic: string): Promise<Array<{
    level: number;
    count: number;
    maxPoints: number;
  }>> {
    const levels = await this.mcqTrainingModel.distinct('level', { topic }).exec();
    
    if (levels.length === 0) {
      throw new NotFoundException(`No levels found for topic "${topic}"`);
    }

    const levelDetails = await Promise.all(
      levels.map(async (level) => {
        const questions = await this.mcqTrainingModel.find({ topic, level }).exec();
        const count = questions.length;
        const maxPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);

        return { level, count, maxPoints };
      })
    );

    return levelDetails.sort((a, b) => a.level - b.level);
  }
}
