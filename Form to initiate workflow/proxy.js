// proxy.js — Run with: node proxy.js
// Then open work_order_form.html in your browser

const http = require('http');
const https = require('https');

const PORT = 3000;
const TARGET = 'https://dev5312404.a-fra-c1.int.ipaas.automation.ibm.com';
const TARGET_PATH = '/runflow/run/sync/v2/24KDxyQ2P6';

const server = http.createServer((req, res) => {
  // Allow all origins (file://, localhost, etc.)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405);
    res.end('Method Not Allowed');
    return;
  }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    const options = {
      hostname: 'dev5312404.a-fra-c1.int.ipaas.automation.ibm.com',
      path: TARGET_PATH,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const proxy = https.request(options, (ibmRes) => {
      let data = '';
      ibmRes.on('data', chunk => data += chunk);
      ibmRes.on('end', () => {
        res.writeHead(ibmRes.statusCode, { 'Content-Type': 'application/json' });
        res.end(data);
        console.log(`[${new Date().toISOString()}] → IBM ${ibmRes.statusCode} | ${data.slice(0, 120)}`);
      });
    });

    proxy.on('error', (err) => {
      console.error('Proxy error:', err.message);
      res.writeHead(502);
      res.end(JSON.stringify({ error: err.message }));
    });

    proxy.write(body);
    proxy.end();
  });
});

server.listen(PORT, () => {
  console.log(`\n✅ Proxy running at http://localhost:${PORT}`);
  console.log(`   Forwarding POST → ${TARGET}${TARGET_PATH}`);
  console.log(`   Open work_order_form.html in your browser\n`);
});
