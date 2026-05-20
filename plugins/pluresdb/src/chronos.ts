/**
 * Convenience wrappers for Chronos timeline.
 */

import { WasmChronosTimeline } from './wasm';
import type { WasmCrdtStore } from './wasm';

export interface ChronosConfig {
  /** Minimum recording level. Default: 'info'. */
  level?: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * Create a Chronos timeline bound to a CRDT store.
 */
export function createChronos(store: WasmCrdtStore, config?: ChronosConfig) {
  const timeline = new WasmChronosTimeline(store);
  if (config?.level) {
    timeline.set_level(config.level);
  }

  return {
    /** Record a state mutation. */
    record(key: string, actor: string, action: string, data: unknown, rationale?: string) {
      return timeline.record(key, actor, action, data, rationale);
    },

    /** Get version history for a key. */
    history(key: string, limit = 50) {
      return timeline.history(key, limit);
    },

    /** Get recent entries across all keys. */
    recent(limit = 50) {
      return timeline.recent(limit);
    },

    /** Get timeline with filters. */
    timeline(limit = 50, sinceMs?: number, level?: string) {
      return timeline.timeline(limit, sinceMs, level);
    },

    /** Set minimum recording level. */
    setLevel(level: 'debug' | 'info' | 'warn' | 'error') {
      timeline.set_level(level);
    },

    /** Raw WASM timeline instance. */
    raw: timeline,
  };
}
