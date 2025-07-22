import React, { useState, useRef } from 'react';
import { Upload, FileAudio, Brain, BarChart3, Trash2, Search } from 'lucide-react';
import { TrainingService } from '../services/trainingService';
import { CallRecording, TrainingMetrics, ExtractedKnowledge } from '../types';

interface TrainingPanelProps {
  trainingService: TrainingService;
  onKnowledgeUpdate: () => void;
}

export const TrainingPanel: React.FC<TrainingPanelProps> = ({ 
  trainingService, 
  onKnowledgeUpdate 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const [metrics, setMetrics] = useState<TrainingMetrics | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ExtractedKnowledge[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    updateData();
  }, []);

  const updateData = () => {
    setRecordings(trainingService.getAllRecordings());
    setMetrics(trainingService.getTrainingMetrics());
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    
    try {
      for (const file of Array.from(files)) {
        if (file.type.startsWith('audio/') || file.name.endsWith('.mp3') || file.name.endsWith('.wav')) {
          await trainingService.processAudioFile(file);
        }
      }
      
      updateData();
      onKnowledgeUpdate();
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error processing files:', error);
      alert('Error processing audio files. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = trainingService.searchKnowledge(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all training data? This cannot be undone.')) {
      trainingService.clearTrainingData();
      updateData();
      setSearchResults([]);
      onKnowledgeUpdate();
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Brain className="w-6 h-6 mr-2 text-purple-600" />
          Training Center
        </h2>
        <button
          onClick={handleClearData}
          className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span className="text-sm">Clear Data</span>
        </button>
      </div>

      {/* Upload Section */}
      <div className="mb-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="audio/*,.mp3,.wav"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <FileAudio className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          
          {isProcessing ? (
            <div className="space-y-2">
              <div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full mx-auto" />
              <p className="text-gray-600">Processing audio files...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-600">Upload call recordings to train the bot</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Choose Audio Files</span>
              </button>
              <p className="text-xs text-gray-500">Supports MP3, WAV and other audio formats</p>
            </div>
          )}
        </div>
      </div>

      {/* Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{metrics.totalRecordings}</div>
            <div className="text-xs text-gray-600">Total Recordings</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{metrics.processedRecordings}</div>
            <div className="text-xs text-gray-600">Processed</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{metrics.extractedResponses}</div>
            <div className="text-xs text-gray-600">Knowledge Items</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {metrics.averageCallDuration > 0 ? formatDuration(metrics.averageCallDuration) : '--'}
            </div>
            <div className="text-xs text-gray-600">Avg Duration</div>
          </div>
          <div className="bg-indigo-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-indigo-600">{metrics.knowledgeBaseSize}</div>
            <div className="text-xs text-gray-600">KB Size</div>
          </div>
        </div>
      )}

      {/* Knowledge Search */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search extracted knowledge..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
        
        {searchResults.length > 0 && (
          <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
            {searchResults.slice(0, 5).map((knowledge, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    {knowledge.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {Math.round(knowledge.confidence)}% confidence
                  </span>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-800 mb-1">Q: {knowledge.query}</div>
                  <div className="text-gray-600">A: {knowledge.response.substring(0, 150)}...</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Recordings */}
      {recordings.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
            Recent Recordings
          </h3>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {recordings.slice(-5).reverse().map((recording) => (
              <div key={recording.id} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{recording.filename}</div>
                    <div className="text-sm text-gray-600">
                      Duration: {formatDuration(recording.duration)} • 
                      Knowledge: {recording.extractedKnowledge.length} items
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {recording.uploadDate.toLocaleDateString()} {recording.uploadDate.toLocaleTimeString()}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    recording.processed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {recording.processed ? 'Processed' : 'Processing'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {recordings.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FileAudio className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No call recordings uploaded yet</p>
          <p className="text-sm">Upload audio files to start training the bot</p>
        </div>
      )}
    </div>
  );
};