import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import Button from '../components/Button';
import { SKILLS } from '../constants';
import type { User } from '../types';

const EditProfilePage: React.FC = () => {
    const { currentUser, updateUser } = useApp();
    const navigate = useNavigate();
    
    const [name, setName] = useState(currentUser?.name || '');
    const [bio, setBio] = useState(currentUser?.bio || '');
    const [interests, setInterests] = useState(currentUser?.interests.join(', ') || '');
    const [timezone, setTimezone] = useState(currentUser?.timezone || '');
    const [skillsToTeach, setSkillsToTeach] = useState<string[]>(currentUser?.skillsToTeach.map(s => s.id) || []);
    const [skillsToLearn, setSkillsToLearn] = useState<string[]>(currentUser?.skillsToLearn.map(s => s.id) || []);
    const [avatar, setAvatar] = useState(currentUser?.avatar || '');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        } else {
            setName(currentUser.name);
            setBio(currentUser.bio);
            setInterests(currentUser.interests.join(', '));
            setTimezone(currentUser.timezone);
            setSkillsToTeach(currentUser.skillsToTeach.map(s => s.id));
            setSkillsToLearn(currentUser.skillsToLearn.map(s => s.id));
            setAvatar(currentUser.avatar);
        }
    }, [currentUser, navigate]);

    if (!currentUser) {
        return null; // or a loading spinner
    }

    const handleTeachSkillChange = (skillId: string) => {
        setSkillsToTeach(prev => 
            prev.includes(skillId) ? prev.filter(id => id !== skillId) : [...prev, skillId]
        );
    };

    const handleLearnSkillChange = (skillId: string) => {
        setSkillsToLearn(prev => 
            prev.includes(skillId) ? prev.filter(id => id !== skillId) : [...prev, skillId]
        );
    };
    
    const openFileDialog = () => fileInputRef.current?.click();

    const handleAvatarChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) { // 10MB
            alert('File is too large. Please select an image under 10MB.');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            setAvatar(result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const updatedUser: User = {
            ...currentUser,
            avatar,
            name,
            bio,
            interests: interests.split(',').map(i => i.trim()).filter(Boolean),
            timezone,
            skillsToTeach: SKILLS.filter(s => skillsToTeach.includes(s.id)),
            skillsToLearn: SKILLS.filter(s => skillsToLearn.includes(s.id)),
        };
        
        updateUser(updatedUser);
        console.log('Profile updated:', updatedUser);
        
        navigate(`/profile/${currentUser.id}`);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Profile</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center space-x-4">
                        <img src={avatar} alt="profile" className="h-24 w-24 rounded-full object-cover" />
                        <div>
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                            <Button type="button" variant="outline" onClick={openFileDialog}>Change Picture</Button>
                            <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 10MB.</p>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white text-gray-900" />
                    </div>

                    {/* Bio */}
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">About Me</label>
                        <textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white text-gray-900"></textarea>
                    </div>

                    {/* Interests */}
                    <div>
                        <label htmlFor="interests" className="block text-sm font-medium text-gray-700">Interests (comma separated)</label>
                        <input type="text" id="interests" value={interests} onChange={e => setInterests(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white text-gray-900" />
                    </div>

                     {/* Timezone */}
                    <div>
                        <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">Timezone</label>
                         <select id="timezone" value={timezone} onChange={e => setTimezone(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                            <option>GMT-8 (PST)</option>
                            <option>GMT-6 (CST)</option>
                            <option>GMT-5 (EST)</option>
                            <option>GMT-4 (EDT)</option>
                            <option>GMT+0 (UTC)</option>
                            <option>GMT+1 (CET)</option>
                            <option>GMT+2 (CEST)</option>
                            <option>GMT+8 (SGT)</option>
                         </select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Skills to Teach */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Skills I Can Teach</h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                                {SKILLS.map(skill => (
                                    <label key={`teach-${skill.id}`} className="flex items-center">
                                        <input type="checkbox" checked={skillsToTeach.includes(skill.id)} onChange={() => handleTeachSkillChange(skill.id)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                                        <span className="ml-2 text-sm text-gray-700">{skill.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Skills to Learn */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Skills I Want to Learn</h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                                {SKILLS.map(skill => (
                                    <label key={`learn-${skill.id}`} className="flex items-center">
                                        <input type="checkbox" checked={skillsToLearn.includes(skill.id)} onChange={() => handleLearnSkillChange(skill.id)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                                        <span className="ml-2 text-sm text-gray-700">{skill.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>


                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 pt-4 mt-6 border-t">
                        <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                        <Button type="submit" variant="primary">Save Changes</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfilePage;