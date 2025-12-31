import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SKILLS } from '../constants';
import type { User } from '../types';
import SkillTag from '../components/SkillTag';
import Button from '../components/Button';
import { useApp } from '../App';

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
        <div className="flex items-center">
            {[...Array(fullStars)].map((_, i) => <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
            {/* Not implementing half/empty stars for this mock, but possible */}
            <span className="text-xs text-gray-500 ml-1">{rating.toFixed(1)}</span>
        </div>
    );
};

const ProfileCard: React.FC<{ user: User }> = ({ user }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl">
        <div className="p-6">
            <div className="flex items-center space-x-4">
                <img className="h-16 w-16 rounded-full" src={user.avatar} alt={user.name} />
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                    <StarRating rating={user.rating} />
                </div>
            </div>
            <p className="mt-4 text-sm text-gray-600 h-10 overflow-hidden">{user.bio || 'No bio yet.'}</p>
            <div className="mt-4">
                <h4 className="font-medium text-sm text-gray-500">Teaches:</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                    {user.skillsToTeach.slice(0, 3).map(skill => <SkillTag key={skill.id} skill={skill} />)}
                </div>
            </div>
             <div className="mt-4">
                <h4 className="font-medium text-sm text-gray-500">Learns:</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                    {user.skillsToLearn.slice(0, 3).map(skill => <SkillTag key={skill.id} skill={skill} />)}
                </div>
            </div>
            <div className="mt-6 text-center">
                <Link to={`/profile/${user.id}`}>
                    <Button variant="primary" className="w-full">View Profile</Button>
                </Link>
            </div>
        </div>
    </div>
);

const SkillListPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSkill, setSelectedSkill] = useState('');
    const { users } = useApp();

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const nameMatch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
            const skillMatch = selectedSkill === '' || user.skillsToTeach.some(s => s.id === selectedSkill);
            return nameMatch && skillMatch;
        });
    }, [searchTerm, selectedSkill, users]);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900">Explore Skills</h1>
                <p className="mt-2 text-lg text-gray-600">Find talented individuals to swap skills with.</p>
            </header>

            <div className="mb-8 p-4 bg-white rounded-lg shadow-sm sticky top-16 z-40 flex flex-col sm:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search by name..."
                    className="flex-grow w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white"
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                >
                    <option value="">All Skills</option>
                    {SKILLS.map(skill => (
                        <option key={skill.id} value={skill.id}>{skill.name}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 stagger-children">
                {filteredUsers.map(user => (
                    <ProfileCard key={user.id} user={user} />
                ))}
            </div>
        </div>
    );
};

export default SkillListPage;
