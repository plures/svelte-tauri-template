# Roadmap: Svelte-Tauri Template

## Current Status: **Maintenance** (Stable, incremental improvements)

The template is functionally complete and suitable for production use. Focus is on keeping current with upstream releases and addressing user feedback.

---

## Q1 2026 - Stability & Polish

### Immediate (Next 2 weeks)
- [ ] **Documentation Consolidation**
  - Move root-level `.md` files to `docs/` 
  - Create single `docs/README.md` as documentation index
  - Update main README to be concise getting-started guide

- [ ] **Dependency Updates**
  - Track Tauri 2.x releases, update template
  - Monitor Svelte 5 stable releases
  - Keep Praxis integration current (v1.2.x → v1.3.x when available)

### Q1 Goals
- [ ] **Enhanced Plugin CLI**
  - `npm run plugin:info <name>` — show plugin details before installing
  - `npm run plugin:remove <name>` — cleanly remove plugins
  - Better error messages and validation

- [ ] **Mobile Polish**
  - Test and document iOS/Android build process
  - Mobile-specific plugin configurations
  - App store submission guidance

- [ ] **Examples Gallery**
  - Add 2-3 reference apps showcasing different plugin combinations
  - Document common patterns (auth, data sync, offline-first)

---

## Q2 2026 - Ecosystem Integration

### PluresDB Plugin
- [ ] **P2P Data Sync**
  - Plugin for PluresDB integration
  - Offline-first data patterns with sync
  - Conflict resolution strategies

### Enhanced Praxis Integration  
- [ ] **Component Generation**
  - Auto-generate Svelte components from Praxis schemas
  - Reactive forms with validation
  - Real-time data binding patterns

### Developer Experience
- [ ] **Template Analytics** (Optional)
  - Anonymous usage metrics for template improvements
  - Popular plugin combinations insights
  - Performance benchmarking data

---

## Q3 2026 - Advanced Features

### Security & Production Hardening
- [ ] **Security Audit**
  - Review Tauri permissions model
  - Plugin security boundaries
  - Secure credential management patterns

- [ ] **Performance Optimization**
  - Bundle size analysis and optimization
  - Lazy loading strategies for plugins
  - Mobile performance profiling

### Enterprise Features (If Demand Exists)
- [ ] **Multi-Tenant Template**
  - Organization-level template customization
  - Private plugin repositories
  - Team collaboration features

---

## Long-term Vision (2027+)

### Template Ecosystem
- **Template Variants**: Web-only, CLI-only, server-first variants of the base template
- **Code Migration Tools**: Automated migration between template versions
- **Plugin Marketplace**: Community-contributed plugins with quality standards

### Plures Platform Integration
- **Native Praxis Runtime**: Template could generate apps that run directly on Praxis platform
- **Cross-Template Compatibility**: Projects generated from different Plures templates should interoperate seamlessly

---

## Maintenance Schedule

**Weekly:**
- Monitor Tauri/Svelte release notes
- Review and merge dependabot PRs
- Check plugin compatibility

**Monthly:**  
- Template generation smoke test across platforms
- Documentation review and updates
- Community feedback review

**Quarterly:**
- Major dependency updates
- Performance benchmarking
- Strategic direction review

---

## Success Metrics

- **Adoption**: Number of projects generated from template
- **Stability**: Time from template creation to first successful build
- **Ecosystem**: Number of plugins developed (internal + community)
- **Platform Coverage**: % of target platforms building successfully

**Target State**: Template should be the default starting point for any new cross-platform project in the Plures ecosystem.