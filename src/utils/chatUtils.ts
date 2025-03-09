
import { v4 as uuidv4 } from 'uuid';
import { Chat, Message } from '@/types';
import { createInitialMessage } from '@/services/chatService';

export const createNewChatObject = (): Chat => {
  return {
    id: uuidv4(),
    title: 'New Conversation',
    messages: [createInitialMessage()],
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

export const addMessageToChat = (chat: Chat, content: string, role: 'user' | 'assistant'): Chat => {
  const message: Message = {
    id: uuidv4(),
    content,
    role,
    createdAt: new Date()
  };
  
  return {
    ...chat,
    messages: [...chat.messages, message],
    updatedAt: new Date()
  };
};

export const updateChatTitle = (chat: Chat, content: string): Chat => {
  if (chat.title !== 'New Conversation' || content.length === 0) {
    return chat;
  }
  
  const newTitle = content.slice(0, 30) + (content.length > 30 ? '...' : '');
  return {
    ...chat,
    title: newTitle
  };
};
