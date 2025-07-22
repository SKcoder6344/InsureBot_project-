import React from 'react';
import { Bot, User, Clock } from 'lucide-react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={`flex items-start space-x-3 ${isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
      {/* Avatar */}
      <div className={`
        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm
        ${isBot ? 'bg-blue-500' : 'bg-gray-500'}
      `}>
        {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>
      
      {/* Message Content */}
      <div className={`flex-1 max-w-xs lg:max-w-md ${isBot ? '' : 'text-right'}`}>
        <div className={`
          inline-block px-4 py-2 rounded-lg text-sm
          ${isBot 
            ? 'bg-white text-gray-800 shadow-md border border-gray-200' 
            : 'bg-blue-500 text-white'
          }
        `}>
          <div className="whitespace-pre-wrap">{message.text}</div>
        </div>
        
        {/* Timestamp */}
        <div className={`
          flex items-center mt-1 text-xs text-gray-500
          ${isBot ? 'justify-start' : 'justify-end'}
        `}>
          <Clock className="w-3 h-3 mr-1" />
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
};