import { useState, useEffect } from 'react';

interface WindowSize {
  width?: number;  // The question mark makes the width property optional
}

const useWindowSize = () => {
  // Initialize state with undefined width so server and client renders match
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width to state
      setWindowSize({
        width: window.innerWidth,
      });
    }
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures effect is only run on mount and unmount

  return windowSize;
};

export default useWindowSize;
