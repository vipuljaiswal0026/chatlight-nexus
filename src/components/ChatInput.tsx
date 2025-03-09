
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { SearchResults } from './SearchResults';
import { useSearch } from '@/hooks/useSearch';
import { SearchResult } from '@/types';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { results, loading } = useSearch(message);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const hasResults = results.length > 0;
    setShowResults(hasResults);
  }, [results]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      setShowResults(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    // Insert the result title into the message
    setMessage((prev) => prev + `\n\nReferencing: ${result.title} (${result.url})`);
    setShowResults(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          className="pr-12 min-h-[60px] resize-none"
          disabled={disabled}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-2 bottom-2"
          disabled={!message.trim() || disabled}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
      {showResults && (
        <SearchResults
          results={results}
          loading={loading}
          onClick={handleResultClick}
        />
      )}
    </div>
  );
}
