import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { join } from 'path';

// Configuration
interface Config {
    server: { port: number };
    ibm: { url: string; timeout: number };
}

const config = load(readFileSync(join(__dirname, 'server.yaml'), 'utf8')) as Config;

// Types
interface WorkOrderPayload {
    description: string;
    assetnum: string;
    location: string;
    reportedby: string;
    affectedpersonid: string;
    status: string;
    SITEID: string;
}

// App
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// Create service request route
app.post('/api/create_request', async (req: Request<{}, {}, WorkOrderPayload>, res: Response) => {
    try {
        const response = await axios.post(
            config.ibm.url,
            req.body,
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: config.ibm.timeout,
            }
        );

        console.log(`[${new Date().toISOString()}] ✓ ${response.status}`);
        res.status(response.status).json(response.data);
    } catch (error) {
        const status = axios.isAxiosError(error) ? error.response?.status || 502 : 500;
        const message = axios.isAxiosError(error) ? error.response?.data || error.message : 'Erreur inconnue';

        console.error(`[${new Date().toISOString()}] ✗ ${status}`);
        res.status(status).json({ error: message });
    }
});

// Config endpoint
app.get('/api/config', (req: Request, res: Response) => {
    res.json({ endpoint: config.ibm.url });
});

// Start
app.listen(config.server.port, () => {
    console.log(`\n✅ http://localhost:${config.server.port}`);
    console.log(`   → ${config.ibm.url}\n`);
});
