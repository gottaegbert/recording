import { useState } from 'react';
import { triggerShaderReload } from '@/utils/shaderHotReload';
import { Button } from '@/components/ui/button';

interface ShaderDevToolsProps {
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  onOpenEditor?: () => void;
}

/**
 * Development tools for shader editing
 * Only shows in development mode
 */
export function ShaderDevTools({
  position = 'bottom-right',
  onOpenEditor,
}: ShaderDevToolsProps) {
  const [lastModified, setLastModified] = useState<Date | null>(null);

  // Don't render in production
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const positionClass = {
    'top-right': 'top-2 right-2',
    'bottom-right': 'bottom-2 right-2',
    'top-left': 'top-2 left-2',
    'bottom-left': 'bottom-2 left-2',
  }[position];

  const handleReload = () => {
    setLastModified(new Date());
    triggerShaderReload();
  };

  return (
    <div
      className={`absolute ${positionClass} z-10 flex gap-2`}
      style={{
        background: 'rgba(0,0,0,0.7)',
        padding: '8px',
        borderRadius: '4px',
        color: 'white',
        fontSize: '12px',
      }}
    >
      <Button onClick={handleReload} className="rounded">
        Reload Shader
      </Button>
      {/* 
      {onOpenEditor && (
        <button
          onClick={onOpenEditor}
          className="rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
        >
          Edit Shader
        </button>
      )} */}

      {lastModified && (
        <div className="text-sm text-gray-300">
          Last reload:
          <br />
          {lastModified.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
