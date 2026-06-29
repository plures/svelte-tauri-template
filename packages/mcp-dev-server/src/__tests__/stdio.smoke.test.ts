import { describe, it, expect } from 'vitest';
import { PassThrough } from 'node:stream';
import { serve } from '../server';

/** Real stdio round-trip: drive `serve()` over live streams, parse the reply. */
describe('mcp stdio smoke', () => {
	it('answers initialize then bridge_contract over a stream', async () => {
		const stdin = new PassThrough();
		const stdout = new PassThrough();
		serve(stdin, stdout);

		const lines: string[] = [];
		stdout.on('data', (d: Buffer) => {
			for (const l of d.toString().split('\n')) if (l.trim()) lines.push(l.trim());
		});

		stdin.write(JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize' }) + '\n');
		stdin.write(JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'bridge_contract' } }) + '\n');
		await new Promise((r) => setTimeout(r, 50));

		expect(lines.length).toBe(2);
		expect(JSON.parse(lines[0]).result.serverInfo.name).toBe('svelte-tauri-mcp');
		expect(JSON.parse(lines[1]).result.content[0].text).toContain('navigate');
	});
});
