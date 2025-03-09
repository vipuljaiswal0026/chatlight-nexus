
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, Download } from 'lucide-react';
import { SearchResults } from './SearchResults';
import { useSearch } from '@/hooks/useSearch';
import { SearchResult } from '@/types';
import { useAICompletion } from '@/services/aiService';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatInputProps {
  onSendMessage: (message: string, attachmentUrl?: string) => void;
  disabled?: boolean;
  onExportPDF?: () => void;
}

export function ChatInput({ onSendMessage, disabled = false, onExportPDF }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || attachment) && !disabled) {
      let attachmentUrl = '';
      
      if (attachment) {
        // In a real implementation, this would upload to a server/storage
        // For now, we'll create an object URL as a simple demo
        attachmentUrl = URL.createObjectURL(attachment);
      }
      
      onSendMessage(message.trim() || "Attachment sent", attachmentUrl);
      setMessage('');
      setAttachment(null);
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
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
      
      {attachment && (
        <div className="mb-2 p-2 bg-muted/50 rounded-lg border border-border flex items-center justify-between">
          <div className="flex-1 text-sm flex items-center gap-2">
            <Paperclip className="h-4 w-4" />
            <span className="truncate">{attachment.name}</span>
          </div>
          <Button size="sm" variant="outline" onClick={() => setAttachment(null)}>
            Remove
          </Button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="relative border rounded-lg focus-within:ring-1 focus-within:ring-ring focus-within:border-input">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          className="min-h-[60px] max-h-[200px] resize-none border-0 focus-visible:ring-0 rounded-lg"
          disabled={disabled}
        />
        
        <div className="absolute right-2 bottom-2 flex gap-1 items-center">
          {aiIsThinking && (
            <Badge variant="outline" className="animate-pulse">
              AI thinking...
            </Badge>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={triggerFileInput}
                  className="h-8 w-8"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Attach file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {onExportPDF && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={onExportPDF}
                    className="h-8 w-8"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export as PDF</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          <Button
            type="submit"
            size="icon"
            className="h-8 w-8"
            disabled={(!message.trim() && !attachment) || disabled}
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
