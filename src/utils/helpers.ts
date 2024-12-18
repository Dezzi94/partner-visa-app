import type { ChromePort } from '../types/chrome';

/**
 * Generates a unique ID with an optional prefix
 * @param prefix - Optional prefix for the ID
 * @returns A unique string ID
 */
export const generateUniqueId = (prefix: string = ''): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${prefix ? prefix + '-' : ''}${timestamp}-${random}`;
};

/**
 * Safely disconnects a Chrome extension port
 * @param port - The port to disconnect
 */
export const disconnectPort = (port: ChromePort): void => {
  try {
    if (port && typeof port.disconnect === 'function') {
      port.disconnect();
    }
  } catch (error) {
    console.debug('Port disconnection:', error);
  }
};

/**
 * Checks if the window is in a Chrome extension context
 * @returns boolean indicating if Chrome extension APIs are available
 */
export const isChromeExtension = (): boolean => {
  try {
    return typeof window !== 'undefined' && 
           !!window.chrome?.runtime?.connect &&
           process.env.NODE_ENV !== 'development'; // Disable in development
  } catch {
    return false;
  }
}; 