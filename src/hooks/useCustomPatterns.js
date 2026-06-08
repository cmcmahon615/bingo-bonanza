import { useState, useEffect } from 'react';

const STORAGE_KEY = 'bingo-custom-patterns';

export default function useCustomPatterns() {
  const [customPatterns, setCustomPatterns] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customPatterns));
  }, [customPatterns]);

  function savePattern(name, cells) {
    const newPattern = {
      id: `custom-${Date.now()}`,
      name,
      cells, // array of [row, col] pairs
    };
    setCustomPatterns((prev) => [...prev, newPattern]);
    return newPattern.id;
  }

  function deletePattern(id) {
    setCustomPatterns((prev) => prev.filter((p) => p.id !== id));
  }

  return { customPatterns, savePattern, deletePattern };
}
