import React, { useState, useEffect } from 'react';
import { Activity, Clock, Zap, CheckCircle } from 'lucide-react';

interface PerformanceMetricsProps {
  responseTime: number;
  accuracy: number;
  conversationCount: number;
  isActive: boolean;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  responseTime,
  accuracy,
  conversationCount,
  isActive
}) => {
  const [avgResponseTime, setAvgResponseTime] = useState(0);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);

  useEffect(() => {
    if (responseTime > 0) {
      const newTimes = [...responseTimes, responseTime].slice(-10); // Keep last 10
      setResponseTimes(newTimes);
      setAvgResponseTime(newTimes.reduce((a, b) => a + b, 0) / newTimes.length);
    }
  }, [responseTime]);

  const getLatencyColor = (time: number) => {
    if (time < 1000) return 'text-green-600';
    if (time < 2000) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLatencyLabel = (time: number) => {
    if (time < 1000) return 'Excellent';
    if (time < 2000) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
        <Activity className="w-5 h-5 mr-2 text-green-500" />
        Performance Metrics
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Response Time */}
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Clock className={`w-6 h-6 mx-auto mb-2 ${getLatencyColor(avgResponseTime)}`} />
          <div className="text-2xl font-bold text-gray-800">
            {avgResponseTime > 0 ? `${Math.round(avgResponseTime)}ms` : '--'}
          </div>
          <div className={`text-xs ${getLatencyColor(avgResponseTime)}`}>
            {avgResponseTime > 0 ? getLatencyLabel(avgResponseTime) : 'Waiting...'}
          </div>
          <div className="text-xs text-gray-500 mt-1">Avg Response Time</div>
        </div>

        {/* Accuracy */}
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <CheckCircle className="w-6 h-6 mx-auto mb-2 text-blue-500" />
          <div className="text-2xl font-bold text-gray-800">
            {Math.round(accuracy)}%
          </div>
          <div className="text-xs text-blue-600">
            {accuracy >= 90 ? 'Excellent' : accuracy >= 80 ? 'Good' : 'Fair'}
          </div>
          <div className="text-xs text-gray-500 mt-1">Accuracy Score</div>
        </div>

        {/* Conversation Count */}
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Zap className="w-6 h-6 mx-auto mb-2 text-purple-500" />
          <div className="text-2xl font-bold text-gray-800">{conversationCount}</div>
          <div className="text-xs text-purple-600">Active</div>
          <div className="text-xs text-gray-500 mt-1">Conversations</div>
        </div>

        {/* Status */}
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className={`w-6 h-6 mx-auto mb-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
          <div className="text-2xl font-bold text-gray-800">
            {isActive ? 'LIVE' : 'IDLE'}
          </div>
          <div className={`text-xs ${isActive ? 'text-green-600' : 'text-gray-600'}`}>
            {isActive ? 'Ready' : 'Standby'}
          </div>
          <div className="text-xs text-gray-500 mt-1">Bot Status</div>
        </div>
      </div>

      {/* Response Time Chart */}
      {responseTimes.length > 0 && (
        <div className="mt-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Response Time Trend</div>
          <div className="flex items-end space-x-1 h-16">
            {responseTimes.slice(-10).map((time, index) => (
              <div
                key={index}
                className={`flex-1 rounded-t ${getLatencyColor(time).includes('green') ? 'bg-green-200' : 
                  getLatencyColor(time).includes('yellow') ? 'bg-yellow-200' : 'bg-red-200'}`}
                style={{ height: `${Math.min((time / 3000) * 100, 100)}%` }}
                title={`${time}ms`}
              />
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-1">Last 10 responses</div>
        </div>
      )}
    </div>
  );
};