# @plures/pluresdb — Application Runtime Plugin

**One plugin. Complete application runtime.**

## What You Get

| Capability | API | Backed by |
|---|---|---|
| CRDT Store | `createStore()` | `pluresdb-core` (Rust/WASM) |
| Reactive Procedures | `WasmAgensRuntime` | `pluresdb-procedures` (Rust/WASM) |
| .px Language | `createPxRuntime()` | `pluresdb-px` (Rust/WASM) |
| State Timeline | `createChronos()` | `pluresdb-chronos` (Rust/WASM) |
| P2P Sync | _(planned)_ | `pluresdb-sync` (Hyperswarm) |

## Quick Start

```ts
import { createApp } from '@plures/pluresdb';

const app = await createApp({
  name: 'my-app',
  chronos: true,
  px: [`
    procedure on_user_created:
      trigger: event("user.created")
      validate_email {email: $email} -> $valid
      when $valid:
        send_welcome {userId: $userId}
  `],
  actionHandler: (name, params) => {
    switch (name) {
      case 'validate_email': return { valid: true };
      case 'send_welcome': return sendEmail(params);
      default: throw new Error(`Unknown: ${name}`);
    }
  },
});

// Every store write is recorded by Chronos and can trigger .px procedures
app.store.put('user:1', { email: 'alice@example.com' });
```

## Standalone .px Runtime

Don't need the full app? Just use the .px runtime:

```ts
import { createPxRuntime } from '@plures/pluresdb/px';

const px = createPxRuntime((name, params) => {
  // Your action handlers
});

px.load(`
  procedure health_check:
    trigger: manual
    ping_service {url: "http://localhost:3000/health"} -> $result
    assert_eq {actual: $result.status, expected: "ok"}
`);

const result = px.run('health_check');
```

## Standalone Chronos

```ts
import { createStore } from '@plures/pluresdb/store';
import { createChronos } from '@plures/pluresdb/chronos';

const store = createStore({ name: 'my-db' });
const chronos = createChronos(store, { level: 'info' });

chronos.record('user:1', 'api', 'create', { name: 'Alice' });
const history = chronos.history('user:1');
```

## Architecture

```
Your Svelte App
      │
      ▼
@plures/pluresdb (this plugin)
      │
      ├── createApp()     → wires everything together
      ├── createStore()   → CRDT persistence
      ├── createPxRuntime() → .px compile + execute
      └── createChronos() → state timeline
      │
      ▼
@plures/pluresdb-wasm (Rust compiled to WASM)
      │
      ├── pluresdb-core        (CRDT store)
      ├── pluresdb-procedures  (query DSL, AgensRuntime)
      ├── pluresdb-px          (parser, compiler, executor)
      └── pluresdb-chronos     (timeline, causal chains)
```

## Replaces

This single plugin replaces what used to require:
- `@plures/praxis` (logic engine → now `.px` runtime)
- `@plures/chronos` (timeline → now `pluresdb-chronos`)
- `@plures/unum` (reactive bindings → now built into the WASM layer)

The TS packages still exist for backward compatibility but are thin
re-exports of this plugin's functionality.

## For pares-radix Plugin Developers

If you're writing a pares-radix plugin, you get ALL of this for free:
- PluresDB persistence via the shared store
- .px procedures via the shared runtime
- Chronos timeline via the shared instance

Just drop a `.px` file in your plugin directory. The pares-radix
plugin loader compiles and registers it automatically.
