import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { join } from 'path';

// Configuration file
interface Config {
    local: { port: number };
    webMethods: { url: string; timeout: number };
}

const config = load(readFileSync(join(__dirname, 'server.yaml'), 'utf8')) as Config;

// Data received from form
interface WorkOrderPayload {
    description: string;
    assetnum: string;
    location: string;
    reportedby: string;
    affectedpersonid: string;
    status: string;
    SITEID: string;
}

// Init web server
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// Create service request route
app.post('/api/create_request', async (req: Request<{}, {}, WorkOrderPayload>, res: Response) => {
    try {
        const response = await axios.post(
            config.webMethods.url,
            req.body,
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: config.webMethods.timeout,
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

// Get config route
app.get('/api/config', (req: Request, res: Response) => {
    res.json({ endpoint: config.webMethods.url });
});

// Start
app.listen(config.local.port, () => {
    console.log(`webMethods: ${config.webMethods.url}\n`);
    console.log(`\n✅ Open web browser on: http://localhost:${config.local.port}`);
});
