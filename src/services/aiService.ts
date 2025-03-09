
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

// Simulated AI completion API
export async function getAICompletion(prompt: string): Promise<string> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple responses based on input
      if (prompt.toLowerCase().includes('hello')) {
        resolve('Hello! How can I assist you today?');
      } else if (prompt.toLowerCase().includes('help')) {
        resolve('I\'m here to help. What do you need assistance with?');
      } else if (prompt.toLowerCase().includes('weather')) {
        resolve('I don\'t have real-time weather data, but I can suggest checking a weather service!');
      } else {
        resolve(`I received your request: "${prompt}". How can I help you with that?`);
      }
    }, 500); // Simulated delay
  });
}

// Hook to use the AI completion with debounce
export function useAICompletion(delay = 500) {
  const [isTyping, setIsTyping] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  
  const debouncedText = useDebounce(inputText, delay);
  
  useEffect(() => {
    let isMounted = true;
    
    if (debouncedText.trim().length > 5) {
      setIsTyping(true);
      getAICompletion(debouncedText)
        .then((response) => {
          if (isMounted) {
            setSuggestion(response);
            setIsTyping(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            setIsTyping(false);
          }
        });
    } else {
      setSuggestion(null);
    }
    
    return () => {
      isMounted = false;
    };
  }, [debouncedText]);
  
  return {
    suggestion,
    isTyping,
    inputText,
    setInputText,
    clearSuggestion: () => setSuggestion(null)
  };
}
