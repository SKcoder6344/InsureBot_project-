import React, { useState, useEffect, useRef } from 'react';
import { Shield, MessageCircle, Phone, Settings, Brain, BarChart3 } from 'lucide-react';
import { VoiceVisualizer } from './components/VoiceVisualizer';
import { ChatMessage } from './components/ChatMessage';
import { UserProfile } from './components/UserProfile';
import { PerformanceMetrics } from './components/PerformanceMetrics';
import { TrainingPanel } from './components/TrainingPanel';
import { PerformanceSummary } from './components/PerformanceSummary';
import { SpeechService } from './services/speechService';
import { ConversationService } from './services/conversationService';
import { TrainingService } from './services/trainingService';
import { Message, ConversationState } from './types';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationState, setConversationState] = useState<ConversationState>({
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    currentContext: '',
    userProfile: {}
  });
  const [responseTime, setResponseTime] = useState(0);
  const [conversationCount, setConversationCount] = useState(0);
  const [showTraining, setShowTraining] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  
  const speechService = useRef<SpeechService>();
  const conversationService = useRef<ConversationService>();
  const trainingService = useRef<TrainingService>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    speechService.current = new SpeechService();
    trainingService.current = new TrainingService();
    conversationService.current = new ConversationService(trainingService.current);
    
    // Initial greeting
    addBotMessage("Hello! I'm your personal insurance assistant. I can help you understand insurance products, answer your questions, and provide personalized recommendations. How can I assist you today?");
    
    return () => {
      if (speechService.current) {
        speechService.current.stopListening();
        speechService.current.stopSpeaking();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
    return message;
  };

  const addBotMessage = async (text: string) => {
    const message = addMessage(text, 'bot');
    
    // Speak the response
    if (speechService.current) {
      setConversationState(prev => ({ ...prev, isSpeaking: true }));
      try {
        await speechService.current.speak(text);
      } catch (error) {
        console.error('Speech synthesis error:', error);
      } finally {
        setConversationState(prev => ({ ...prev, isSpeaking: false }));
      }
    }
    
    return message;
  };

  const handleStartListening = async () => {
    if (!speechService.current || conversationState.isListening || conversationState.isSpeaking) {
      return;
    }

    setConversationState(prev => ({ ...prev, isListening: true }));
    startTimeRef.current = Date.now();

    try {
      const transcript = await speechService.current.startListening();
      
      if (transcript.trim()) {
        // Add user message
        addMessage(transcript, 'user');
        
        // Process the message
        setConversationState(prev => ({ ...prev, isListening: false, isProcessing: true }));
        
        if (conversationService.current) {
          const response = await conversationService.current.processMessage(transcript);
          const processingTime = Date.now() - startTimeRef.current;
          setResponseTime(processingTime);
          
          // Update user profile and context
          const userProfile = conversationService.current.getUserProfile();
          const currentContext = conversationService.current.getCurrentContext();
          
          setConversationState(prev => ({
            ...prev,
            isProcessing: false,
            userProfile,
            currentContext
          }));
          
          setConversationCount(prev => prev + 1);
          
          // Add bot response
          await addBotMessage(response);
        }
      }
    } catch (error) {
      console.error('Speech recognition error:', error);
      setConversationState(prev => ({ 
        ...prev, 
        isListening: false, 
        isProcessing: false 
      }));
      
      if (error instanceof Error && error.message.includes('not supported')) {
        await addBotMessage("I'm sorry, but voice recognition is not supported in your browser. Please try using a modern browser like Chrome or Edge, or type your message instead.");
      } else {
        await addBotMessage("I'm sorry, I didn't catch that. Could you please try speaking again?");
      }
    }
  };

  const handleStopSpeaking = () => {
    if (speechService.current) {
      speechService.current.stopSpeaking();
      setConversationState(prev => ({ ...prev, isSpeaking: false }));
    }
  };

  const calculateAccuracy = () => {
    // Simple accuracy calculation based on successful conversations
    if (conversationCount === 0) return 95;
    return Math.max(85, 95 - (conversationCount * 0.5)); // Simulated accuracy
  };

  const handleKnowledgeUpdate = () => {
    // Refresh conversation service with updated knowledge
    if (trainingService.current) {
      conversationService.current = new ConversationService(trainingService.current);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">InsureBot</h1>
                <p className="text-xs text-gray-500">AI Insurance Assistant</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>Voice Enabled</span>
              </div>
              <button
                onClick={() => setShowTraining(!showTraining)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  showTraining 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Brain className="w-4 h-4" />
                <span className="text-sm">Training</span>
              </button>
              <button
                onClick={() => setShowSummary(!showSummary)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  showSummary 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm">Summary</span>
              </button>
              <Settings className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {showSummary ? (
          <PerformanceSummary 
            responseTime={responseTime}
            conversationCount={conversationCount}
            accuracy={calculateAccuracy()}
          />
        ) : showTraining ? (
          <TrainingPanel 
            trainingService={trainingService.current!}
            onKnowledgeUpdate={handleKnowledgeUpdate}
          />
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Area */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Conversation</h2>
              </div>
              <p className="text-blue-100 text-sm mt-1">
                Speak naturally or click the microphone to start
              </p>
            </div>
            
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Voice Controls */}
            <div className="p-6 bg-white border-t border-gray-200">
              <VoiceVisualizer
                isListening={conversationState.isListening}
                isSpeaking={conversationState.isSpeaking}
                isProcessing={conversationState.isProcessing}
                onToggleListening={handleStartListening}
                onStopSpeaking={handleStopSpeaking}
              />
            </div>
          </div>
          
          {/* User Profile */}
          <div className="space-y-6">
            <UserProfile 
              profile={conversationState.userProfile}
              conversationContext={conversationState.currentContext}
            />
            
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Topics</h3>
              <div className="space-y-2">
                {[
                  'Life Insurance Plans',
                  'Health Insurance',
                  'Premium Calculator',
                  'Claim Process',
                  'Policy Comparison'
                ].map((topic, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                    onClick={() => {
                      addMessage(`Tell me about ${topic.toLowerCase()}`, 'user');
                      if (conversationService.current) {
                        conversationService.current.processMessage(`Tell me about ${topic.toLowerCase()}`).then(response => {
                          addBotMessage(response);
                        });
                      }
                    }}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Performance Metrics */}
          <div>
            <PerformanceMetrics
              responseTime={responseTime}
              accuracy={calculateAccuracy()}
              conversationCount={conversationCount}
              isActive={conversationState.isListening || conversationState.isProcessing || conversationState.isSpeaking}
            />
            
            {/* Demo Info */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Demo Features</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Real-time voice recognition</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Natural language processing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Insurance domain knowledge</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Conversation context tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Performance monitoring</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default App;