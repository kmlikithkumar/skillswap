import React, { useState } from 'react';
import type { User } from '../types';
import Button from './Button';

interface SwapRequestModalProps {
  currentUser: User;
  targetUser: User;
  onClose: () => void;
  onSubmit: (offerSkillId: string, requestSkillId: string) => void;
}

const SwapRequestModal: React.FC<SwapRequestModalProps> = ({ currentUser, targetUser, onClose, onSubmit }) => {
  const [offerSkill, setOfferSkill] = useState<string>('');
  const [requestSkill, setRequestSkill] = useState<string>('');

  const handleSubmit = () => {
    if (offerSkill && requestSkill) {
      onSubmit(offerSkill, requestSkill);
    } else {
      alert('Please select a skill to offer and a skill to request.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Request a Skill Swap with {targetUser.name}</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="offerSkill" className="block text-sm font-medium text-gray-700">
              Your skill to offer:
            </label>
            <select
              id="offerSkill"
              value={offerSkill}
              onChange={(e) => setOfferSkill(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            >
              <option value="" disabled>Select a skill you teach</option>
              {currentUser.skillsToTeach.map(skill => (
                <option key={skill.id} value={skill.id}>{skill.name}</option>
              ))}
            </select>
             {currentUser.skillsToTeach.length === 0 && <p className="text-xs text-red-500 mt-1">You have no skills to teach. Please add some in your profile.</p>}
          </div>

          <div>
            <label htmlFor="requestSkill" className="block text-sm font-medium text-gray-700">
              Skill you want to learn:
            </label>
            <select
              id="requestSkill"
              value={requestSkill}
              onChange={(e) => setRequestSkill(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            >
              <option value="" disabled>Select a skill from {targetUser.name}</option>
              {targetUser.skillsToTeach.map(skill => (
                <option key={skill.id} value={skill.id}>{skill.name}</option>
              ))}
            </select>
             {targetUser.skillsToTeach.length === 0 && <p className="text-xs text-gray-500 mt-1">{targetUser.name} has not listed any skills to teach yet.</p>}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={currentUser.skillsToTeach.length === 0 || targetUser.skillsToTeach.length === 0}>Send Request</Button>
        </div>
      </div>
    </div>
  );
};

export default SwapRequestModal;
