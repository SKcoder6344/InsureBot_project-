import React from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface VoiceVisualizerProps {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  onToggleListening: () => void;
  onStopSpeaking: () => void;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  isListening,
  isSpeaking,
  isProcessing,
  onToggleListening,
  onStopSpeaking,
}) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Main Voice Button */}
      <div className="relative">
        <button
          onClick={onToggleListening}
          disabled={isProcessing || isSpeaking}
          className={`
            w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl
            transition-all duration-300 transform hover:scale-105 disabled:opacity-50
            ${isListening 
              ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' 
              : 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30'
            }
          `}
        >
          {isListening ? <Mic /> : <MicOff />}
        </button>
        
        {/* Listening Animation */}
        {isListening && (
          <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping" />
        )}
      </div>

      {/* Status Indicator */}
      <div className="text-center">
        {isListening && (
          <div className="flex items-center space-x-2 text-red-600">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Listening...</span>
          </div>
        )}
        
        {isProcessing && (
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
            <span className="text-sm font-medium">Processing...</span>
          </div>
        )}
        
        {isSpeaking && (
          <div className="flex items-center space-x-2 text-green-600">
            <Volume2 className="w-4 h-4" />
            <span className="text-sm font-medium">Speaking...</span>
            <button
              onClick={onStopSpeaking}
              className="ml-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              <VolumeX className="w-3 h-3" />
            </button>
          </div>
        )}
        
        {!isListening && !isProcessing && !isSpeaking && (
          <span className="text-sm text-gray-500">Click to start conversation</span>
        )}
      </div>

      {/* Voice Wave Animation */}
      {(isListening || isSpeaking) && (
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`
                w-1 bg-gradient-to-t from-blue-400 to-blue-600 rounded-full
                ${isListening ? 'animate-pulse' : 'animate-bounce'}
              `}
              style={{
                height: `${Math.random() * 20 + 10}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: isListening ? '1s' : '0.6s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};