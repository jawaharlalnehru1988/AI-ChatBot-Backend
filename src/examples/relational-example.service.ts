import { Injectable } from '@nestjs/common';
import { ReactLearningService } from '../react-learning/react-learning.service';
import { ReactTopicsService } from '../react-topics/react-topics.service';

/**
 * Helper service to demonstrate the relational structure usage
 */
@Injectable()
export class RelationalExampleService {
  constructor(
    private reactLearningService: ReactLearningService,
    private reactTopicsService: ReactTopicsService,
  ) {}

  /**
   * Example: Create a complete learning structure with topics
   */
  async createExampleStructure() {
    // Step 1: Create individual topics
    const topic1 = await this.reactTopicsService.create({
      topicId: 'what-is-react',
      title: 'What is React?',
      description: 'Difference from Angular, React philosophy',
      estimatedTime: '30 min',
      htmlContent: '<h1>What is React?</h1><p>React is a JavaScript library for building user interfaces.</p>',
      mcqContent: [
        {
          question: 'What is React primarily used for?',
          options: [
            'Building user interfaces',
            'Managing application state',
            'Handling user input',
            'All of the above'
          ],
          correctAnswer: 'Building user interfaces'
        },
        {
          question: 'Which company developed React?',
          options: ['Google', 'Facebook', 'Twitter', 'Microsoft'],
          correctAnswer: 'Facebook'
        }
      ],
      isCompleted: false
    });

    const topic2 = await this.reactTopicsService.create({
      topicId: 'jsx-basics',
      title: 'JSX Basics',
      description: 'Understanding JSX syntax and its benefits',
      estimatedTime: '45 min',
      htmlContent: '<h1>JSX Basics</h1><p>JSX is a syntax extension for JavaScript.</p>',
      mcqContent: [
        {
          question: 'What does JSX stand for?',
          options: [
            'JavaScript XML',
            'JavaScript Extension',
            'Java Syntax Extension',
            'JavaScript Extra'
          ],
          correctAnswer: 'JavaScript XML'
        }
      ],
      isCompleted: false
    });

    // Step 2: Create learning section with topic references
    const learningSection = await this.reactLearningService.create({
      level: 'Beginner',
      title: 'React Basics',
      emoji: '🟢',
      description: 'Foundation Stage — Understand React\'s core building blocks and component-driven mindset',
      color: 'green',
      gradient: 'from-green-400 to-emerald-500',
      topicIds: [(topic1 as any)._id.toString(), (topic2 as any)._id.toString()]
    });

    return {
      learningSection,
      topics: [topic1, topic2]
    };
  }

  /**
   * Example: Get complete structure with populated topics
   */
  async getCompleteStructure(sectionId: string) {
    return this.reactLearningService.findOneWithTopics(sectionId);
  }

  /**
   * Example: Add a new topic to existing section
   */
  async addTopicToSection(sectionId: string, topicData: any) {
    // Create the topic first
    const topic = await this.reactTopicsService.create(topicData);
    
    // Add topic to section using the section's MongoDB ID
    await this.reactLearningService.addTopicToSection(sectionId, (topic as any)._id.toString());
    
    return {
      topic,
      updatedSection: await this.reactLearningService.findOneWithTopics(sectionId)
    };
  }

  /**
   * Example: Get topics progress for a level
   */
  async getProgressForLevel(level: string) {
    const sections = await this.reactLearningService.findByLevel(level);
    
    const progressData = await Promise.all(
      sections.map(async (section) => {
        const topicIds = section.topicIds.map(id => id.toString());
        const topics = await this.reactTopicsService.findByIds(topicIds);
        
        const completedTopics = topics.filter(topic => topic.isCompleted);
        
        return {
          id: section._id,
          title: section.title,
          totalTopics: topics.length,
          completedTopics: completedTopics.length,
          progress: topics.length > 0 ? (completedTopics.length / topics.length) * 100 : 0,
          topics: topics.map(topic => ({
            topicId: topic.topicId,
            title: topic.title,
            isCompleted: topic.isCompleted
          }))
        };
      })
    );

    return {
      level,
      totalSections: sections.length,
      overallProgress: progressData.reduce((sum, section) => sum + section.progress, 0) / progressData.length,
      sections: progressData
    };
  }
}