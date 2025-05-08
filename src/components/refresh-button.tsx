'use client';

import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef, useState, useEffect } from 'react';

interface RefreshButtonProps {
  targetId?: string;
  className?: string;
  onClick?: () => void;
  onRefreshStart?: () => void;
  onRefreshComplete?: () => void;
}

export function RefreshButton({
  targetId,
  className = '',
  onClick,
  onRefreshStart,
  onRefreshComplete,
}: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshTimer = useRef<NodeJS.Timeout | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (refreshTimer.current) {
        clearTimeout(refreshTimer.current);
      }
    };
  }, []);

  const handleRefresh = () => {
    if (isRefreshing) return; // Prevent multiple clicks

    setIsRefreshing(true);

    // Notify parent that refresh has started
    if (onRefreshStart) {
      onRefreshStart();
    }

    // If an onClick handler is provided, use it
    if (onClick) {
      onClick();
    }

    // If a targetId is provided, try to refresh that element
    if (targetId) {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        // Dispatch a custom event that components can listen for
        const refreshEvent = new CustomEvent('refresh-content', {
          bubbles: true,
          detail: { targetId },
        });
        targetElement.dispatchEvent(refreshEvent);
      }
    }

    // Clear any existing timer
    if (refreshTimer.current) {
      clearTimeout(refreshTimer.current);
    }

    // Reset the refreshing state after animation
    // Using a longer delay to accommodate the loading animation
    refreshTimer.current = setTimeout(() => {
      setIsRefreshing(false);
      if (onRefreshComplete) {
        onRefreshComplete();
      }
      refreshTimer.current = null;
    }, 2500); // Match the MIN_ANIMATION_DURATION from loading animation
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={`${className} ${isRefreshing ? 'animate-pulse' : ''}`}
      onClick={handleRefresh}
      title="Refresh content"
      disabled={isRefreshing}
    >
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
    </Button>
  );
}
