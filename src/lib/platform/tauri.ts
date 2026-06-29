/**
 * Tauri platform bridge — events-not-commands architecture.
 *
 * Mirrors `src-tauri/src/lib.rs`. The SAME static build runs unchanged in the
 * browser, in `vite dev`, and inside the Tauri webview: every Tauri-aware path
 * is lazy-imported behind `isTauri()`, so a browser build never pulls webview
 * code and `tauri` stays a runtime-detected enhancement.
 *
 * Contract (must match Rust exactly):
 *   commands (invoke): navigate, get_window_state, set_tray_menu, save_window_state
 *   events (listen):   app-booted, window-state-changed, user-navigated
 *
 * Commands are thin wrappers that emit praxis events; no business logic or
 * state lives in Rust. State is always a fact on the frontend/praxis side.
 */

export interface WindowState {
	width: number;
	height: number;
	x: number;
	y: number;
	maximized: boolean;
}

export interface NavItem {
	id: string;
	label: string;
	visible: boolean;
}

export type AppEvent = 'app-booted' | 'window-state-changed' | 'user-navigated';

/** True only inside a Tauri webview. Cheap, synchronous, browser-safe. */
export function isTauri(): boolean {
	return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

async function core() {
	// Lazy: browser/dev builds never resolve this.
	return await import('@tauri-apps/api/core');
}
async function evt() {
	return await import('@tauri-apps/api/event');
}

/** Tell Rust the user navigated; Rust re-emits `user-navigated` for tray sync. */
export async function navigate(path: string): Promise<void> {
	if (!isTauri()) return;
	const { invoke } = await core();
	await invoke('navigate', { path });
}

export async function getWindowState(): Promise<WindowState | null> {
	if (!isTauri()) return null;
	const { invoke } = await core();
	return await invoke<WindowState>('get_window_state');
}

export async function saveWindowState(state: WindowState): Promise<void> {
	if (!isTauri()) return;
	const { invoke } = await core();
	await invoke('save_window_state', { state });
}

/** Push current nav visibility to Rust so the tray menu is built from facts. */
export async function setTrayMenu(items: NavItem[]): Promise<void> {
	if (!isTauri()) return;
	const { invoke } = await core();
	await invoke('set_tray_menu', { items });
}

/** Subscribe to a backend event. Returns an unlisten fn; no-op in browser. */
export async function on<T>(event: AppEvent, cb: (payload: T) => void): Promise<() => void> {
	if (!isTauri()) return () => {};
	const { listen } = await evt();
	const un = await listen<T>(event, (e) => cb(e.payload));
	return un;
}
