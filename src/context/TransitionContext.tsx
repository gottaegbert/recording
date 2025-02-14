'use client';
import { createContext, useState } from 'react';

interface TransitionContextType {
  isCompleted: boolean;
  toggleCompleted: (value: boolean) => void;
}

export const TransitionContext = createContext<TransitionContextType>({
  isCompleted: true,
  toggleCompleted: () => {},
});

export function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCompleted, setIsCompleted] = useState(true);

  return (
    <TransitionContext.Provider
      value={{
        isCompleted,
        toggleCompleted: setIsCompleted,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
}
