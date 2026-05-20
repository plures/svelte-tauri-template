/**
 * .px language runtime — TypeScript API over WASM bindings.
 */

import { pxCompile, pxParse, pxLint, pxExecute } from './wasm';

/** An action handler receives step calls from .px procedures. */
export interface ActionHandler {
  (name: string, params: unknown): unknown;
}

/** Compiled .px procedure record. */
export interface CompiledRecord {
  key: string;
  data: {
    type: string;
    name?: string;
    trigger?: { kind: string };
    steps?: unknown[];
    [key: string]: unknown;
  };
}

/** Lint diagnostic from the .px linter. */
export interface LintDiagnostic {
  code: string;
  message: string;
  severity: 'warning' | 'error';
  procedure?: string;
  step_index?: number;
}

/**
 * Create a standalone .px runtime (without the full app bootstrap).
 *
 * @example
 * ```ts
 * const px = createPxRuntime((name, params) => {
 *   if (name === 'fetch_user') return { id: 1, name: 'Alice' };
 *   throw new Error(`Unknown action: ${name}`);
 * });
 *
 * px.load(`
 *   procedure greet:
 *     trigger: manual
 *     fetch_user {id: $userId} -> $user
 *     format_greeting {name: $user.name} -> $greeting
 * `);
 *
 * const result = px.run('greet', { userId: '1' });
 * ```
 */
export function createPxRuntime(handler: ActionHandler) {
  const procedures = new Map<string, unknown>();

  return {
    /** Compile and register .px source. */
    load(source: string): CompiledRecord[] {
      const records = pxCompile(source) as CompiledRecord[];
      for (const record of records) {
        if (record.data?.type === 'procedure' && record.data?.name) {
          procedures.set(record.data.name, record.data);
        }
      }
      return records;
    },

    /** Parse .px source to AST (for introspection). */
    parse: pxParse,

    /** Lint .px source and return diagnostics. */
    lint(source: string): LintDiagnostic[] {
      return pxLint(source) as unknown as LintDiagnostic[];
    },

    /** Execute a registered procedure by name. */
    run(name: string, _params?: Record<string, unknown>) {
      const proc = procedures.get(name);
      if (!proc) {
        throw new Error(`Procedure '${name}' not registered`);
      }
      return pxExecute(proc, handler as any);
    },

    /** List registered procedure names. */
    list(): string[] {
      return [...procedures.keys()];
    },
  };
}
