// fix-oas.js
const fs = require('fs');
const file = process.argv[2];
const indent = undefined;
//const indent = 2;
if (!file) { console.error('Usage: node fix-oas.js <file>'); process.exit(1); }

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
          .replace(' a ', '')
          .replace(/ (for|with) id { ?id ?}/, '')
          .replace('(paged)', 'Paged')
          .replace(' collection of ', '')
          .replace(' for App.', 'App')
          .replace(' fo ID.', '')
          .replaceAll('.', '')
          .replaceAll(' ', '');
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
