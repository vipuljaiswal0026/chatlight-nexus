
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

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
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
