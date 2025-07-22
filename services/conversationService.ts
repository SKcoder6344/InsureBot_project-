import { knowledgeBase } from '../data/knowledgeBase';
import { UserProfile, FAQ, InsuranceProduct } from '../types';
import { TrainingService } from './trainingService';

export class ConversationService {
  private userProfile: UserProfile = {};
  private conversationContext: string[] = [];
  private currentTopic = '';
  private trainingService: TrainingService | null = null;

  constructor(trainingService?: TrainingService) {
    this.initializeGreeting();
    this.trainingService = trainingService || null;
  }

  private initializeGreeting() {
    this.conversationContext.push('greeting');
  }

  async processMessage(userInput: string): Promise<string> {
    const normalizedInput = userInput.toLowerCase().trim();
    
    // Add to conversation context
    this.conversationContext.push(normalizedInput);
    
    // Keep only last 5 exchanges for context
    if (this.conversationContext.length > 10) {
      this.conversationContext = this.conversationContext.slice(-10);
    }

    // Handle interruptions and conversation flow
    if (this.isInterruption(normalizedInput)) {
      return this.handleInterruption(normalizedInput);
    }

    // Extract user information
    this.extractUserInfo(normalizedInput);

    // Determine intent and generate response
    const intent = this.determineIntent(normalizedInput);
    return this.generateResponse(intent, normalizedInput);
  }

  private isInterruption(input: string): boolean {
    const interruptionPatterns = [
      'wait', 'stop', 'hold on', 'excuse me', 'sorry', 'can you repeat',
      'i didn\'t understand', 'what did you say', 'pardon', 'come again'
    ];
    
    return interruptionPatterns.some(pattern => input.includes(pattern));
  }

  private handleInterruption(input: string): string {
    if (input.includes('repeat') || input.includes('what did you say') || input.includes('pardon')) {
      return "I apologize for any confusion. Let me repeat that more clearly. What specific information about insurance would you like me to help you with today?";
    }
    
    if (input.includes('wait') || input.includes('hold on')) {
      return "Of course, take your time. I'm here whenever you're ready to continue our conversation about insurance.";
    }
    
    if (input.includes('didn\'t understand')) {
      return "I understand that insurance can be complex. Let me explain things more simply. What specific aspect would you like me to clarify?";
    }
    
    return "No problem at all. How can I better assist you with your insurance needs?";
  }

  private extractUserInfo(input: string) {
    // Extract name
    const nameMatch = input.match(/(?:my name is|i'm|i am|call me) (\w+)/i);
    if (nameMatch) {
      this.userProfile.name = nameMatch[1];
    }

    // Extract age
    const ageMatch = input.match(/(?:i'm|i am|age is) (\d+)/i);
    if (ageMatch) {
      this.userProfile.age = parseInt(ageMatch[1]);
    }

    // Extract family information
    if (input.includes('married') || input.includes('wife') || input.includes('husband')) {
      this.userProfile.familySize = (this.userProfile.familySize || 1) + 1;
    }
    
    const childrenMatch = input.match(/(\d+) (?:child|children|kids)/i);
    if (childrenMatch) {
      this.userProfile.familySize = (this.userProfile.familySize || 2) + parseInt(childrenMatch[1]);
    }
  }

  private determineIntent(input: string): string {
    // Greeting patterns
    if (this.isGreeting(input)) return 'greeting';
    
    // Product inquiry patterns
    if (this.isProductInquiry(input)) return 'product_inquiry';
    
    // FAQ patterns
    if (this.isFAQQuery(input)) return 'faq';
    
    // Premium/pricing patterns
    if (input.includes('premium') || input.includes('cost') || input.includes('price')) return 'pricing';
    
    // Claim patterns
    if (input.includes('claim') || input.includes('settlement')) return 'claims';
    
    // Personal recommendation
    if (input.includes('recommend') || input.includes('suggest') || input.includes('best for me')) return 'recommendation';
    
    // Default to general inquiry
    return 'general';
  }

  private isGreeting(input: string): boolean {
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'namaste'];
    return greetings.some(greeting => input.includes(greeting));
  }

  private isProductInquiry(input: string): boolean {
    const productKeywords = ['life insurance', 'health insurance', 'term insurance', 'motor insurance', 'travel insurance'];
    return productKeywords.some(keyword => input.includes(keyword));
  }

  private isFAQQuery(input: string): boolean {
    return knowledgeBase.faqs.some(faq => 
      faq.keywords.some(keyword => input.includes(keyword.toLowerCase()))
    );
  }

  private generateResponse(intent: string, input: string): string {
    switch (intent) {
      case 'greeting':
        return this.generateGreeting();
      
      case 'product_inquiry':
        return this.generateProductResponse(input);
      
      case 'faq':
        return this.generateFAQResponse(input);
      
      case 'pricing':
        return this.generatePricingResponse(input);
      
      case 'claims':
        return this.generateClaimsResponse();
      
      case 'recommendation':
        return this.generateRecommendation();
      
      default:
        return this.generateGeneralResponse(input);
    }
  }

  private generateGreeting(): string {
    const greetings = [
      `Hello! I'm your personal insurance assistant. I'm here to help you understand and find the right insurance coverage for your needs.`,
      `Hi there! Welcome to InsureBot. I can help you with life insurance, health insurance, and answer any questions you might have.`,
      `Good day! I'm here to make insurance simple and accessible for you. What would you like to know about today?`
    ];
    
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    
    if (this.userProfile.name) {
      return `${greeting.replace('Hello!', `Hello ${this.userProfile.name}!`)} How can I assist you today?`;
    }
    
    return `${greeting} May I know your name so I can personalize our conversation?`;
  }

  private generateProductResponse(input: string): string {
    let relevantProducts: InsuranceProduct[] = [];
    
    if (input.includes('life')) {
      relevantProducts = knowledgeBase.products.filter(p => p.type === 'life');
    } else if (input.includes('health')) {
      relevantProducts = knowledgeBase.products.filter(p => p.type === 'health');
    } else {
      relevantProducts = knowledgeBase.products;
    }

    if (relevantProducts.length === 0) {
      return "I'd be happy to help you with insurance products. We offer life insurance, health insurance, motor insurance, and more. Which type interests you most?";
    }

    const product = relevantProducts[0];
    return `Great question about ${product.name}! ${product.description}. 

Key features include:
${product.keyFeatures.map(feature => `• ${feature}`).join('\n')}

The premium range is ${product.premiumRange}. Would you like me to explain more about the coverage details or help you with eligibility requirements?`;
  }

  private generateFAQResponse(input: string): string {
    // First check training data for more specific responses
    if (this.trainingService) {
      const trainedResponses = this.trainingService.searchKnowledge(input);
      if (trainedResponses.length > 0 && trainedResponses[0].confidence > 70) {
        return `${trainedResponses[0].response}

Is there anything specific about this you'd like me to explain further?`;
      }
    }

    const matchingFAQ = knowledgeBase.faqs.find(faq => 
      faq.keywords.some(keyword => input.includes(keyword.toLowerCase()))
    );

    if (matchingFAQ) {
      return `${matchingFAQ.answer}

Is there anything specific about this you'd like me to explain further?`;
    }

    return "That's a great question! Let me help you with that. Could you be more specific about what aspect of insurance you'd like to know about?";
  }

  private generatePricingResponse(input: string): string {
    const name = this.userProfile.name ? this.userProfile.name : 'there';
    
    return `Hi ${name}! Insurance premiums depend on several factors like your age, health condition, coverage amount, and the type of policy you choose.

For example:
• Term life insurance can start from as low as ₹500 per month
• Health insurance for a family typically ranges from ₹8,000 to ₹25,000 per year
• The younger and healthier you are, the lower your premiums will be

To give you an accurate quote, I'd need to know a bit more about you. What's your age and what type of coverage are you looking for?`;
  }

  private generateClaimsResponse(): string {
    return `Filing an insurance claim is straightforward. Here's the general process:

1. **Immediate notification** - Contact your insurer within 30 days of the incident
2. **Documentation** - Gather all required documents (medical reports, bills, etc.)
3. **Claim form** - Fill out the claim form completely and accurately
4. **Submission** - Submit everything to your insurer (online submission is fastest)
5. **Follow-up** - Track your claim status regularly

Most insurers now offer online claim filing and 24/7 customer support. The typical settlement time is 15-30 days for straightforward claims.

Do you have a specific claim situation you need help with?`;
  }

  private generateRecommendation(): string {
    const age = this.userProfile.age;
    const familySize = this.userProfile.familySize || 1;
    const name = this.userProfile.name ? this.userProfile.name : '';

    let recommendation = `${name ? `${name}, ` : ''}based on what I know about your situation, here are my recommendations:\n\n`;

    if (age && age < 30) {
      recommendation += `**For someone in their ${age < 25 ? 'early' : 'late'} twenties:**
• Start with a term life insurance policy (10-15 times your annual income)
• Consider a basic health insurance plan
• Premiums will be very affordable at your age\n\n`;
    } else if (age && age >= 30) {
      recommendation += `**For someone in their ${age < 40 ? 'thirties' : 'forties or above'}:**
• Comprehensive term life insurance is essential
• Family health insurance with higher coverage
• Consider investment-linked insurance plans\n\n`;
    }

    if (familySize > 1) {
      recommendation += `**For your family of ${familySize}:**
• Family floater health insurance plan
• Adequate life insurance coverage for income protection
• Consider children's education and future planning\n\n`;
    }

    recommendation += `Would you like me to provide specific product recommendations and premium estimates based on your profile?`;

    return recommendation;
  }

  private generateGeneralResponse(input: string): string {
    const responses = [
      "That's an interesting question about insurance. Let me help you understand this better.",
      "I'd be happy to explain that for you. Insurance can seem complex, but I'll make it simple.",
      "Great question! Let me provide you with clear information about this.",
    ];

    const baseResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return `${baseResponse} 

I can help you with:
• Life insurance planning and products
• Health insurance coverage options
• Premium calculations and comparisons
• Claims process and documentation
• Policy recommendations based on your needs

What specific aspect would you like to explore first?`;
  }

  getUserProfile(): UserProfile {
    return { ...this.userProfile };
  }

  getCurrentContext(): string {
    return this.conversationContext.slice(-3).join(' → ');
  }
}