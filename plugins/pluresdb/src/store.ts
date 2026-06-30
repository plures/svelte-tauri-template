/**
 * Store creation helper.
 */

import { PluresDBBrowser, WasmCrdtStore } from './wasm';

export interface StoreConfig {
  /** Database name. */
  name: string;
  /** Actor ID for CRDT attribution. */
  actor?: string;
}

/**
 * Create a PluresDB store instance.
 */
export function createStore(config: StoreConfig) {
  return new PluresDBBrowser(config.name, config.actor ?? 'browser');
}

/**
 * Create a raw CRDT store (for advanced use / shared across runtimes).
 */
export function createRawStore() {
  return new WasmCrdtStore();
}
