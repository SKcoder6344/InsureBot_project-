export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  audioUrl?: string;
}

export interface ConversationState {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  currentContext: string;
  userProfile: UserProfile;
}

export interface UserProfile {
  name?: string;
  age?: number;
  occupation?: string;
  familySize?: number;
  currentInsurance?: string[];
  interests?: string[];
}

export interface InsuranceProduct {
  id: string;
  name: string;
  type: 'life' | 'health' | 'motor' | 'travel' | 'home';
  description: string;
  keyFeatures: string[];
  eligibility: string[];
  premiumRange: string;
}

export interface KnowledgeBase {
  faqs: FAQ[];
  products: InsuranceProduct[];
  policies: PolicyInfo[];
}

export interface FAQ {
  question: string;
  answer: string;
  category: string;
  keywords: string[];
}

export interface PolicyInfo {
  type: string;
  coverage: string;
  exclusions: string[];
  claimProcess: string[];
}

export interface CallRecording {
  id: string;
  filename: string;
  duration: number;
  transcript: string;
  agentResponses: string[];
  customerQueries: string[];
  extractedKnowledge: ExtractedKnowledge[];
  uploadDate: Date;
  processed: boolean;
}

export interface ExtractedKnowledge {
  query: string;
  response: string;
  category: string;
  confidence: number;
  keywords: string[];
}

export interface TrainingMetrics {
  totalRecordings: number;
  processedRecordings: number;
  extractedResponses: number;
  averageCallDuration: number;
  knowledgeBaseSize: number;
}