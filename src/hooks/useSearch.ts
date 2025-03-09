
import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { SearchResult } from '@/types';

// Mock search API for now
const mockSearchApi = async (query: string): Promise<SearchResult[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!query.trim()) return [];
  
  // Mock search results
  return [
    {
      id: '1',
      title: `Result for "${query}" - Documentation`,
      url: 'https://example.com/docs',
      snippet: `This is a sample result that contains the term "${query}" with relevant information.`
    },
    {
      id: '2',
      title: `${query} - Learn More`,
      url: 'https://example.com/learn',
      snippet: `Discover more about "${query}" and related topics in our comprehensive guide.`
    },
    {
      id: '3',
      title: `Advanced ${query} Techniques`,
      url: 'https://example.com/advanced',
      snippet: `Explore advanced techniques and strategies related to "${query}" for better results.`
    }
  ];
};

export function useSearch(query: string) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const debouncedQuery = useDebounce(query, 500);
  
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Replace with your actual API call
        const searchResults = await mockSearchApi(debouncedQuery);
        setResults(searchResults);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [debouncedQuery]);
  
  return { results, loading, error };
}
