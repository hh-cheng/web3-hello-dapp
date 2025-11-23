// Polyfill for browser APIs during SSR
// This prevents "indexedDB is not defined" and "window.location is undefined" errors during server-side rendering
if (typeof window === 'undefined') {
  // Create a no-op indexedDB object that doesn't throw errors
  // Returns a mock IDBOpenDBRequest that resolves to null
  const noopIndexedDB = {
    open: () => {
      // Return a mock request object that doesn't throw
      return {
        onsuccess: null,
        onerror: null,
        result: null,
        error: null,
        readyState: 'done',
        addEventListener: () => {},
        removeEventListener: () => {},
      } as unknown as IDBOpenDBRequest
    },
    deleteDatabase: () => {
      return {
        onsuccess: null,
        onerror: null,
        result: null,
        error: null,
        readyState: 'done',
        addEventListener: () => {},
        removeEventListener: () => {},
      } as unknown as IDBOpenDBRequest
    },
    databases: () => Promise.resolve([]),
  }

  // Create a mock window.location object
  const mockLocation = {
    protocol: 'https:',
    host: 'localhost',
    hostname: 'localhost',
    port: '',
    pathname: '/',
    search: '',
    hash: '',
    href: 'https://localhost/',
    origin: 'https://localhost',
  }

  // @ts-expect-error - polyfill for SSR
  global.indexedDB = noopIndexedDB
  global.window = global.window || {}
  // @ts-expect-error - polyfill for SSR
  global.window.indexedDB = noopIndexedDB
  // @ts-expect-error - polyfill for SSR
  global.window.location = mockLocation
  // @ts-expect-error - polyfill for SSR
  global.location = mockLocation
}

export {}
