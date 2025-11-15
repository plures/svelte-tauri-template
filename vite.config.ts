import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// Get the host from environment variable for mobile development
const host = process.env.TAURI_DEV_HOST;
const port = process.env.TAURI_DEV_PORT ? parseInt(process.env.TAURI_DEV_PORT) : 5173;

export default defineConfig({
	plugins: [sveltekit()],
	clearScreen: false,
	server: {
		host: host || false,
		port: port,
		strictPort: true,
		hmr: host
			? {
					protocol: 'ws',
					host: host,
					port: port + 1,
				}
			: undefined,
	},
	optimizeDeps: {
		// Exclude Tauri APIs from dependency pre-bundling
		exclude: ['@tauri-apps/api', '@tauri-apps/plugin-updater', '@tauri-apps/plugin-store'],
	},
	build: {
		rollupOptions: {
			external: (id) => {
				// Externalize Tauri APIs - they're provided by the Tauri runtime at runtime
				// This prevents Rollup from trying to resolve them during build
				return id.startsWith('@tauri-apps/api/') || id.startsWith('@tauri-apps/plugin-');
			},
		},
	},
	ssr: {
		// Don't try to resolve Tauri APIs during SSR
		noExternal: [],
	},
});
