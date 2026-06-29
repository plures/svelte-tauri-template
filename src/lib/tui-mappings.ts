/**
 * TUI widget mappings — Svelte component → ratatui widget.
 *
 * Built-in default for every scaffolded app. Used by `tui-native` render mode
 * (svelte-ratatui). The opt-in `@plures/svelte-ratatui` compiler + Cargo
 * `tauri-plugin-tui` consume these mappings; until those are wired the same
 * table drives `tui-css` fallback styling, so the contract is always present.
 */

export interface TuiWidgetMapping {
	component: string;
	widget: string;
	props?: Record<string, string>;
}

export const tuiMappings: TuiWidgetMapping[] = [
	{ component: 'button', widget: 'Button', props: { onclick: 'on_click', disabled: 'disabled' } },
	{ component: 'input', widget: 'Input', props: { value: 'value', placeholder: 'placeholder' } },
	{ component: 'p', widget: 'Paragraph' },
	{ component: 'h1', widget: 'Block', props: { title: 'text' } },
	{ component: 'h2', widget: 'Block', props: { title: 'text' } },
	{ component: 'ul', widget: 'List' },
	{ component: 'li', widget: 'ListItem' },
	{ component: 'div', widget: 'Block' },
	{ component: 'table', widget: 'Table' },
	{ component: 'span', widget: 'Span' }
];

export const tuiTheme = {
	colors: {
		primary: '#ff3e00',
		secondary: '#676778',
		background: '#1a1a2e',
		foreground: '#e0e0e0',
		accent: '#40b3ff',
		error: '#ff4444',
		warning: '#ffbb33',
		success: '#00c851'
	},
	borders: { style: 'rounded' as const }
};
