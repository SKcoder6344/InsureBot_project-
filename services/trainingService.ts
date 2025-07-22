import { CallRecording, ExtractedKnowledge, TrainingMetrics } from '../types';

export class TrainingService {
  private recordings: CallRecording[] = [];
  private extractedKnowledge: ExtractedKnowledge[] = [];

  constructor() {
    this.loadStoredData();
  }

  private loadStoredData() {
    const stored = localStorage.getItem('insurebot_training_data');
    if (stored) {
      const data = JSON.parse(stored);
      this.recordings = data.recordings || [];
      this.extractedKnowledge = data.knowledge || [];
    }
  }

  private saveData() {
    const data = {
      recordings: this.recordings,
      knowledge: this.extractedKnowledge
    };
    localStorage.setItem('insurebot_training_data', JSON.stringify(data));
  }

  async processAudioFile(file: File): Promise<CallRecording> {
    const recording: CallRecording = {
      id: Date.now().toString(),
      filename: file.name,
      duration: 0,
      transcript: '',
      agentResponses: [],
      customerQueries: [],
      extractedKnowledge: [],
      uploadDate: new Date(),
      processed: false
    };

    try {
      // Simulate audio processing (in real implementation, you'd use speech-to-text API)
      const transcript = await this.simulateTranscription(file);
      recording.transcript = transcript;
      recording.duration = await this.getAudioDuration(file);
      
      // Extract conversation patterns
      const { agentResponses, customerQueries } = this.parseConversation(transcript);
      recording.agentResponses = agentResponses;
      recording.customerQueries = customerQueries;
      
      // Extract knowledge
      recording.extractedKnowledge = this.extractKnowledgeFromConversation(
        customerQueries, 
        agentResponses
      );
      
      recording.processed = true;
      this.recordings.push(recording);
      
      // Add to global knowledge base
      this.extractedKnowledge.push(...recording.extractedKnowledge);
      
      this.saveData();
      return recording;
      
    } catch (error) {
      console.error('Error processing audio file:', error);
      throw new Error('Failed to process audio file');
    }
  }

  private async simulateTranscription(file: File): Promise<string> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return sample transcript based on filename or provide default
    const sampleTranscripts = {
      'life_insurance_call.mp3': `
Agent: Good morning! Thank you for calling InsureLife. My name is Priya. How can I help you today?

Customer: Hi, I'm looking for life insurance. I'm 32 years old and recently got married.

Agent: Congratulations on your marriage! That's a great time to consider life insurance. Can you tell me about your current financial situation and any dependents?

Customer: Thank you. My wife is working too, but we're planning to have children in the next few years. I earn about 8 lakhs per year.

Agent: Perfect. For someone in your situation, I'd recommend term life insurance. Given your income of 8 lakhs, you should consider coverage of 80 lakhs to 1 crore. This would ensure your family's financial security.

Customer: That sounds like a lot. What would be the premium for such coverage?

Agent: For a 32-year-old healthy male, a 1 crore term plan would cost approximately 12,000 to 15,000 per year. That's just about 1,000 to 1,250 per month - less than what many people spend on dining out.

Customer: That's actually quite reasonable. What about medical tests?

Agent: For coverage up to 50 lakhs, usually no medical tests are required if you're under 35 and have no pre-existing conditions. For higher amounts, we might need basic tests like blood work and ECG.

Customer: Okay, and how long does the process take?

Agent: Once you submit your application with all documents, it typically takes 7-15 days for approval. We can start the process today if you'd like.

Customer: Yes, I'd like to proceed. What documents do I need?
      `,
      'health_insurance_call.mp3': `
Agent: Hello, this is Rajesh from HealthFirst Insurance. How may I assist you today?

Customer: Hi, I want to buy health insurance for my family. We are four members - me, my wife, and two children.

Agent: That's wonderful that you're thinking about your family's health security. Can you tell me the ages of all family members?

Customer: I'm 35, my wife is 32, and our children are 8 and 5 years old.

Agent: Perfect. For a family of four with your age profile, I'd recommend our Family Health Plan with a sum insured of 5 to 10 lakhs.

Customer: What's the difference between individual and family floater plans?

Agent: Great question! In a family floater, the entire sum insured can be used by any family member. So if you have 10 lakhs coverage, any one person can use the full amount if needed. Individual plans give separate coverage to each person.

Customer: Which is better?

Agent: For families like yours, floater plans are usually more cost-effective and provide better coverage flexibility. The premium for a 10 lakh family floater would be around 18,000 to 25,000 per year.

Customer: What about pre-existing diseases? My wife has diabetes.

Agent: Pre-existing conditions are covered after a waiting period, typically 2-4 years depending on the condition. Diabetes is commonly covered. We'll need her medical reports for accurate assessment.

Customer: Are there any other benefits?

Agent: Yes! Our plan includes free annual health check-ups, cashless treatment at 8,000+ hospitals, ambulance coverage, and even teleconsultation services.
      `
    };

    return sampleTranscripts[file.name as keyof typeof sampleTranscripts] || 
           sampleTranscripts['life_insurance_call.mp3'];
  }

  private async getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.onloadedmetadata = () => {
        resolve(audio.duration);
      };
      audio.src = URL.createObjectURL(file);
    });
  }

  private parseConversation(transcript: string): { agentResponses: string[], customerQueries: string[] } {
    const lines = transcript.split('\n').filter(line => line.trim());
    const agentResponses: string[] = [];
    const customerQueries: string[] = [];

    lines.forEach(line => {
      if (line.startsWith('Agent:')) {
        agentResponses.push(line.replace('Agent:', '').trim());
      } else if (line.startsWith('Customer:')) {
        customerQueries.push(line.replace('Customer:', '').trim());
      }
    });

    return { agentResponses, customerQueries };
  }

  private extractKnowledgeFromConversation(
    queries: string[], 
    responses: string[]
  ): ExtractedKnowledge[] {
    const knowledge: ExtractedKnowledge[] = [];

    for (let i = 0; i < Math.min(queries.length, responses.length); i++) {
      const query = queries[i];
      const response = responses[i];

      if (query && response && query.length > 10 && response.length > 20) {
        const category = this.categorizeQuery(query);
        const keywords = this.extractKeywords(query + ' ' + response);

        knowledge.push({
          query: query,
          response: response,
          category: category,
          confidence: this.calculateConfidence(query, response),
          keywords: keywords
        });
      }
    }

    return knowledge;
  }

  private categorizeQuery(query: string): string {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('life insurance') || lowerQuery.includes('term')) {
      return 'life_insurance';
    }
    if (lowerQuery.includes('health insurance') || lowerQuery.includes('medical')) {
      return 'health_insurance';
    }
    if (lowerQuery.includes('premium') || lowerQuery.includes('cost') || lowerQuery.includes('price')) {
      return 'pricing';
    }
    if (lowerQuery.includes('claim') || lowerQuery.includes('settlement')) {
      return 'claims';
    }
    if (lowerQuery.includes('document') || lowerQuery.includes('process')) {
      return 'documentation';
    }
    
    return 'general';
  }

  private extractKeywords(text: string): string[] {
    const commonWords = new Set(['the', 'is', 'at', 'which', 'on', 'and', 'a', 'to', 'are', 'as', 'for', 'with', 'it', 'that', 'be', 'of', 'in', 'you', 'have', 'can', 'will', 'would', 'if', 'we', 'my', 'your', 'our']);
    
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.has(word))
      .slice(0, 10);
  }

  private calculateConfidence(query: string, response: string): number {
    // Simple confidence calculation based on response length and keyword matching
    const baseConfidence = Math.min(response.length / 100, 1) * 0.7;
    const keywordBonus = this.extractKeywords(query).length * 0.05;
    return Math.min(baseConfidence + keywordBonus, 1) * 100;
  }

  getTrainingMetrics(): TrainingMetrics {
    const processedRecordings = this.recordings.filter(r => r.processed);
    const totalDuration = this.recordings.reduce((sum, r) => sum + r.duration, 0);
    
    return {
      totalRecordings: this.recordings.length,
      processedRecordings: processedRecordings.length,
      extractedResponses: this.extractedKnowledge.length,
      averageCallDuration: this.recordings.length > 0 ? totalDuration / this.recordings.length : 0,
      knowledgeBaseSize: this.extractedKnowledge.length
    };
  }

  getExtractedKnowledge(): ExtractedKnowledge[] {
    return [...this.extractedKnowledge];
  }

  getAllRecordings(): CallRecording[] {
    return [...this.recordings];
  }

  searchKnowledge(query: string): ExtractedKnowledge[] {
    const lowerQuery = query.toLowerCase();
    return this.extractedKnowledge.filter(knowledge =>
      knowledge.query.toLowerCase().includes(lowerQuery) ||
      knowledge.keywords.some(keyword => lowerQuery.includes(keyword)) ||
      knowledge.response.toLowerCase().includes(lowerQuery)
    ).sort((a, b) => b.confidence - a.confidence);
  }

  clearTrainingData() {
    this.recordings = [];
    this.extractedKnowledge = [];
    localStorage.removeItem('insurebot_training_data');
  }
}