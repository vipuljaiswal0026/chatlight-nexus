
import { SearchResult } from '@/types';
import { ExternalLink } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  onClick: (result: SearchResult) => void;
}

export function SearchResults({ results, loading, onClick }: SearchResultsProps) {
  if (loading) {
    return (
      <div className="absolute top-full left-0 right-0 bg-background border rounded-lg mt-1 shadow-md p-2 z-10">
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
          <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 bg-background border rounded-lg mt-1 shadow-md p-2 z-10 max-h-[300px] overflow-y-auto">
      <h3 className="text-sm font-medium text-muted-foreground px-2 py-1 border-b mb-2">Search Results</h3>
      <ul className="space-y-2">
        {results.map((result) => (
          <li 
            key={result.id}
            className="p-2 hover:bg-muted rounded-md cursor-pointer transition-colors"
            onClick={() => onClick(result)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-medium">{result.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{result.snippet}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
