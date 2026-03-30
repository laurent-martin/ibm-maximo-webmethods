// fix-oas.js
const fs = require('fs');
const file = process.argv[2];
if (!file) { console.error('Usage: node fix-oas.js <file>'); process.exit(1); }

const data = JSON.parse(fs.readFileSync(file, 'utf8'));

// 1. Remove trailing slash from server URLs
if (data.servers) {
  data.servers.forEach(s => {
    s.url = s.url.replace(/\/$/, '');
  });
}

// 2. Add operationId where missing
function pathToId(method, path) {
  return method.toLowerCase() + path
    .replace(/^\//, '')
    .replace(/\{([^}]+)\}/g, (_, p) => 'By' + p[0].toUpperCase() + p.slice(1))
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');
}
for (const [path, item] of Object.entries(data.paths || {})) {
  for (const method of ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']) {
    if (item[method] && !item[method].operationId) {
      item[method].operationId = pathToId(method, path);
    }
  }
}

// 3. Fix enum type mismatch in components/parameters
for (const param of Object.values(data.components?.parameters || {})) {
  const schema = param.schema;
  if (schema?.type === 'integer' && Array.isArray(schema.enum)) {
    schema.enum = schema.enum.map(v => typeof v === 'string' ? parseInt(v, 10) : v);
  }
}

fs.writeFileSync(file, JSON.stringify(data));
console.log(`Fixed: ${file}`);
