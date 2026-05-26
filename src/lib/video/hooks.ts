import { useState, useEffect, useRef } from 'react';

export function useVideoPlayer({ durations }: { durations: Record<string, number> }) {
  const [currentScene, setCurrentScene] = useState(0);
  const durationsRef = useRef(durations);
  
  useEffect(() => {
    // Notify recording environment we're ready
    if (typeof window !== 'undefined' && (window as any).startRecording) {
      (window as any).startRecording();
    }
    
    const sceneKeys = Object.keys(durationsRef.current);
    if (sceneKeys.length === 0) return;
    
    let isCancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const playNext = (index: number) => {
      if (isCancelled) return;
      
      setCurrentScene(index);
      
      const key = sceneKeys[index];
      const duration = durationsRef.current[key];
      
      timeoutId = setTimeout(() => {
        if (isCancelled) return;
        
        const nextIndex = index + 1;
        if (nextIndex >= sceneKeys.length) {
          // Loop completed
          if (typeof window !== 'undefined' && (window as any).stopRecording) {
            (window as any).stopRecording();
            // Optional: prevent multiple stopRecording calls by removing the function
            (window as any).stopRecording = undefined; 
          }
          // Loop back to start
          playNext(0);
        } else {
          playNext(nextIndex);
        }
      }, duration);
    };
    
    playNext(0);
    
    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);
  
  return { currentScene };
}
