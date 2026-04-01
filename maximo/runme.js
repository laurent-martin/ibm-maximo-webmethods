#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const base_file = process.argv[2] || 'api/oas';
const indent = process.argv[3];
if (process.argv[2] === '-h') { console.error('Usage: node fix-oas.js [file base] [indent]'); process.exit(1); }

// Helper to run commands and log them
const run = (cmd) => {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
};

const rm_f = (file) => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
};

const fix_maximo_api = (file) => {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  // 1. Remove trailing slash from server URLs
  if (data.servers) {
    data.servers.forEach(s => {
      s.url = s.url.replace(/\/$/, '');
    });
  }
  // 2. Add operationId where missing
  for (const [path, item] of Object.entries(data.paths || {})) {
    for (const [method, info] of Object.entries(item)) {
      if (info && typeof info === 'object' && !info.operationId) {
        if (typeof info.summary == 'string' && info.summary.includes(' ') && !info.summary.includes('Object Structure name.')) {
          info.operationId = info.summary
            .replace(' a ', ' ')
            .replace(' new ', ' ')
            .replace(/ (for|with) id { ?id ?}/, '')
            .replace('(paged)', 'Paged')
            .replace(' collection of ', ' ')
            .replace(' for App.', 'App')
            .replace(' fo ID.', '')
            .replace('MXAPI', '')
            .replaceAll('.', '')
            .replaceAll(' ', '')
            .replace('GetPaged', 'List');
          if (info.operationId.includes('FetchUIText') && path.startsWith('/ba'))
            info.operationId = info.operationId + 'BA'
          if (info.operationId == 'AutomationScriptname')
            info.operationId = (method === 'get' ? 'Get' : 'Create') + info.operationId
        }
        else
          info.operationId = method.toLowerCase() + path
            .replace(/^\//, '')
            .replace(/\{([^}]+)\}/g, (_, p) => 'By' + p[0].toUpperCase() + p.slice(1))
            .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
            .replace(/[^a-zA-Z0-9]/g, '');
        item[method] = { operationId: info.operationId, ...info };
        //console.log(`>>> ${method} ${path}`, info.operationId)
      }
    }
  }
  // 3. Fix enum type mismatch in components/parameters
  for (const [name, param] of Object.entries(data.components?.parameters || {})) {
    const schema = param.schema;
    if (schema?.type === 'integer') {
      if (Array.isArray(schema.enum)) {
        schema.enum = schema.enum.map(v => typeof v === 'string' ? parseInt(v, 10) : v);
      }
      if (typeof schema.default === 'string') {
        schema.default = parseInt(schema.default, 10);
        if (Number.isNaN(schema.default)) {
          throw new Error(`Invalid integer default value for: ${name}`);
        }
      }
    }
  }
  fs.writeFileSync(file, JSON.stringify(data, null, indent));
  console.log(`Fixed: ${file}`);
};

try {
  run(`redocly bundle ${base_file}.json -o ${base_file}.yaml`);
  run(`redocly bundle ${base_file}.json --ext json -o ${base_file}.tmp.json`);
  run(`redocly bundle ${base_file}.tmp.json --remove-unused-components --ext json -o ${base_file}.small.json`);
  rm_f(`${base_file}.tmp.json`);
  fix_maximo_api(`${base_file}.small.json`);
  run(`redocly lint ${base_file}.small.json`);
  run(`redocly bundle ${base_file}.small.json -o ${base_file}.small.yaml`);
  //ls - alh ${base_file}.small.json
  const stats = fs.statSync(`${base_file}.small.json`);
  const size = (stats.size / 1024).toFixed(2);
  console.log(`\n✅ Done! Final file: ${base_file}.small.json (${size} KB)`);
} catch (err) {
  console.error('Build failed');
  process.exit(1);
}
