
import { Message } from '@/types';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { UserIcon } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <div
      className={cn(
        'flex w-full gap-4 py-4',
        isUser ? 'bg-transparent' : 'bg-muted/50'
      )}
    >
      <div className="container max-w-3xl mx-auto flex gap-4 px-4">
        {!isUser && (
          <Avatar className="h-8 w-8 bg-primary text-primary-foreground shrink-0 mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M3 9h6V3H3z" />
              <path d="M3 21h6v-6H3z" />
              <path d="M15 3h6v6h-6z" />
              <path d="M21 11h-6m0 0v10m0 0h-6m6 0V11m0 0H9" />
            </svg>
          </Avatar>
        )}
        
        {isUser && (
          <div className="w-8 h-8 shrink-0"></div>
        )}
        
        <div className="flex-1">
          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
          
          {message.attachmentUrl && (
            <div className="mt-2 border rounded-md p-2 inline-block">
              <a href={message.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 flex items-center gap-2 text-sm">
                <span className="i-lucide-paperclip text-xs" />
                Attachment
              </a>
            </div>
          )}
        </div>
        
        {isUser && (
          <Avatar className="h-8 w-8 bg-secondary shrink-0 mt-1">
            <UserIcon className="h-4 w-4" />
          </Avatar>
        )}
      </div>
    </div>
  );
}
