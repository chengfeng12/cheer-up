/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vite/client" />

// 平台注入的一些全局对象
declare global {
  interface Window {
    aiSdk?: Record<string, any>;
    ywConfig?: Record<string, any>;
    ywSdk?: Record<string, any>;
  }
}

export {};