import React, { useState } from 'react';
import Button from '../components/Button';
import { useApp } from '../App';
import type { SwapSession, User } from '../types';
import { Link } from 'react-router-dom';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalendarProps {
  sessions: SwapSession[];
  currentUser: User;
}

const Calendar: React.FC<CalendarProps> = ({ sessions, currentUser }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startOfMonth.getDay());

  const days = [];
  let day = startDate;
  while (day <= endOfMonth || day.getDay() !== 0) {
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
    if(days.length > 42) break; // prevent infinite loops, allow 6 weeks
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={prevMonth} variant="ghost">&lt;</Button>
        <h2 className="text-xl font-semibold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <Button onClick={nextMonth} variant="ghost">&gt;</Button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-500">
        {daysOfWeek.map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-2 mt-2">
        {days.map((d, index) => {
          const isCurrentMonth = d.getMonth() === currentDate.getMonth();
          const isToday = d.toDateString() === new Date().toDateString();
          
          const sessionsForDay = sessions.filter(session => {
            if (session.date === 'Pending' || session.time === 'TBD') return false;
            const [year, month, day] = session.date.split('-').map(Number);
            const sessionDate = new Date(year, month - 1, day);
            return sessionDate.toDateString() === d.toDateString();
          });

          return (
            <div key={index} className={`p-1 h-28 rounded-md border flex flex-col ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}`}>
              <span className={`self-end text-sm ${isToday ? 'bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center' : 'w-6 text-center'}`}>
                {d.getDate()}
              </span>
              <div className="mt-1 space-y-1 overflow-y-auto text-xs flex-grow">
                {sessionsForDay.map(session => {
                    const partner = session.user1.id === currentUser.id ? session.user2 : session.user1;
                    const statusColors = {
                        'Accepted': 'bg-green-100 text-green-800 border-green-200',
                        'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
                        'Completed': 'bg-blue-100 text-blue-800 border-blue-200',
                        'Declined': 'bg-red-100 text-red-800 border-red-200',
                    };
                    return (
                        <div key={session.id} className={`p-1 rounded border ${statusColors[session.status]}`} title={`Swap with ${partner.name} at ${session.time}`}>
                            <p className="font-semibold truncate">w/ {partner.name}</p>
                            <p className="truncate">{session.time}</p>
                        </div>
                    );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


const SchedulerPage: React.FC = () => {
  const { currentUser, sessions } = useApp();

  if (!currentUser) {
    return <div className="text-center p-8">Loading...</div>;
  }

  const userSessions = sessions.filter(
    s => s.user1.id === currentUser.id || s.user2.id === currentUser.id
  );

  const upcomingSessions = userSessions.filter(s => s.status === 'Accepted');

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Skill Swap Scheduler</h1>
        <p className="text-lg text-gray-600">Manage your learning sessions and book new ones.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Calendar sessions={userSessions} currentUser={currentUser} />
        </div>
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {upcomingSessions.length > 0 ? upcomingSessions.map(session => {
                      const partner = session.user1.id === currentUser.id ? session.user2 : session.user1;
                      const skillTeaches = session.user1.id === currentUser.id ? session.skill1 : session.skill2;
                      const skillLearns = session.user1.id === currentUser.id ? session.skill2 : session.skill1;

                      return (
                        <div key={session.id} className="p-4 border rounded-md">
                            <p className="font-semibold">Swap with {partner.name}</p>
                            <p className="text-sm text-gray-600">Teaching: <span className="font-medium text-primary">{skillTeaches.name}</span></p>
                            <p className="text-sm text-gray-600">Learning: <span className="font-medium text-secondary">{skillLearns.name}</span></p>
                            <p className="text-sm text-gray-500 mt-2">{session.date} at {session.time}</p>
                        </div>
                      )
                    }) : <p className="text-gray-500">No upcoming sessions.</p>}
                </div>
            </div>
             <div className="bg-white p-6 rounded-lg shadow">
                 <h2 className="text-xl font-semibold mb-2">Book a New Session</h2>
                 <p className="text-sm text-gray-600 mb-4">Select a date on the calendar and find an available partner to schedule a new swap.</p>
                 <Link to="/skills" className="w-full">
                    <Button variant="primary" className="w-full">Find a Partner</Button>
                 </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulerPage;
