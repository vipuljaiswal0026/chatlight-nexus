
import { useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/context/AuthContext';
import { AuthForms } from '@/components/AuthForms';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { ChatHistory } from '@/components/ChatHistory';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LogOut, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Chat() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { chats, currentChat, loading: chatLoading, createNewChat, sendMessage, selectChat, deleteChat } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);

  // Show loading state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Show auth forms if not logged in
  if (!user) {
    return (
      <div className="container max-w-md mx-auto py-12">
        <AuthForms />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 md:hidden z-10"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[240px]">
          <div className="h-full">
            <ChatHistory
              chats={chats}
              currentChatId={currentChat?.id || null}
              onSelectChat={selectChat}
              onDeleteChat={deleteChat}
              onNewChat={createNewChat}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:block w-[240px] border-r h-full">
        <ChatHistory
          chats={chats}
          currentChatId={currentChat?.id || null}
          onSelectChat={selectChat}
          onDeleteChat={deleteChat}
          onNewChat={createNewChat}
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold">
            {currentChat ? currentChat.title : 'New Chat'}
          </h1>
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {currentChat?.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t bg-background">
          <div className="max-w-3xl mx-auto">
            <ChatInput onSendMessage={sendMessage} disabled={chatLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
