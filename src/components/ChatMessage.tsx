
import { Message } from '@/types';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { UserIcon, BotIcon } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <div
      className={cn(
        'flex w-full items-start gap-4 py-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
          <BotIcon className="h-4 w-4" />
        </Avatar>
      )}
      
      <div
        className={cn(
          'rounded-lg px-4 py-3 max-w-[80%]',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        )}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 bg-secondary">
          <UserIcon className="h-4 w-4" />
        </Avatar>
      )}
    </div>
  );
}
