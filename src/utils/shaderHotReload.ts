import { useEffect, useState } from 'react';

/**
 * Hook to enable shader hot reloading in development
 * This hook returns a "version" number that changes whenever the code is reloaded
 * @returns A number that increases every time the module is reloaded
 */
export function useShaderHotReload(): number {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    // Only run in development mode
    if (process.env.NODE_ENV !== 'development') return;

    // HMR (Hot Module Replacement) detection
    const handler = () => {
      console.log('🔥 Shader code updated, reloading...');
      setVersion((v) => v + 1);
    };

    // Add a listener to detect changes
    window.addEventListener('shader-reload', handler);

    return () => {
      window.removeEventListener('shader-reload', handler);
    };
  }, []);

  return version;
}

// For manual reloading of shaders during development
export function triggerShaderReload(): void {
  window.dispatchEvent(new Event('shader-reload'));
}
