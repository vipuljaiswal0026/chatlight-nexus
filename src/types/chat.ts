
import { Message } from "./index";

export interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  loading: boolean;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatActions {
  createNewChat: () => void;
  sendMessage: (content: string, attachmentUrl?: string) => Promise<void>;
  selectChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
}
