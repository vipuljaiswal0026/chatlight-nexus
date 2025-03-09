
export interface User {
  id: string;
  email: string;
  avatar_url?: string;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: Date;
}

export interface SearchResult {
  id: string;
  title: string;
  url: string;
  snippet: string;
}

export interface AISuggestion {
  text: string;
  confidence: number;
}

// Change from 'export { Chat, ChatState, ChatActions }' to 'export type'
export type { Chat, ChatState, ChatActions } from './chat';
