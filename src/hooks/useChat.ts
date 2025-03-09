
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Chat, Message } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

export function useChat() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load chats from Supabase when user is authenticated
  useEffect(() => {
    const fetchChats = async () => {
      if (!user) {
        setChats([]);
        return;
      }

      setLoading(true);
      try {
        // In a real implementation, you would fetch from Supabase
        // For now, we'll use mock data
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
        
        setChats(mockChats);
        if (mockChats.length > 0 && !currentChat) {
          setCurrentChat(mockChats[0]);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your chat history',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user, toast]);

  const createNewChat = () => {
    if (!user) return;

    const newChat: Chat = {
      id: uuidv4(),
      title: 'New Conversation',
      messages: [
        {
          id: uuidv4(),
          content: 'Hello! How can I help you today?',
          role: 'assistant',
          createdAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setChats(prevChats => [newChat, ...prevChats]);
    setCurrentChat(newChat);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || !user) return;

    let chatToUpdate = currentChat;
    
    // Create a new chat if there's no current chat
    if (!chatToUpdate) {
      createNewChat();
      chatToUpdate = chats[0];
    }

    if (!chatToUpdate) return;
    
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      role: 'user',
      createdAt: new Date()
    };
    
    // Update the current chat with the user message
    const updatedChat = {
      ...chatToUpdate,
      messages: [...chatToUpdate.messages, userMessage],
      updatedAt: new Date()
    };
    
    setCurrentChat(updatedChat);
    setChats(prevChats =>
      prevChats.map(chat => (chat.id === updatedChat.id ? updatedChat : chat))
    );
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: uuidv4(),
        content: `I received your message: "${content}". This is a simulated response.`,
        role: 'assistant',
        createdAt: new Date()
      };
      
      const finalUpdatedChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, assistantMessage],
        updatedAt: new Date()
      };
      
      setCurrentChat(finalUpdatedChat);
      setChats(prevChats =>
        prevChats.map(chat => (chat.id === finalUpdatedChat.id ? finalUpdatedChat : chat))
      );

      // Update chat title if it's a new conversation
      if (finalUpdatedChat.title === 'New Conversation' && content.length > 0) {
        const newTitle = content.slice(0, 30) + (content.length > 30 ? '...' : '');
        const titledChat = {
          ...finalUpdatedChat,
          title: newTitle
        };
        setCurrentChat(titledChat);
        setChats(prevChats =>
          prevChats.map(chat => (chat.id === titledChat.id ? titledChat : chat))
        );
      }
    }, 1000);
  };

  const selectChat = (chatId: string) => {
    const selected = chats.find(chat => chat.id === chatId);
    if (selected) {
      setCurrentChat(selected);
    }
  };

  const deleteChat = (chatId: string) => {
    setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
    if (currentChat?.id === chatId) {
      setCurrentChat(chats.length > 0 ? chats[0] : null);
    }
  };

  return {
    chats,
    currentChat,
    loading,
    createNewChat,
    sendMessage,
    selectChat,
    deleteChat
  };
}
