import { useState, useEffect } from 'react';

interface WritableStore<T> {
  subscribe: (callback: (value: T) => void) => () => void;
}

export default function writable<T>(
  initialValue: T,
  onSet?: (set: (newValue: T) => void) => void
): WritableStore<T> {
  const [value, setValue] = useState<T>(initialValue);
  const subscribers: Array<(value: T) => void> = [];

  function subscribe(callback: (value: T) => void) {
    subscribers.push(callback);
    return () => unsubscribe(callback);
  }

  function unsubscribe(callback: (value: T) => void) {
    const index = subscribers.indexOf(callback);
    if (index !== -1) {
      subscribers.splice(index, 1);
    }
  }

  function set(newValue: T) {
    setValue(newValue);
    subscribers.forEach(subscriber => subscriber(newValue));
  }
  
  useEffect(() => {
    if (onSet) {
      onSet(set);
    }
  }, [value])

  return { subscribe };
}