import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

// jsdom 环境缺少 TextEncoder/TextDecoder，react-router v7 依赖它们
if (typeof global.TextEncoder === 'undefined') {
  Object.assign(global, { TextEncoder });
}
if (typeof global.TextDecoder === 'undefined') {
  Object.assign(global, { TextDecoder });
}

// jsdom 不实现 ResizeObserver / matchMedia，recharts 与响应式组件需要
class ResizeObserverMock {
  observe() {
    /* noop */
  }
  unobserve() {
    /* noop */
  }
  disconnect() {
    /* noop */
  }
}

if (typeof global.ResizeObserver === 'undefined') {
  Object.assign(global, { ResizeObserver: ResizeObserverMock });
}

if (typeof window !== 'undefined' && typeof window.matchMedia === 'undefined') {
  Object.assign(window, {
    matchMedia: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}
