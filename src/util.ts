// Utility functions for Denver Places application
const TREE_EMOJI = "🌳";
const LEAFLESS_TREE_EMOJI = "🪾";

// Create prefixed console methods
export const logger = {
  log: (...args: any[]) => {
    console.log(`${TREE_EMOJI}`, ...args);
  },

  warn: (...args: any[]) => {
    console.warn(`${TREE_EMOJI} ⚠️`, ...args);
  },

  error: (...args: any[]) => {
    console.error(`${LEAFLESS_TREE_EMOJI} ❌`, ...args);
  },

  info: (...args: any[]) => {
    console.info(`${TREE_EMOJI} ℹ️`, ...args);
  },

  debug: (...args: any[]) => {
    console.debug(`${TREE_EMOJI} 🐛`, ...args);
  },

  // Special methods for CSV processing
  batch: (message: string) => {
    console.log(`${TREE_EMOJI} 📦`, message);
  },

  processing: (message: string) => {
    console.log(`${TREE_EMOJI} 🔍`, message);
  },

  success: (message: string) => {
    console.log(`${TREE_EMOJI} ✅`, message);
  },

  waiting: (message: string) => {
    console.log(`${TREE_EMOJI} ⏳`, message);
  },

  // Raw console access (without prefix) for special cases
  raw: console,
};

// Export individual methods for convenience
export const {
  log,
  warn,
  error,
  info,
  debug,
  batch,
  processing,
  success,
  waiting,
} = logger;
