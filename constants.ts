import type { User, Skill, SwapSession, Conversation, Notification, Review } from './types';

export const SKILLS: Skill[] = [
  { id: '1', name: 'React.js', category: 'Web Development' },
  { id: '2', name: 'Node.js', category: 'Web Development' },
  { id: '3', name: 'Graphic Design', category: 'Design' },
  { id: '4', name: 'UI/UX Design', category: 'Design' },
  { id: '5', name: 'Digital Marketing', category: 'Marketing' },
  { id: '6', name: 'Project Management', category: 'Business' },
  { id: '7', name: 'Creative Writing', category: 'Writing' },
  { id: '8', name: 'Public Speaking', category: 'Communication' },
  { id: '9', name: 'Data Analysis', category: 'Data Science' },
  { id: '10', name: 'Python', category: 'Programming' },
];

export const MOCK_REVIEWS: Review[] = [
    { id: 'r1', author: 'Bob Johnson', authorAvatar: 'https://picsum.photos/seed/bob/100/100', rating: 5, comment: 'Alice is a fantastic teacher! Very patient and knowledgeable.', date: '2023-10-15' },
    { id: 'r2', author: 'Charlie Brown', authorAvatar: 'https://picsum.photos/seed/charlie/100/100', rating: 4, comment: 'Learned a lot about React hooks. Would recommend.', date: '2023-09-22' },
];

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Alice Wonder',
    email: 'alice@example.com',
    avatar: 'https://picsum.photos/seed/alice/200/200',
    bio: 'Frontend developer passionate about creating beautiful and intuitive user interfaces. I love teaching React and learning about design.',
    interests: ['Hiking', 'Photography', 'Coffee'],
    timezone: 'GMT-5 (EST)',
    skillsToTeach: [SKILLS[0], SKILLS[3]],
    skillsToLearn: [SKILLS[2], SKILLS[4]],
    rating: 4.8,
    reviews: MOCK_REVIEWS,
  },
  {
    id: 'u2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    avatar: 'https://picsum.photos/seed/bob/200/200',
    bio: 'Graphic designer with a knack for branding and illustration. Looking to pick up some web development skills to bring my designs to life.',
    interests: ['Art', 'Music', 'Cooking'],
    timezone: 'GMT+1 (CET)',
    skillsToTeach: [SKILLS[2]],
    skillsToLearn: [SKILLS[1]],
    rating: 4.5,
    reviews: [],
  },
  {
    id: 'u3',
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    avatar: 'https://picsum.photos/seed/charlie/200/200',
    bio: 'Marketing guru who loves data-driven strategies. I can help you grow your audience, and I want to learn more about content creation.',
    interests: ['Reading', 'Traveling', 'Podcasts'],
    timezone: 'GMT-8 (PST)',
    skillsToTeach: [SKILLS[4], SKILLS[5]],
    skillsToLearn: [SKILLS[6]],
    rating: 4.9,
    reviews: [],
  },
  {
    id: 'u4',
    name: 'Diana Prince',
    email: 'diana@example.com',
    avatar: 'https://picsum.photos/seed/diana/200/200',
    bio: 'Backend engineer specializing in Node.js and databases. Interested in learning UI/UX to better understand the full product lifecycle.',
    interests: ['History', 'Museums', 'Archery'],
    timezone: 'GMT+0 (UTC)',
    skillsToTeach: [SKILLS[1], SKILLS[9]],
    skillsToLearn: [SKILLS[3]],
    rating: 4.7,
    reviews: [],
  },
  {
    id: 'u5',
    name: 'Eva Martinez',
    email: 'eva@example.com',
    avatar: 'https://picsum.photos/seed/eva/200/200',
    bio: 'Full-stack developer with a love for Python and data visualization. Eager to swap my coding skills for public speaking tips.',
    interests: ['Data Science', 'Cooking', 'Yoga'],
    timezone: 'GMT+2 (CEST)',
    skillsToTeach: [SKILLS[9], SKILLS[8]],
    skillsToLearn: [SKILLS[7]],
    rating: 4.9,
    reviews: [],
  },
  {
    id: 'u6',
    name: 'Frank Miller',
    email: 'frank@example.com',
    avatar: 'https://picsum.photos/seed/frank/200/200',
    bio: 'Experienced project manager who excels at agile methodologies. Looking to learn the basics of UI/UX to better collaborate with design teams.',
    interests: ['Chess', 'History', 'Running'],
    timezone: 'GMT-6 (CST)',
    skillsToTeach: [SKILLS[5]],
    skillsToLearn: [SKILLS[3]],
    rating: 4.6,
    reviews: [],
  },
  {
    id: 'u7',
    name: 'Grace Lee',
    email: 'grace@example.com',
    avatar: 'https://picsum.photos/seed/grace/200/200',
    bio: 'Professional writer and editor. I can help you craft compelling content. I\'m interested in learning digital marketing to promote my work.',
    interests: ['Literature', 'Gardening', 'Film'],
    timezone: 'GMT+8 (SGT)',
    skillsToTeach: [SKILLS[6]],
    skillsToLearn: [SKILLS[4]],
    rating: 5.0,
    reviews: [],
  },
  {
    id: 'u8',
    name: 'Henry Wilson',
    email: 'henry@example.com',
    avatar: 'https://picsum.photos/seed/henry/200/200',
    bio: 'A communication expert specializing in public speaking and presentations. I want to learn data analysis to back my talks with solid numbers.',
    interests: ['Theater', 'Sailing', 'Jazz Music'],
    timezone: 'GMT-4 (EDT)',
    skillsToTeach: [SKILLS[7]],
    skillsToLearn: [SKILLS[8]],
    rating: 4.8,
    reviews: [],
  }
];

export const MOCK_SESSIONS: SwapSession[] = [
    { id: 's1', user1: MOCK_USERS[0], user2: MOCK_USERS[1], skill1: SKILLS[0], skill2: SKILLS[2], date: '2024-08-15', time: '14:00', status: 'Accepted' },
    { id: 's2', user1: MOCK_USERS[0], user2: MOCK_USERS[2], skill1: SKILLS[3], skill2: SKILLS[4], date: '2024-08-20', time: '10:00', status: 'Pending' },
    { id: 's3', user1: MOCK_USERS[3], user2: MOCK_USERS[0], skill1: SKILLS[1], skill2: SKILLS[3], date: '2024-07-30', time: '18:00', status: 'Completed' },
    { id: 's4', user1: MOCK_USERS[4], user2: MOCK_USERS[7], skill1: SKILLS[9], skill2: SKILLS[7], date: '2024-08-18', time: '11:00', status: 'Accepted' },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: 'c1',
        participant: MOCK_USERS[1],
        lastMessage: 'Sure, I can help with that!',
        unreadCount: 2,
        messages: [
            { id: 'm1', senderId: 'u1', receiverId: 'u2', content: 'Hey Bob, I saw you teach Graphic Design. I\'d love to learn!', timestamp: '10:30 AM', seen: true },
            { id: 'm2', senderId: 'u2', receiverId: 'u1', content: 'Hey Alice! Absolutely. I was hoping to learn some React.', timestamp: '10:31 AM', seen: true },
            { id: 'm3', senderId: 'u1', receiverId: 'u2', content: 'Perfect! When are you free to chat about it?', timestamp: '10:32 AM', seen: false },
            { id: 'm4', senderId: 'u2', receiverId: 'u1', content: 'How about this afternoon?', timestamp: '10:35 AM', seen: false },
        ]
    },
    {
        id: 'c2',
        participant: MOCK_USERS[2],
        lastMessage: 'Let\'s connect next week.',
        unreadCount: 0,
        messages: [
            { id: 'm5', senderId: 'u1', receiverId: 'u3', content: 'Hi Charlie, your marketing skills are impressive!', timestamp: 'Yesterday', seen: true },
            { id: 'm6', senderId: 'u3', receiverId: 'u1', content: 'Thanks Alice! I saw you do UI/UX. Let\'s connect next week.', timestamp: 'Yesterday', seen: true },
        ]
    },
    {
        id: 'c3',
        participant: MOCK_USERS[4],
        lastMessage: 'Yeah, I can teach you some Python.',
        unreadCount: 1,
        messages: [
            { id: 'm7', senderId: 'u1', receiverId: 'u5', content: 'Hey Eva, I\'m interested in Python.', timestamp: 'Yesterday', seen: false },
        ]
    },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'n1', type: 'message', content: 'You have a new message from Bob Smith.', timestamp: '2 hours ago', read: false },
    { id: 'n2', type: 'request', content: 'Charlie Davis sent you a skill swap request.', timestamp: '1 day ago', read: false },
    { id: 'n3', type: 'status_update', content: 'Your swap with Diana Prince has been completed.', timestamp: '3 days ago', read: true },
];