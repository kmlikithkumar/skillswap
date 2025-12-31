export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface Review {
    id: string;
    author: string;
    authorAvatar: string;
    rating: number;
    comment: string;
    date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  interests: string[];
  timezone: string;
  skillsToTeach: Skill[];
  skillsToLearn: Skill[];
  rating: number;
  reviews: Review[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  seen: boolean;
}

export interface Conversation {
    id: string;
    participant: User;
    messages: ChatMessage[];
    lastMessage: string;
    unreadCount: number;
}

export interface SwapSession {
  id: string;
  user1: User;
  user2: User;
  skill1: Skill;
  skill2: Skill;
  date: string;
  time: string;
  status: 'Pending' | 'Accepted' | 'Completed' | 'Declined';
}

export interface Notification {
  id: string;
  type: 'message' | 'request' | 'status_update';
  content: string;
  timestamp: string;
  read: boolean;
}
