import { useState, useEffect, useCallback } from 'react';

export type UserRole = 'student' | 'counselor' | 'parent' | 'admin' | 'teacher';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderRole: UserRole;
  senderName: string;
  text: string;
  time: string;
  timestamp: number;
  status?: 'sent' | 'delivered' | 'read';
}

export interface ChatParticipant {
  id: string;
  name: string;
  role: UserRole;
  image: string;
  online: boolean;
}

export interface ChatThread {
  id: string;
  participants: ChatParticipant[];
  lastMessage: string;
  lastMessageTime: string;
  lastMessageTimestamp: number;
  unreadCount: Record<string, number>; // userId -> count
  messages: ChatMessage[];
}

const STORAGE_KEY = 'app_cross_portal_threads_v1';
const EVENT_NAME = 'cross_portal_messaging_event';

// Seed initial contacts
export const DEMO_USERS = {
  student1: { id: 'student-1', name: 'Bolu Ahmed', role: 'student' as UserRole, image: 'https://picsum.photos/seed/s1/100/100', online: true },
  student2: { id: 'student-2', name: 'Oyindamola Olambiwooninu', role: 'student' as UserRole, image: 'https://picsum.photos/seed/s2/100/100', online: false },
  student3: { id: 'student-3', name: 'Favour Aina', role: 'student' as UserRole, image: 'https://picsum.photos/seed/s3/100/100', online: true },
  student4: { id: 'student-4', name: 'Adebayo Samuel', role: 'student' as UserRole, image: 'https://picsum.photos/seed/s4/100/100', online: false },

  counselor1: { id: 'counselor-1', name: 'Mr. Alfred Funmbi', role: 'counselor' as UserRole, image: 'https://picsum.photos/seed/c1/100/100', online: true },
  counselor2: { id: 'counselor-2', name: 'Mrs. Janet Okon', role: 'counselor' as UserRole, image: 'https://picsum.photos/seed/c2/100/100', online: false },

  admin1: { id: 'admin-1', name: 'Dr. Sarah Ojo', role: 'admin' as UserRole, image: 'https://picsum.photos/seed/admin1/100/100', online: true },
  admin2: { id: 'admin-2', name: 'System Administrator', role: 'admin' as UserRole, image: 'https://picsum.photos/seed/admin2/100/100', online: true },

  parent1: { id: 'parent-1', name: 'Mrs. Kemi Ahmed', role: 'parent' as UserRole, image: 'https://picsum.photos/seed/parent1/100/100', online: true },
  parent2: { id: 'parent-2', name: 'Mr. Tunde Ahmed', role: 'parent' as UserRole, image: 'https://picsum.photos/seed/parent2/100/100', online: false },

  teacher1: { id: 'teacher-1', name: 'Mr. Mason Biyi', role: 'teacher' as UserRole, image: 'https://picsum.photos/seed/teacher1/100/100', online: true },
  teacher2: { id: 'teacher-2', name: 'Mrs. Folake Davies', role: 'teacher' as UserRole, image: 'https://picsum.photos/seed/teacher2/100/100', online: false },
};

const INITIAL_THREADS: ChatThread[] = [
  {
    id: 'thread-student-1-counselor-1',
    participants: [DEMO_USERS.student1, DEMO_USERS.counselor1],
    lastMessage: 'I have some questions about the software engineering curriculum.',
    lastMessageTime: '10:30 AM',
    lastMessageTimestamp: Date.now() - 3600000,
    unreadCount: { 'counselor-1': 1, 'student-1': 0 },
    messages: [
      { id: 'm1', senderId: 'student-1', senderRole: 'student', senderName: 'Bolu Ahmed', text: 'Hello Mr. Alfred, I just wanted to ask about the next steps for my software engineering application.', time: '10:00 AM', timestamp: Date.now() - 7200000, status: 'read' },
      { id: 'm2', senderId: 'counselor-1', senderRole: 'counselor', senderName: 'Mr. Alfred Funmbi', text: 'Hi Bolu! Make sure you have your transcripts ready for our session today.', time: '10:15 AM', timestamp: Date.now() - 5400000, status: 'read' },
      { id: 'm3', senderId: 'student-1', senderRole: 'student', senderName: 'Bolu Ahmed', text: 'I have some questions about the software engineering curriculum.', time: '10:30 AM', timestamp: Date.now() - 3600000, status: 'delivered' }
    ]
  },
  {
    id: 'thread-student-1-admin-1',
    participants: [DEMO_USERS.student1, DEMO_USERS.admin1],
    lastMessage: 'The internship submission deadline is next Friday at 4:00 PM.',
    lastMessageTime: '11:25 AM',
    lastMessageTimestamp: Date.now() - 10000000,
    unreadCount: { 'student-1': 0, 'admin-1': 0 },
    messages: [
      { id: 'm10', senderId: 'admin-1', senderRole: 'admin', senderName: 'Dr. Sarah Ojo', text: 'Welcome Bolu! Your SSS3 profile and career assessment accounts have been verified.', time: '9:00 AM', timestamp: Date.now() - 20000000, status: 'read' },
      { id: 'm11', senderId: 'student-1', senderRole: 'student', senderName: 'Bolu Ahmed', text: 'Thank you Dr. Sarah! When is the deadline for submitting the internship form?', time: '11:10 AM', timestamp: Date.now() - 12000000, status: 'read' },
      { id: 'm12', senderId: 'admin-1', senderRole: 'admin', senderName: 'Dr. Sarah Ojo', text: 'The internship submission deadline is next Friday at 4:00 PM.', time: '11:25 AM', timestamp: Date.now() - 10000000, status: 'read' }
    ]
  },
  {
    id: 'thread-student-1-parent-1',
    participants: [DEMO_USERS.student1, DEMO_USERS.parent1],
    lastMessage: 'Hi Bolu, how did your meeting with Mr. Alfred go today?',
    lastMessageTime: '2:15 PM',
    lastMessageTimestamp: Date.now() - 18000000,
    unreadCount: { 'student-1': 1, 'parent-1': 0 },
    messages: [
      { id: 'm20', senderId: 'parent-1', senderRole: 'parent', senderName: 'Mrs. Kemi Ahmed', text: 'Hi Bolu, how did your meeting with Mr. Alfred go today?', time: '2:15 PM', timestamp: Date.now() - 18000000, status: 'delivered' }
    ]
  },
  {
    id: 'thread-student-1-teacher-1',
    participants: [DEMO_USERS.student1, DEMO_USERS.teacher1],
    lastMessage: 'Thank you Mr. Mason! I really enjoyed working on it.',
    lastMessageTime: 'Yesterday',
    lastMessageTimestamp: Date.now() - 86400000,
    unreadCount: { 'student-1': 0, 'teacher-1': 0 },
    messages: [
      { id: 'm30', senderId: 'teacher-1', senderRole: 'teacher', senderName: 'Mr. Mason Biyi', text: 'Great submission on your STEM robotics assignment Bolu! Keep up the good work.', time: '1:00 PM', timestamp: Date.now() - 90000000, status: 'read' },
      { id: 'm31', senderId: 'student-1', senderRole: 'student', senderName: 'Bolu Ahmed', text: 'Thank you Mr. Mason! I really enjoyed working on it.', time: '1:15 PM', timestamp: Date.now() - 86400000, status: 'read' }
    ]
  },
  {
    id: 'thread-student-2-counselor-1',
    participants: [DEMO_USERS.student2, DEMO_USERS.counselor1],
    lastMessage: 'When is our next meeting scheduled?',
    lastMessageTime: '1h ago',
    lastMessageTimestamp: Date.now() - 3600000,
    unreadCount: { 'counselor-1': 0, 'student-2': 0 },
    messages: [
      { id: 'm40', senderId: 'student-2', senderRole: 'student', senderName: 'Oyindamola Olambiwooninu', text: 'When is our next meeting scheduled?', time: '11:00 AM', timestamp: Date.now() - 3600000, status: 'read' }
    ]
  },
  {
    id: 'thread-student-3-counselor-1',
    participants: [DEMO_USERS.student3, DEMO_USERS.counselor1],
    lastMessage: 'Thank you for the session today, it was really helpful!',
    lastMessageTime: '3h ago',
    lastMessageTimestamp: Date.now() - 10800000,
    unreadCount: { 'counselor-1': 0, 'student-3': 0 },
    messages: [
      { id: 'm50', senderId: 'student-3', senderRole: 'student', senderName: 'Favour Aina', text: 'Thank you for the session today, it was really helpful!', time: '9:00 AM', timestamp: Date.now() - 10800000, status: 'read' }
    ]
  },
  {
    id: 'thread-student-4-counselor-1',
    participants: [DEMO_USERS.student4, DEMO_USERS.counselor1],
    lastMessage: 'I have updated my career interests to Data Science.',
    lastMessageTime: '5h ago',
    lastMessageTimestamp: Date.now() - 18000000,
    unreadCount: { 'counselor-1': 1, 'student-4': 0 },
    messages: [
      { id: 'm60', senderId: 'student-4', senderRole: 'student', senderName: 'Adebayo Samuel', text: 'I have updated my career interests to Data Science.', time: '8:30 AM', timestamp: Date.now() - 18000000, status: 'delivered' }
    ]
  }
];

export const getCrossPortalThreads = (): ChatThread[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_THREADS));
    return INITIAL_THREADS;
  }
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_THREADS;
  } catch (e) {
    return INITIAL_THREADS;
  }
};

export const saveCrossPortalThreads = (threads: ChatThread[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  
  // Dispatch custom real-time event for current window
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: threads }));
};

export const sendMessageToThread = (
  threadId: string, 
  sender: { id: string; role: UserRole; name: string }, 
  text: string
): ChatThread[] => {
  const threads = getCrossPortalThreads();
  const timeFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const timestamp = Date.now();

  const updatedThreads = threads.map(thread => {
    if (thread.id === threadId) {
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        senderId: sender.id,
        senderRole: sender.role,
        senderName: sender.name,
        text: text.trim(),
        time: timeFormatted,
        timestamp,
        status: 'delivered'
      };

      const newUnreadCount = { ...thread.unreadCount };
      thread.participants.forEach(p => {
        if (p.id !== sender.id) {
          newUnreadCount[p.id] = (newUnreadCount[p.id] || 0) + 1;
        }
      });

      return {
        ...thread,
        lastMessage: text.trim(),
        lastMessageTime: 'Just now',
        lastMessageTimestamp: timestamp,
        unreadCount: newUnreadCount,
        messages: [...thread.messages, newMsg]
      };
    }
    return thread;
  });

  saveCrossPortalThreads(updatedThreads);
  return updatedThreads;
};

export const markThreadAsRead = (threadId: string, userId: string): ChatThread[] => {
  const threads = getCrossPortalThreads();
  const updatedThreads = threads.map(thread => {
    if (thread.id === threadId) {
      // Mark all messages sent by someone else in this thread as 'read'
      const updatedMessages = thread.messages.map(m => {
        if (m.senderId !== userId && m.status !== 'read') {
          return { ...m, status: 'read' as const };
        }
        return m;
      });

      return {
        ...thread,
        unreadCount: {
          ...thread.unreadCount,
          [userId]: 0
        },
        messages: updatedMessages
      };
    }
    return thread;
  });

  saveCrossPortalThreads(updatedThreads);
  return updatedThreads;
};

export const findOrCreateThread = (userA: ChatParticipant, userB: ChatParticipant): { threads: ChatThread[]; threadId: string } => {
  const threads = getCrossPortalThreads();
  const existingThread = threads.find(t => 
    t.participants.some(p => p.id === userA.id) && t.participants.some(p => p.id === userB.id)
  );

  if (existingThread) {
    return { threads, threadId: existingThread.id };
  }

  const newThreadId = `thread-${userA.id}-${userB.id}`;
  const newThread: ChatThread = {
    id: newThreadId,
    participants: [userA, userB],
    lastMessage: `Conversation started`,
    lastMessageTime: 'Just now',
    lastMessageTimestamp: Date.now(),
    unreadCount: { [userA.id]: 0, [userB.id]: 0 },
    messages: [
      {
        id: `msg-init-${Date.now()}`,
        senderId: userB.id,
        senderRole: userB.role,
        senderName: userB.name,
        text: `Hello ${userA.name}, I am your assigned ${userB.role}. How can I assist you today?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now()
      }
    ]
  };

  const updatedThreads = [newThread, ...threads];
  saveCrossPortalThreads(updatedThreads);
  return { threads: updatedThreads, threadId: newThreadId };
};

// React Hook for real-time reactive cross-portal messaging
export function useCrossPortalMessaging(userId: string, userRole: UserRole) {
  const [threads, setThreads] = useState<ChatThread[]>(() => getCrossPortalThreads());
  const [activeThreadId, setActiveThreadId] = useState<string>('');

  // Filter threads where user is a participant
  const userThreads = threads.filter(t => 
    t.participants.some(p => p.id === userId) || 
    // Fallback match by role if user ID is general
    (userRole === 'counselor' && t.participants.some(p => p.role === 'counselor')) ||
    (userRole === 'student' && t.participants.some(p => p.role === 'student')) ||
    (userRole === 'admin' && t.participants.some(p => p.role === 'admin')) ||
    (userRole === 'parent' && t.participants.some(p => p.role === 'parent')) ||
    (userRole === 'teacher' && t.participants.some(p => p.role === 'teacher'))
  );

  // Auto-set initial active thread
  useEffect(() => {
    if (userThreads.length > 0 && !activeThreadId) {
      setActiveThreadId(userThreads[0].id);
    }
  }, [userThreads, activeThreadId]);

  // Mark active thread as read when viewing it
  useEffect(() => {
    if (activeThreadId && userId) {
      markThreadAsRead(activeThreadId, userId);
    }
  }, [activeThreadId, userId]);

  // Subscribe to real-time events and storage events
  useEffect(() => {
    const handleUpdate = () => {
      setThreads(getCrossPortalThreads());
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const activeThread = userThreads.find(t => t.id === activeThreadId) || userThreads[0];

  const handleSendMessage = useCallback((text: string, currentSenderName?: string) => {
    if (!text.trim() || !activeThread) return;
    const senderName = currentSenderName || DEMO_USERS[
      userRole === 'student' ? 'student1' :
      userRole === 'counselor' ? 'counselor1' :
      userRole === 'admin' ? 'admin1' :
      userRole === 'parent' ? 'parent1' : 'teacher1'
    ].name;

    sendMessageToThread(
      activeThread.id, 
      { id: userId, role: userRole, name: senderName }, 
      text
    );
  }, [activeThread, userId, userRole]);

  const selectThread = useCallback((threadId: string) => {
    setActiveThreadId(threadId);
    markThreadAsRead(threadId, userId);
  }, [userId]);

  const startChatWithContact = useCallback((contact: ChatParticipant, currentSender?: ChatParticipant) => {
    const me = currentSender || DEMO_USERS[
      userRole === 'student' ? 'student1' :
      userRole === 'counselor' ? 'counselor1' :
      userRole === 'admin' ? 'admin1' :
      userRole === 'parent' ? 'parent1' : 'teacher1'
    ];

    const result = findOrCreateThread(me, contact);
    setActiveThreadId(result.threadId);
    return result.threadId;
  }, [userRole]);

  const totalUnread = userThreads.reduce((acc, thread) => {
    return acc + (thread.unreadCount[userId] || 0);
  }, 0);

  return {
    threads: userThreads,
    allThreads: threads,
    activeThreadId,
    setActiveThreadId,
    activeThread,
    sendMessage: handleSendMessage,
    selectThread,
    startChatWithContact,
    totalUnread
  };
}
