import React from 'react';
import { useApp } from '../App';
import { MOCK_CONVERSATIONS } from '../constants';
import SkillTag from '../components/SkillTag';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
    const { currentUser, sessions } = useApp();

    if (!currentUser) {
        return <div className="text-center p-8">Loading...</div>;
    }

    const userSessions = sessions.filter(
        s => s.user1.id === currentUser.id || s.user2.id === currentUser.id
    );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Welcome back, {currentUser.name}!</h1>
                <p className="text-lg text-gray-600">Here's a snapshot of your SkillSwap activity.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 stagger-children">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Skills Section */}
                    <div className="bg-white p-6 rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl">
                        <h2 className="text-xl font-semibold mb-4">Your Skills</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-medium text-gray-700 mb-2">Skills You Can Teach</h3>
                                <div className="flex flex-wrap gap-2">
                                    {currentUser.skillsToTeach.map(skill => <SkillTag key={skill.id} skill={skill} />)}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-700 mb-2">Skills You Want to Learn</h3>
                                <div className="flex flex-wrap gap-2">
                                    {currentUser.skillsToLearn.map(skill => <SkillTag key={skill.id} skill={skill} />)}
                                </div>
                            </div>
                        </div>
                         <div className="mt-4 text-right">
                             <Link to="/profile/edit">
                                <Button variant="outline" size="sm">Manage Skills</Button>
                             </Link>
                         </div>
                    </div>

                    {/* Current Swaps Section */}
                    <div className="bg-white p-6 rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl">
                        <h2 className="text-xl font-semibold mb-4">Current Swap Sessions</h2>
                        <div className="space-y-4">
                            {userSessions.length > 0 ? userSessions.map(session => (
                                <div key={session.id} className="p-4 border rounded-md flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">
                                            Swap with {session.user1.id === currentUser.id ? session.user2.name : session.user1.name}
                                        </p>
                                        <p className="text-sm text-gray-500">{session.date} at {session.time}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        session.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                                        session.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                        session.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {session.status}
                                    </span>
                                </div>
                            )) : <p className="text-gray-500">No active swap sessions.</p>}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl">
                         <h2 className="text-xl font-semibold mb-4">Recent Messages</h2>
                         <div className="space-y-4">
                            {MOCK_CONVERSATIONS.slice(0, 3).map(convo => (
                                <Link to="/chat" key={convo.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md">
                                    <img src={convo.participant.avatar} alt={convo.participant.name} className="h-10 w-10 rounded-full" />
                                    <div>
                                        <p className="font-semibold">{convo.participant.name}</p>
                                        <p className="text-sm text-gray-500 truncate max-w-[150px]">{convo.lastMessage}</p>
                                    </div>
                                    {convo.unreadCount > 0 && <span className="ml-auto bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{convo.unreadCount}</span>}
                                </Link>
                            ))}
                         </div>
                    </div>
                     <div className="bg-primary text-white p-6 rounded-lg shadow-lg text-center transform transition-transform duration-300 hover:scale-105">
                        <h2 className="text-xl font-semibold mb-2">Find a New Skill!</h2>
                        <p className="mb-4">Explore thousands of skills and connect with mentors from around the world.</p>
                        <Link to="/skills">
                            <Button variant="secondary">Explore Skills</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
