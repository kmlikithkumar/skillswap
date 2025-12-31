import React from 'react';

interface SkillTagProps {
  skill: { name: string; category: string };
  className?: string;
}

const SkillTag: React.FC<SkillTagProps> = ({ skill, className = '' }) => {
  const categoryColors: { [key: string]: string } = {
    'Web Development': 'bg-blue-100 text-blue-800',
    'Design': 'bg-purple-100 text-purple-800',
    'Marketing': 'bg-green-100 text-green-800',
    'Business': 'bg-yellow-100 text-yellow-800',
    'Writing': 'bg-pink-100 text-pink-800',
    'Communication': 'bg-indigo-100 text-indigo-800',
    'Data Science': 'bg-red-100 text-red-800',
    'Programming': 'bg-gray-200 text-gray-800'
  };

  const colorClass = categoryColors[skill.category] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${colorClass} ${className}`}>
      {skill.name}
    </span>
  );
};

export default SkillTag;
