/**
 * MCP dev server — minimal, real JSON-RPC 2.0 over stdio (newline-delimited).
 *
 * Built-in to every svelte-tauri app: `pnpm mcp` / `npm run mcp`. It exposes the
 * app's foundation surface (render modes, tui mappings, bridge contract) to MCP
 * clients without a traditional CLI. No mocks: messages are parsed, dispatched,
 * and answered for real over the process's own stdin/stdout.
 */

export interface JsonRpcRequest {
	jsonrpc: '2.0';
	id: number | string | null;
	method: string;
	params?: unknown;
}

export interface JsonRpcResponse {
	jsonrpc: '2.0';
	id: number | string | null;
	result?: unknown;
	error?: { code: number; message: string };
}

const SERVER_INFO = { name: 'svelte-tauri-mcp', version: '0.3.1' } as const;

const TOOLS = [
	{
		name: 'list_render_modes',
		description: 'Render modes the foundation supports.',
		inputSchema: { type: 'object', properties: {} }
	},
	{
		name: 'bridge_contract',
		description: 'Tauri commands + events the app exposes.',
		inputSchema: { type: 'object', properties: {} }
	}
];

/** Pure dispatcher — fully testable, no I/O. */
export function handle(req: JsonRpcRequest): JsonRpcResponse {
	const ok = (result: unknown): JsonRpcResponse => ({ jsonrpc: '2.0', id: req.id, result });
	const err = (code: number, message: string): JsonRpcResponse => ({
		jsonrpc: '2.0',
		id: req.id,
		error: { code, message }
	});
	switch (req.method) {
		case 'initialize':
			return ok({ protocolVersion: '2024-11-05', serverInfo: SERVER_INFO, capabilities: { tools: {} } });
		case 'tools/list':
			return ok({ tools: TOOLS });
		case 'tools/call': {
			const p = (req.params ?? {}) as { name?: string };
			if (p.name === 'list_render_modes')
				return ok({ content: [{ type: 'text', text: 'gui, tui-css, tui-native' }] });
			if (p.name === 'bridge_contract')
				return ok({
					content: [
						{
							type: 'text',
							text: 'commands: navigate, get_window_state, set_tray_menu, save_window_state; events: app-booted, window-state-changed, user-navigated'
						}
					]
				});
			return err(-32602, `unknown tool: ${p.name}`);
		}
		case 'ping':
			return ok({});
		default:
			return err(-32601, `method not found: ${req.method}`);
	}
}

/** Wire the dispatcher to a stdio stream. Newline-delimited JSON-RPC. */
export function serve(input: NodeJS.ReadableStream, output: NodeJS.WritableStream): void {
	let buf = '';
	input.setEncoding('utf8');
	input.on('data', (chunk: string) => {
		buf += chunk;
		let nl: number;
		while ((nl = buf.indexOf('\n')) >= 0) {
			const line = buf.slice(0, nl).trim();
			buf = buf.slice(nl + 1);
			if (!line) continue;
			try {
				const res = handle(JSON.parse(line) as JsonRpcRequest);
				output.write(JSON.stringify(res) + '\n');
			} catch {
				output.write(JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'parse error' } }) + '\n');
			}
		}
	});
}

if (process.argv[1] && process.argv[1].endsWith('server.ts')) {
	serve(process.stdin, process.stdout);
}
