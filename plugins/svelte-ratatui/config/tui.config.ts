/**
 * TUI Configuration — svelte-ratatui
 *
 * Widget mappings translate Svelte component names to Ratatui widgets.
 * Theme tokens control colours and styles when rendering in the terminal.
 *
 * @see https://github.com/plures/svelte-ratatui
 */

export interface TuiWidgetMapping {
  /** Svelte component tag name */
  component: string;
  /** Ratatui widget to render */
  widget: string;
  /** Optional property mappings */
  props?: Record<string, string>;
}

export interface TuiTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    accent: string;
    error: string;
    warning: string;
    success: string;
  };
  borders: {
    style: 'plain' | 'rounded' | 'double' | 'thick';
  };
}

export interface TuiConfig {
  /** Enable TUI rendering (set via TAURI_TUI env var at runtime) */
  enabled: boolean;
  /** Widget mappings from Svelte components to Ratatui widgets */
  widgets: TuiWidgetMapping[];
  /** Terminal colour theme */
  theme: TuiTheme;
}

const config: TuiConfig = {
  enabled: !!process.env.TAURI_TUI,

  widgets: [
    {
      component: 'button',
      widget: 'Button',
      props: { onclick: 'on_click', disabled: 'disabled' },
    },
    {
      component: 'input',
      widget: 'Input',
      props: { value: 'value', placeholder: 'placeholder' },
    },
    {
      component: 'p',
      widget: 'Paragraph',
    },
    {
      component: 'h1',
      widget: 'Block',
      props: { title: 'text' },
    },
    {
      component: 'ul',
      widget: 'List',
    },
    {
      component: 'li',
      widget: 'ListItem',
    },
    {
      component: 'div',
      widget: 'Block',
    },
    {
      component: 'table',
      widget: 'Table',
    },
    {
      component: 'span',
      widget: 'Span',
    },
  ],

  theme: {
    colors: {
      primary: '#ff3e00',
      secondary: '#676778',
      background: '#1a1a2e',
      foreground: '#e0e0e0',
      accent: '#40b3ff',
      error: '#ff4444',
      warning: '#ffbb33',
      success: '#00c851',
    },
    borders: {
      style: 'rounded',
    },
  },
};

export default config;
