import React from 'react';
import { User, Users, Briefcase, Calendar } from 'lucide-react';
import { UserProfile as UserProfileType } from '../types';

interface UserProfileProps {
  profile: UserProfileType;
  conversationContext: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ profile, conversationContext }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <User className="w-5 h-5 mr-2 text-blue-500" />
        User Profile
      </h3>
      
      <div className="space-y-2 text-sm">
        {profile.name && (
          <div className="flex items-center">
            <span className="font-medium text-gray-600 w-20">Name:</span>
            <span className="text-gray-800">{profile.name}</span>
          </div>
        )}
        
        {profile.age && (
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span className="font-medium text-gray-600 w-16">Age:</span>
            <span className="text-gray-800">{profile.age} years</span>
          </div>
        )}
        
        {profile.familySize && (
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-gray-400" />
            <span className="font-medium text-gray-600 w-16">Family:</span>
            <span className="text-gray-800">{profile.familySize} members</span>
          </div>
        )}
        
        {profile.occupation && (
          <div className="flex items-center">
            <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
            <span className="font-medium text-gray-600 w-16">Work:</span>
            <span className="text-gray-800">{profile.occupation}</span>
          </div>
        )}
        
        {profile.currentInsurance && profile.currentInsurance.length > 0 && (
          <div>
            <span className="font-medium text-gray-600">Current Insurance:</span>
            <div className="mt-1 space-y-1">
              {profile.currentInsurance.map((insurance, index) => (
                <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">
                  {insurance}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {conversationContext && (
        <div className="pt-3 border-t border-gray-200">
          <span className="text-xs font-medium text-gray-500">Context:</span>
          <p className="text-xs text-gray-600 mt-1">{conversationContext}</p>
        </div>
      )}
    </div>
  );
};