
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import usageHandler from './api/cloudinary-usage';
import authHandler from './api/cloudinary-auth';

function createMockResponse(res: any) {
  return {
    statusCode: 200,
    headers: {} as Record<string, any>,
    setHeader(name: string, value: any) {
      this.headers[name] = value;
      res.setHeader(name, value);
    },
    status(code: number) {
      this.statusCode = code;
      res.statusCode = code;
      return this;
    },
    json(data: any) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.statusCode = this.statusCode;
      res.end(JSON.stringify(data));
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'cloudinary-api-dev',
      configureServer(server) {
        server.middlewares.use('/api/cloudinary-auth', (req, res) => {
          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', async () => {
            try {
              (req as any).body = bodyStr ? JSON.parse(bodyStr) : {};
            } catch {
              (req as any).body = {};
            }
            const mockRes = createMockResponse(res);
            await authHandler(req, mockRes);
          });
        });

        server.middlewares.use('/api/cloudinary-usage', async (req, res) => {
          const url = new URL(req.url || '', 'http://localhost');
          (req as any).query = { refresh: url.searchParams.get('refresh') };
          const mockRes = createMockResponse(res);
          await usageHandler(req, mockRes);
        });
      }
    }
  ],
});

