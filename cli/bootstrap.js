#!/usr/bin/env node

/**
 * Bootstrap CLI - Create new projects from template
 * 
 * Usage: node cli/bootstrap.js <project-name> [options]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const TEMPLATE_DIR = path.join(__dirname, '../template');
const PLUGINS_DIR = path.join(__dirname, '../plugins');
const EXAMPLES_DIR = path.join(__dirname, '../examples');

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ ${message}`, 'red');
  process.exit(1);
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function info(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function question(rl, query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function loadConfig() {
  const manifestPath = path.join(TEMPLATE_DIR, 'config/manifest.json');
  const placeholdersPath = path.join(TEMPLATE_DIR, 'config/placeholders.json');
  
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const placeholders = JSON.parse(fs.readFileSync(placeholdersPath, 'utf-8'));
  
  return { manifest, placeholders };
}

async function collectProjectInfo(placeholders) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const info = {};

  log('\n📋 Project Information', 'bright');
  log('='.repeat(50), 'cyan');

  for (const [key, config] of Object.entries(placeholders.placeholders)) {
    const prompt = `${config.description}${config.default ? ` [${config.default}]` : ''}: `;
    let answer = await question(rl, prompt);
    
    if (!answer && config.default) {
      answer = config.default;
    }
    
    if (!answer && config.required) {
      error(`${key} is required`);
    }
    
    if (config.validation && answer) {
      const regex = new RegExp(config.validation);
      if (!regex.test(answer)) {
        error(`Invalid format for ${key}`);
      }
    }
    
    info[key] = answer;
  }

  rl.close();
  return info;
}

async function selectPlugins(manifest) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const selectedPlugins = [...manifest.plugins.required];
  
  if (manifest.plugins.optional.length > 0) {
    log('\n🔌 Available Plugins', 'bright');
    log('='.repeat(50), 'cyan');
    
    manifest.plugins.optional.forEach((plugin, index) => {
      log(`${index + 1}. ${plugin}`, 'yellow');
    });
    
    const answer = await question(rl, '\nSelect plugins to include (comma-separated numbers, or press Enter for none): ');
    
    if (answer.trim()) {
      const indices = answer.split(',').map(n => parseInt(n.trim()) - 1);
      indices.forEach(index => {
        if (index >= 0 && index < manifest.plugins.optional.length) {
          selectedPlugins.push(manifest.plugins.optional[index]);
        }
      });
    }
    
    rl.close();
  }

  return selectedPlugins;
}

function replacePlaceholders(content, placeholders) {
  let result = content;
  for (const [key, value] of Object.entries(placeholders)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, value);
  }
  return result;
}

function copyTemplate(src, dest, placeholders) {
  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    files.forEach(file => {
      if (file === 'node_modules' || file === '.git' || file === 'target') {
        return; // Skip these directories
      }
      
      copyTemplate(
        path.join(src, file),
        path.join(dest, file),
        placeholders
      );
    });
  } else {
    let content = fs.readFileSync(src, 'utf-8');
    content = replacePlaceholders(content, placeholders);
    fs.writeFileSync(dest, content, 'utf-8');
  }
}

async function installPlugins(projectDir, plugins) {
  for (const pluginName of plugins) {
    const pluginDir = path.join(PLUGINS_DIR, pluginName);
    
    if (!fs.existsSync(pluginDir)) {
      info(`Plugin ${pluginName} not found, skipping...`);
      continue;
    }
    
    const installScript = path.join(pluginDir, 'install.js');
    if (fs.existsSync(installScript)) {
      info(`Installing plugin: ${pluginName}...`);
      // Run plugin installation script
      const { default: install } = await import(`file://${installScript}`);
      if (typeof install === 'function') {
        await install(projectDir);
      }
    } else {
      info(`Plugin ${pluginName} has no install script, copying files...`);
      copyTemplate(pluginDir, projectDir, {});
    }
  }
}

async function bootstrap(projectName) {
  try {
    log('\n🚀 Bootstrap New Project', 'bright');
    log('='.repeat(50), 'cyan');
    
    // Load configuration
    const { manifest, placeholders } = await loadConfig();
    
    // Collect project information
    const projectInfo = await collectProjectInfo(placeholders);
    
    // Select plugins
    const selectedPlugins = await selectPlugins(manifest);
    
    // Prepare placeholders
    const allPlaceholders = {
      ...projectInfo,
      PROJECT_NAME_SLUG: projectInfo.PROJECT_NAME.toLowerCase().replace(/\s+/g, '-'),
      PROJECT_NAME_CAMEL: projectInfo.PROJECT_NAME.replace(/\s+(.)/g, (_, c) => c.toUpperCase()).replace(/\s/g, ''),
      YEAR: new Date().getFullYear().toString()
    };
    
    // Create project directory
    const projectDir = path.join(process.cwd(), projectName);
    if (fs.existsSync(projectDir)) {
      error(`Directory ${projectName} already exists`);
    }
    
    info(`Creating project: ${projectName}...`);
    fs.mkdirSync(projectDir, { recursive: true });
    
    // Copy template files
    info('Copying template files...');
    copyTemplate(TEMPLATE_DIR, projectDir, allPlaceholders);
    
    // Install plugins
    if (selectedPlugins.length > 0) {
      info(`Installing ${selectedPlugins.length} plugin(s)...`);
      await installPlugins(projectDir, selectedPlugins);
    }
    
    // Create .gitignore if it doesn't exist
    const gitignorePath = path.join(projectDir, '.gitignore');
    if (!fs.existsSync(gitignorePath)) {
      const defaultGitignore = `node_modules/
.svelte-kit/
build/
dist/
.DS_Store
*.log
.env
.env.local
target/
*.pdb
`;
      fs.writeFileSync(gitignorePath, defaultGitignore);
    }
    
    success(`Project ${projectName} created successfully!`);
    
    log('\n📝 Next Steps:', 'bright');
    log(`  cd ${projectName}`, 'cyan');
    log('  npm install', 'cyan');
    log('  npm run dev', 'cyan');
    log('\n📚 Documentation:', 'bright');
    log('  See docs/USAGE.md for more information', 'cyan');
    
  } catch (err) {
    error(`Bootstrap failed: ${err.message}`);
    console.error(err);
  }
}

// Main execution
const projectName = process.argv[2];

if (!projectName) {
  error('Usage: node cli/bootstrap.js <project-name>');
}

bootstrap(projectName);

