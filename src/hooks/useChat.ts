
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Chat } from '@/types';
import { ChatActions, ChatState } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import { fetchUserChats, simulateResponse } from '@/services/chatService';
import { createNewChatObject, addMessageToChat, updateChatTitle } from '@/utils/chatUtils';

export function useChat(): ChatState & ChatActions {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load chats from Supabase when user is authenticated
  useEffect(() => {
    const loadChats = async () => {
      if (!user) {
        setChats([]);
        setCurrentChat(null);
        return;
      }

      setLoading(true);
      try {
        const userChats = await fetchUserChats(user.id);
        setChats(userChats);
        if (userChats.length > 0 && !currentChat) {
          setCurrentChat(userChats[0]);
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

    loadChats();
  }, [user, toast]);

  const createNewChat = () => {
    if (!user) return;

    const newChat = createNewChatObject();
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
    const updatedWithUserMessage = addMessageToChat(chatToUpdate, content, 'user');
    
    setCurrentChat(updatedWithUserMessage);
    setChats(prevChats =>
      prevChats.map(chat => (chat.id === updatedWithUserMessage.id ? updatedWithUserMessage : chat))
    );
    
    // Simulate AI response
    try {
      const assistantMessage = await simulateResponse(content);
      
      const finalUpdatedChat = {
        ...updatedWithUserMessage,
        messages: [...updatedWithUserMessage.messages, assistantMessage],
        updatedAt: new Date()
      };
      
      // Update chat title if it's a new conversation
      const titledChat = updateChatTitle(finalUpdatedChat, content);
      
      setCurrentChat(titledChat);
      setChats(prevChats =>
        prevChats.map(chat => (chat.id === titledChat.id ? titledChat : chat))
      );
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a response',
        variant: 'destructive',
      });
    }
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
