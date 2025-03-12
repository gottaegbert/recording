export interface GradientConfig {
  colors: {
    color1: string;
    color2: string;
    color3: string;
    color4: string;
  };
  amplitude?: number;
  frequency?: number;
}

export const defaultGradientConfig: GradientConfig = {
  colors: {
    color1: '#071933',
    color2: '#05A3AF',
    color3: '#4C4489',
    color4: '#122F5C',
  },
  amplitude: 320,
  frequency: 0.00005,
};

// Support for hot reload in development
declare global {
  interface Window {
    __GRADIENT_CONFIG_VERSION__?: number;
  }
}

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Initialize or increment the config version counter
  window.__GRADIENT_CONFIG_VERSION__ =
    (window.__GRADIENT_CONFIG_VERSION__ || 0) + 1;
  const currentVersion = window.__GRADIENT_CONFIG_VERSION__;

  // Use setTimeout to ensure this runs after the module is fully loaded
  setTimeout(() => {
    // Only trigger if this is a hot reload (version > 1)
    if (currentVersion > 1) {
      console.log(
        '🔄 Gradient config updated (v' +
          currentVersion +
          '), triggering reload...',
      );
      window.dispatchEvent(new Event('shader-reload'));
    }
  }, 0);
}
