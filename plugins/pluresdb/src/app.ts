/**
 * One-call application bootstrap.
 *
 * Wires together: CRDT store + Chronos timeline + .px runtime + reactive bindings.
 */

import { PluresDBBrowser, WasmChronosTimeline, pxCompile, pxExecute } from './wasm';
import type { ActionHandler } from './px';

export interface AppConfig {
  /** Application name (used as DB namespace). */
  name: string;
  /** Actor ID for CRDT attribution. */
  actor?: string;
  /** .px source strings or URLs to load and compile. */
  px?: string[];
  /** Enable Chronos timeline. Default: true. */
  chronos?: boolean;
  /** Custom action handler for .px procedure steps. */
  actionHandler?: ActionHandler;
}

export interface PluresApp {
  /** The underlying CRDT store. */
  store: PluresDBBrowser;
  /** Chronos timeline (if enabled). */
  chronos: WasmChronosTimeline | null;
  /** Execute a compiled .px procedure by name. */
  run: (procedureName: string, params?: Record<string, unknown>) => unknown;
  /** Compile and register .px source. */
  loadPx: (source: string) => void;
}

/**
 * Create a fully-wired PluresDB application.
 *
 * @example
 * ```ts
 * const app = await createApp({ name: 'my-app', chronos: true });
 * app.store.put('key', { value: 1 });
 * app.run('on_write', { key: 'key' });
 * ```
 */
export async function createApp(config: AppConfig): Promise<PluresApp> {
  const store = new PluresDBBrowser(config.name, config.actor ?? 'browser');

  // Chronos timeline (default: enabled)
  let chronos: WasmChronosTimeline | null = null;
  if (config.chronos !== false) {
    // WasmChronosTimeline constructor takes a WasmCrdtStore, but we can
    // access it through PluresDBBrowser's internal store. For now, create
    // a parallel timeline from the same underlying CRDT store.
    // TODO: wire shared store reference when WASM bindings expose it.
    chronos = null; // Will be wired once WasmCrdtStore is exposed from PluresDBBrowser
  }

  // .px procedure registry
  const compiledProcedures = new Map<string, unknown>();

  // Load and compile .px sources
  if (config.px) {
    for (const source of config.px) {
      const records = pxCompile(source);
      if (Array.isArray(records)) {
        for (const record of records) {
          if (record.data?.type === 'procedure' && record.data?.name) {
            compiledProcedures.set(record.data.name, record.data);
          }
        }
      }
    }
  }

  // Default action handler
  const handler = config.actionHandler ?? ((name: string, params: unknown) => {
    console.warn(`[pluresdb] No handler for action: ${name}`, params);
    return null;
  });

  function run(procedureName: string, params?: Record<string, unknown>) {
    const proc = compiledProcedures.get(procedureName);
    if (!proc) {
      throw new Error(`Procedure '${procedureName}' not found. Loaded: ${[...compiledProcedures.keys()].join(', ')}`);
    }
    return pxExecute(proc, handler as any);
  }

  function loadPx(source: string) {
    const records = pxCompile(source);
    if (Array.isArray(records)) {
      for (const record of records) {
        if (record.data?.type === 'procedure' && record.data?.name) {
          compiledProcedures.set(record.data.name, record.data);
        }
      }
    }
  }

  return { store, chronos, run, loadPx };
}
