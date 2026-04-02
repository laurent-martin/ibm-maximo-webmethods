# IBM Maximo - webMethods Integration

Express + TypeScript server for IBM Maximo and webMethods integration.

## Installation

```bash
npm install
```

## Configuration

The server uses a YAML configuration file: [`server.yaml`](server.yaml:1)

```yaml
server:
  port: 3000
  
ibm:
  url: https://dev5312404.a-fra-c1.int.ipaas.automation.ibm.com/runflow/run/sync/v2/24KDxyQ2P6
  timeout: 30000  # Timeout in milliseconds
```

Modify this file to adapt the configuration to your environment.

## Usage

### Development mode

```bash
npm run dev
```

### Production mode

```bash
# 1. Compile TypeScript
npm run build

# 2. Start the compiled server
npm start
```

### Cleanup

```bash
npm run clean    # Removes the dist/ directory only
npm run clobber  # Removes everything generated (dist/, node_modules/, package-lock.json)
```

After `clobber`, you need to run `npm install` again.

**Note:** Commands must be executed from the `Form to initiate workflow/` directory.

## Access

- **Web interface**: <http://localhost:3000/index.html>
- **Create Request API**: <http://localhost:3000/api/create_request>
- **Config API**: <http://localhost:3000/api/config>

## Architecture

- **Single server** on port 3000
- **Express**: Modern web framework
- **CORS**: Automatic cross-origin request handling
- **TypeScript**: Strong typing and better maintainability
- **Axios**: Modern HTTP client for IBM requests

## Project Structure

```
Form to initiate workflow/
├── server.ts          # Main Express server (~65 lines)
├── server.yaml        # Configuration (port, IBM URL, timeout)
├── index.html         # Service request creation form
├── tsconfig.json      # TypeScript configuration
├── package.json       # Dependencies and npm scripts
├── .gitignore         # Files to ignore in Git
└── README.md          # This documentation
```

## Improvements vs Previous Version

✅ **Single server** instead of two (proxy + static)  
✅ **Single port** (3000) instead of two (3000 + 4000)  
✅ **Automatic CORS** via Express middleware  
✅ **TypeScript** for strong typing and maintainability  
✅ **Simplified code**: ~65 lines vs 110 lines (-41%)  
✅ **Externalized config**: YAML instead of hardcoded values  
✅ **Dynamic endpoint**: Displayed from config via API  
✅ **Improved error handling** with try/catch  
✅ **Modern API** with Axios instead of https.request  
✅ **Standardized npm scripts** (no more .bat files)  
✅ **HTML5 validation**: `required` attributes on fields  
✅ **Best practices**: HTML/CSS/JS separation, no inline code  
✅ **Git-ready**: Configured `.gitignore`  

## Technologies

- **Express 4.x** - Node.js web framework
- **TypeScript 5.x** - Typed superset of JavaScript
- **CORS** - Middleware for cross-origin requests
- **Axios** - Promise-based HTTP client
- **js-yaml** - YAML parser for configuration

## Compatibility

✅ **Cross-platform**: Windows, macOS, Linux  
✅ **Node.js**: Version 16+ recommended  
✅ **Browsers**: All modern browsers (Chrome, Firefox, Safari, Edge)
