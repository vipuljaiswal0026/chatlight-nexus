
import { v4 as uuidv4 } from 'uuid';
import { Chat, Message } from '@/types';

// Mock data
const mockChats: Chat[] = [
  {
    id: '1',
    title: 'First Conversation',
    messages: [
      {
        id: '1',
        content: 'Hello! How can I help you today?',
        role: 'assistant',
        createdAt: new Date(Date.now() - 86400000) // 1 day ago
      },
      {
        id: '2',
        content: 'I have a question about React.',
        role: 'user',
        createdAt: new Date(Date.now() - 86300000)
      },
      {
        id: '3',
        content: 'Sure, I can help with React questions. What would you like to know?',
        role: 'assistant',
        createdAt: new Date(Date.now() - 86200000)
      }
    ],
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86200000)
  },
  {
    id: '2',
    title: 'Learning TypeScript',
    messages: [
      {
        id: '1',
        content: 'Hello! How can I help you today?',
        role: 'assistant',
        createdAt: new Date(Date.now() - 43200000) // 12 hours ago
      },
      {
        id: '2',
        content: 'I want to learn TypeScript. Where should I start?',
        role: 'user',
        createdAt: new Date(Date.now() - 43100000)
      },
      {
        id: '3',
        content: 'TypeScript is a great language to learn! I recommend starting with the official documentation...',
        role: 'assistant',
        createdAt: new Date(Date.now() - 43000000)
      }
    ],
    createdAt: new Date(Date.now() - 43200000),
    updatedAt: new Date(Date.now() - 43000000)
  }
];

// Mock functions to simulate backend operations
export const fetchUserChats = async (userId: string | undefined): Promise<Chat[]> => {
  // In a real app, we would fetch from Supabase based on userId
  if (!userId) return [];
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockChats;
};

export const createInitialMessage = (): Message => {
  return {
    id: uuidv4(),
    content: 'Hello! How can I help you today?',
    role: 'assistant',
    createdAt: new Date()
  };
};

export const simulateResponse = async (content: string): Promise<Message> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: uuidv4(),
    content: `I received your message: "${content}". This is a simulated response.`,
    role: 'assistant',
    createdAt: new Date()
  };
};
