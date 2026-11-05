/**
 * @fileoverview YYC3 logger Utility
 * @description Unified logging system replacing console.log/warn/error in production code
 * @audit-fix [W1-FIX] — Centralized logging with production silencing
 * @audit-phase P2
 * @audit-date 2026-04-21
 * @version 1.0.0
 * @author YYC3 Team
 */

/* eslint-disable no-console */
const isDev = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development';

function noop() {}

export const logger = {
  debug: isDev ? console.log.bind(console, '[DEBUG]') : noop,
  info: isDev ? console.log.bind(console, '[INFO]') : noop,
  warn: isDev ? console.warn.bind(console, '[WARN]') : noop,
  error: console.error.bind(console, '[ERROR]'),
};
