import { describe, it, expect } from 'vitest';
import { handle, type JsonRpcRequest } from '../server';

const req = (method: string, params?: unknown): JsonRpcRequest => ({ jsonrpc: '2.0', id: 1, method, params });

describe('mcp dispatcher', () => {
	it('initialize returns serverInfo + tools capability', () => {
		const r = handle(req('initialize'));
		expect(r.error).toBeUndefined();
		expect((r.result as any).serverInfo.name).toBe('svelte-tauri-mcp');
		expect((r.result as any).capabilities.tools).toBeDefined();
	});

	it('tools/list exposes foundation tools', () => {
		const tools = (handle(req('tools/list')).result as any).tools;
		expect(tools.map((t: any) => t.name)).toEqual(['list_render_modes', 'bridge_contract']);
	});

	it('tools/call list_render_modes returns the tri-mode set', () => {
		const r = handle(req('tools/call', { name: 'list_render_modes' }));
		expect((r.result as any).content[0].text).toContain('tui-native');
	});

	it('bridge_contract lists events-not-commands surface', () => {
		const t = (handle(req('tools/call', { name: 'bridge_contract' })).result as any).content[0].text;
		expect(t).toContain('navigate');
		expect(t).toContain('app-booted');
	});

	it('unknown method → -32601', () => {
		expect(handle(req('nope')).error?.code).toBe(-32601);
	});

	it('unknown tool → -32602', () => {
		expect(handle(req('tools/call', { name: 'ghost' })).error?.code).toBe(-32602);
	});
});
