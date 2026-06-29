# Infrastructure Debt

Tracked infrastructure gaps that are intentionally deferred. These are NOT code
stubs — they are real, narrowly-scoped capabilities that depend on paid/external
infrastructure not yet provisioned. The foundation must never be gated on them.

## Mobile (Android / iOS) release signing

**Status:** deferred — requires paid signing infrastructure.

- **Android:** needs a release keystore + secrets (`ANDROID_KEYSTORE`,
  `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_PASSWORD`, `ANDROID_KEY_ALIAS`).
- **iOS:** needs an Apple Developer Program membership ($99/yr), signing
  certificate, and provisioning profile (`APPLE_CERTIFICATE`,
  `APPLE_CERTIFICATE_PASSWORD`, `APPLE_TEAM_ID`, `APPLE_PROVISIONING_PROFILE`).

**Decision:** mobile builds are **release artifacts**, not foundation PR gates.
`android-build.yml` and `ios-build.yml` run only on version tags (`v*`) and
`workflow_dispatch`. PR gates are: desktop builds (Linux/Windows/macOS), e2e
(Playwright), MCP vitest, and ui-compliance. This keeps the foundation green and
fast while mobile artifacts ship on release once signing is provisioned.

**To re-enable mobile as a release gate:** provision the secrets above, then run
the workflows via `workflow_dispatch` (build_type=release) or push a `v*` tag.
