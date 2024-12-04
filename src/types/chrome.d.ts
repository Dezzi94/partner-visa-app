/// <reference types="@types/chrome" />

declare namespace Chrome {
  export interface Runtime {
    connect: (connectInfo?: { name?: string }) => ChromePort;
    sendMessage: (message: any) => void;
    onMessage: {
      addListener: (callback: (message: any, sender: any, sendResponse: any) => void) => void;
      removeListener: (callback: (message: any, sender: any, sendResponse: any) => void) => void;
    };
  }

  export interface Port {
    name: string;
    disconnect: () => void;
    onDisconnect: {
      addListener: (callback: () => void) => void;
      removeListener: (callback: () => void) => void;
    };
    onMessage: {
      addListener: (callback: (message: any) => void) => void;
      removeListener: (callback: (message: any) => void) => void;
    };
    postMessage: (message: any) => void;
  }
}

export interface ChromePort {
  name: string;
  disconnect: () => void;
  onDisconnect: {
    addListener: (callback: () => void) => void;
    removeListener: (callback: () => void) => void;
  };
  onMessage: {
    addListener: (callback: (message: any) => void) => void;
    removeListener: (callback: (message: any) => void) => void;
  };
  postMessage: (message: any) => void;
}

declare global {
  interface Window {
    chrome?: {
      runtime: {
        connect: (connectInfo?: { name?: string }) => ChromePort;
        sendMessage: (message: any) => void;
      };
    };
    __messagePorts?: ChromePort[];
  }
}

export {}; 