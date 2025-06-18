
import { useState, useCallback, useMemo } from 'react';

export function useOptimizedState<T>(initialValue: T) {
  const [state, setState] = useState<T>(initialValue);

  const optimizedSetState = useCallback((newValue: T | ((prev: T) => T)) => {
    setState(prev => {
      const nextValue = typeof newValue === 'function' ? (newValue as (prev: T) => T)(prev) : newValue;
      // Prevent unnecessary re-renders for same values
      return JSON.stringify(prev) === JSON.stringify(nextValue) ? prev : nextValue;
    });
  }, []);

  const memoizedState = useMemo(() => state, [state]);

  return [memoizedState, optimizedSetState] as const;
}
