/**
 * @plures/pluresdb — The PluresDB Application Runtime
 *
 * One import gives you everything:
 * - CRDT store (persistence, sync)
 * - Reactive procedures (AgensRuntime, event dispatch)
 * - .px language (parse → compile → execute)
 * - Chronos timeline (observability, causal chains)
 *
 * @example
 * ```ts
 * import { createApp } from '@plures/pluresdb';
 *
 * const app = await createApp({
 *   name: 'my-app',
 *   actor: 'browser',
 *   px: ['./logic/main.px'],     // .px files loaded and compiled automatically
 *   chronos: true,                // state timeline enabled
 * });
 *
 * // Write data — chronos records it, procedures fire reactively
 * app.store.put('user:1', { name: 'Alice', role: 'admin' });
 *
 * // Query the timeline
 * const history = app.chronos.history('user:1', 10);
 *
 * // Execute a compiled procedure
 * app.px.run('validate_user', { userId: 'user:1' });
 * ```
 */

export { PluresDBBrowser, WasmCrdtStore, WasmAgensRuntime, WasmProcedureEngine } from './wasm';
export { WasmChronosTimeline } from './wasm';
export { pxCompile, pxParse, pxLint, pxExecute } from './wasm';
export { createApp } from './app';
export { createStore } from './store';
export { createChronos } from './chronos';
export { createPxRuntime } from './px';

export type { AppConfig, PluresApp } from './app';
export type { ActionHandler } from './px';
