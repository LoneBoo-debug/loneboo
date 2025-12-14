
// Polyfills for browser environment to support Node.js-specific globals
// required by some libraries (like Google GenAI).

if (typeof window !== 'undefined') {
  if (typeof (window as any).global === 'undefined') {
    (window as any).global = window;
  }
  
  if (typeof (window as any).process === 'undefined') {
    (window as any).process = {
      env: {},
      version: '',
      versions: {},
      platform: 'browser'
    };
  }
}

export {};
