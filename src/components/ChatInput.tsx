
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, LightbulbIcon } from 'lucide-react';
import { SearchResults } from './SearchResults';
import { useSearch } from '@/hooks/useSearch';
import { SearchResult } from '@/types';
import { useAICompletion } from '@/services/aiService';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { results, loading } = useSearch(message);
  const [showResults, setShowResults] = useState(false);
  
  // New AI suggestion feature
  const { 
    suggestion, 
    isTyping: aiIsThinking, 
    setInputText, 
    clearSuggestion
  } = useAICompletion(800);

  useEffect(() => {
    const hasResults = results.length > 0;
    setShowResults(hasResults);
  }, [results]);
  
  useEffect(() => {
    // Update the AI service input when message changes
    setInputText(message);
  }, [message, setInputText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      setShowResults(false);
      clearSuggestion();
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
  
  const applySuggestion = () => {
    if (suggestion) {
      onSendMessage(suggestion);
      setMessage('');
      clearSuggestion();
    }
  };

  return (
    <div className="relative">
      {suggestion && (
        <div className="mb-2 p-2 bg-muted/50 rounded-lg border border-border flex items-center justify-between">
          <div className="flex-1 text-sm text-muted-foreground italic">
            <span className="mr-2">Suggestion:</span>
            {suggestion}
          </div>
          <Button size="sm" variant="secondary" onClick={applySuggestion}>
            Use
          </Button>
        </div>
      )}
      
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
        <div className="absolute right-2 bottom-2 flex gap-1">
          {aiIsThinking && (
            <Badge variant="outline" className="animate-pulse">
              AI thinking...
            </Badge>
          )}
          <Button
            type="submit"
            size="icon"
            disabled={!message.trim() || disabled}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
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
