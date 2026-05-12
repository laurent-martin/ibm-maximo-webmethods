# IBM Maximo - webMethods Integration

Express + TypeScript server for IBM Maximo and webMethods integration.

Display a form to create a Service Request that triggers a workflow in webMethods.

## Configuration

The server uses a YAML configuration file: [`server.yaml`](server.yaml:1)

```yaml
local:
  port: 3000
  
webMethods:
  url: https://dev5312404.a-fra-c1.int.ipaas.automation.ibm.com/runflow/run/sync/v2/24KDxyQ2P6
  timeout: 30000  # Timeout in milliseconds
```

Modify this file to adapt the configuration to your environment.

## Usage

### Development mode

```bash
npm install
npm run dev
```

### Production mode

1. Compile TypeScript
2. Start the compiled server

```bash
npm install
npm run build

npm start
```

### Cleanup

```bash
npm run clean    # Removes the dist/ directory only
npm run clobber  # Removes everything generated (dist/, node_modules/, package-lock.json)
```

After `clobber`, you need to run `npm install` again.

> [!NOTE]
> Commands must be executed from the `Form to initiate workflow/` directory.
