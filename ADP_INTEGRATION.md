# Architectural Discipline Package (ADP) Integration

This project uses the **Architectural Discipline Package (ADP)** from `plures/adp` to maintain high code quality and architectural standards across TypeScript and Rust code.

## 🎯 What is ADP?

ADP is a comprehensive toolkit for enforcing sustainable software architecture patterns through:
- **Statistical Analysis**: Analyzes codebase patterns and identifies outliers
- **Complexity Metrics**: Measures cyclomatic complexity and cognitive load
- **Automated Recommendations**: Provides specific, actionable refactoring suggestions
- **Multi-Language Support**: Works with TypeScript, JavaScript, Rust, C#, and PowerShell

## 📦 Installation

ADP has been installed via GitHub repository:

```json
{
  "devDependencies": {
    "@architectural-discipline/cli": "github:plures/adp",
    "@architectural-discipline/core": "github:plures/adp",
    "@architectural-discipline/eslint-plugin": "github:plures/adp"
  }
}
```

## 🚀 Usage

### Analyze Codebase

```bash
# Run architectural analysis
npm run adp:analyze

# Get JSON output
npm run adp:check
```

### Get Recommendations

```bash
# Get refactoring recommendations
npm run adp:recommend
```

### ESLint Integration

ADP is integrated with ESLint via `eslint.config.js`. The following rules are enabled:

- `@architectural-discipline/max-lines`: Warns on files exceeding line limits
- `@architectural-discipline/max-complexity`: Warns on high complexity functions

## ⚙️ Configuration

Configuration is stored in `.adp-config.json`:

```json
{
  "architectural-discipline": {
    "version": "1.0.0",
    "languages": {
      "typescript": {
        "maxLines": 300,
        "maxComplexity": 10
      },
      "rust": {
        "maxLines": 500,
        "maxComplexity": 15
      }
    },
    "ignore": [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.svelte-kit/**",
      "**/target/**",
      "**/*.test.*",
      "**/*.spec.*"
    ]
  }
}
```

### Language-Specific Settings

- **TypeScript**: Max 300 lines per file, max complexity 10
- **Rust**: Max 500 lines per file, max complexity 15

### Ignored Paths

The following paths are excluded from analysis:
- `node_modules/` - Dependencies
- `dist/`, `build/` - Build outputs
- `.svelte-kit/` - SvelteKit cache
- `target/` - Rust build artifacts
- Test files (`.test.*`, `.spec.*`)

## 🔍 What Gets Analyzed

### TypeScript/JavaScript Files
- `.ts`, `.tsx`, `.js`, `.jsx` files in `src/`
- Complexity metrics
- Function purity
- File size
- Modularity

### Rust Files
- `.rs` files in `src-tauri/src/`
- Function complexity
- Module structure
- Code organization

## 📊 Understanding Results

### Analysis Output

When you run `npm run adp:analyze`, you'll see:

1. **Overall Metrics**: Health scores, maintainability, complexity
2. **Outliers**: Files that exceed thresholds
3. **Recommendations**: Specific refactoring suggestions

### Health Scores

- **0-30**: Needs significant refactoring
- **31-60**: Acceptable but could improve
- **61-80**: Good architectural health
- **81-100**: Excellent architectural health

## 🛠️ Integration with Development Workflow

### Pre-commit Checks

Consider adding ADP checks to your git hooks:

```bash
# .git/hooks/pre-commit
#!/bin/sh
npm run adp:check || exit 1
```

### CI/CD Integration

Add to your GitHub Actions workflows:

```yaml
- name: Run Architectural Analysis
  run: npm run adp:check
```

## 📚 Resources

- [ADP Repository](https://github.com/plures/adp)
- [ADP Documentation](https://github.com/plures/adp/blob/main/README.md)
- [Multi-Language Usage Guide](https://github.com/plures/adp/blob/main/docs/multi-language-usage.md)

## 💡 Best Practices

1. **Run Analysis Regularly**: Check architecture before major refactoring
2. **Address High-Priority Issues**: Focus on critical outliers first
3. **Incremental Improvement**: Don't try to fix everything at once
4. **Use Recommendations**: ADP provides specific, actionable suggestions
5. **Monitor Trends**: Track health scores over time

## 🐛 Troubleshooting

### "Command not found" Errors

If you see command not found errors:

```bash
# Reinstall dependencies
npm install

# Or use npx directly
npx @architectural-discipline/cli analyze
```

### ESLint Errors

If ESLint can't find ADP plugin:

```bash
# Ensure packages are installed
npm install

# Check eslint.config.js exists
cat eslint.config.js
```

### Analysis Takes Too Long

If analysis is slow:

1. Check `.adp-config.json` ignore patterns
2. Ensure build artifacts are excluded
3. Consider analyzing specific paths: `npm run adp:analyze -- --path src`

## ✅ Checklist

- [x] ADP packages installed
- [x] ESLint configured with ADP plugin
- [x] Configuration file created (`.adp-config.json`)
- [x] Scripts added to `package.json`
- [x] Documentation created
- [ ] First analysis run successfully
- [ ] Recommendations reviewed
- [ ] CI/CD integration (optional)

---

**Remember**: ADP helps maintain architectural discipline, but it's a tool to guide improvement, not a strict requirement. Use it to identify areas for improvement and make incremental progress.

