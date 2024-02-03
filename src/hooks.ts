import { debounce } from 'lodash';
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router';

type SearchAction = (query: string) => void;

export const useTitle = (title: string) =>
  (document.title = title ? `${title} - Shepherd Tutors` : 'Shepherd Tutors');

export const useSearch = (
  action: SearchAction,
  throttleTime = 1000
): SearchAction => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // eslint-disable-next-line
  const throttledAction = useCallback(debounce(action, throttleTime), [
    action,
    throttleTime
  ]);

  useEffect(() => {
    if (searchQuery) {
      throttledAction(searchQuery);
    }
  }, [searchQuery, throttledAction, hasSearched]);

  const handleSearch: SearchAction = useCallback(
    (query) => {
      if (query) {
        setSearchQuery(query);
      }
      if (!query && hasSearched) {
        action(query);
      }
      if (!hasSearched) {
        setHasSearched(true);
      }
    },
    [hasSearched, action]
  );

  return handleSearch;
};

export function useSearchQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export function useCopyToClipboard({ timeout = 2000 }: { timeout?: number }) {
  const [isCopied, setIsCopied] = React.useState<Boolean>(false);

  const copyToClipboard = (value: string) => {
    if (typeof window === 'undefined' || !navigator.clipboard?.writeText) {
      return;
    }

    if (!value) {
      return;
    }

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, timeout);
    });
  };

  return { isCopied, copyToClipboard };
}
