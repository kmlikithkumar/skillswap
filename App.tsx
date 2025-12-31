import React, { useState, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import type { User, SwapSession } from './types';
import { MOCK_USERS, MOCK_SESSIONS } from './constants';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import SkillListPage from './pages/SkillListPage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';
import SchedulerPage from './pages/SchedulerPage';
import EditProfilePage from './pages/EditProfilePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

interface AppContextType {
  isLoggedIn: boolean;
  currentUser: User | null;
  users: User[];
  sessions: SwapSession[];
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  addUser: (user: User) => void;
  addSession: (session: SwapSession) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
};

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [sessions, setSessions] = useState<SwapSession[]>(MOCK_SESSIONS);

    const login = (user: User) => {
        setIsLoggedIn(true);
        setCurrentUser(user);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setCurrentUser(null);
    };

    const updateUser = (updatedUser: User) => {
        setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
        if (currentUser?.id === updatedUser.id) {
            setCurrentUser(updatedUser);
        }
    };
    
    const addUser = (newUser: User) => {
        setUsers(prevUsers => {
            if (prevUsers.some(u => u.id === newUser.id)) {
                return prevUsers;
            }
            return [...prevUsers, newUser];
        });
    };

    const addSession = (newSession: SwapSession) => {
        setSessions(prev => [...prev, newSession]);
    };

    return (
        <AppContext.Provider value={{ isLoggedIn, currentUser, users, sessions, login, logout, updateUser, addUser, addSession }}>
            {children}
        </AppContext.Provider>
    );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Main />
      </HashRouter>
    </AppProvider>
  );
};

const Main: React.FC = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="flex flex-col min-h-screen text-gray-800">
      {!isAuthPage && <Navbar />}
      <main className="flex-grow page-fade-in" key={location.pathname}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/skills" element={<ProtectedRoute><SkillListPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profile/:userId" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/schedule" element={<ProtectedRoute><SchedulerPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { isLoggedIn } = useApp();
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }
    return children;
};


export default App;
