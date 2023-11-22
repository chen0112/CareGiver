// AblyContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Ably from 'ably';

// Define the type for the Ably Realtime instance
type AblyContextType = Ably.Realtime | null;

// Create a context with a null default value
const AblyContext = createContext<AblyContextType>(null);

interface AblyProviderProps {
  children: ReactNode;
}

// Provider component
export const AblyProvider: React.FC<AblyProviderProps> = ({ children }) => {
  const [realtime, setRealtime] = useState<Ably.Realtime | null>(null);

  useEffect(() => {
    // Initialize the Ably Realtime instance
    const ably = new Ably.Realtime('iP9ymA.8JTs-Q:XJkf6tU_20Q-62UkTi1gbXXD21SHtpygPTPnA7GX0aY'); // Use Realtime instead of Realtime.Promise
    setRealtime(ably);

    return () => {
      // Close the connection when the component unmounts
      ably.close();
    };
  }, []);

  return (
    <AblyContext.Provider value={realtime}>
      {children}
    </AblyContext.Provider>
  );
};

// Hook to use Ably in other components
export const useAbly = (): Ably.Realtime | null => useContext(AblyContext);
