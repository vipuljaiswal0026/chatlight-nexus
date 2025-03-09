
import { Chat } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatHistoryProps {
  chats: Chat[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onNewChat: () => void;
}

export function ChatHistory({
  chats,
  currentChatId,
  onSelectChat,
  onDeleteChat,
  onNewChat,
}: ChatHistoryProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Button onClick={onNewChat} className="w-full">
          New Chat
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                'flex items-center justify-between rounded-lg p-2 cursor-pointer hover:bg-muted group transition-colors',
                chat.id === currentChatId && 'bg-muted'
              )}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">{chat.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(chat.createdAt)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
