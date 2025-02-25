import type {Express} from 'express';
import {type Server} from 'http';
import express from 'express';
import cors from 'cors';
import IPRouter from './routes/ip';
import WindowRouter from './routes/window';
import ProfilesRouter from './routes/profiles';
import ProxyRouter from './routes/proxy';

const app: Express = express();
let port: number = 2018; // 初始端口

app.use(cors());
app.use(express.json());

app.use('/ip', IPRouter);
app.use('/window', WindowRouter);
app.use('/profiles', ProfilesRouter);
app.use('/proxy', ProxyRouter);

app.get('/status', async (req, res) => {
  res.send({
    status: 'ok',
    port,
  });
});

// 添加全局错误处理
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Express error:', err);
  if (!res.headersSent) {
    res.status(500).json({error: 'Internal server error'});
  }
  next(err);
});

// 处理未捕获的 Promise 拒绝
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const server: Server = app
  .listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    module.exports.port = port;
  })
  .on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.log(`Port ${port} is already in use, trying another port...`);
      port++;
      server.close();
      server.listen(port);
    } else if (error.code === 'EACCES') {
      console.error(`Port ${port} requires elevated privileges`);
      port++;
      server.close();
      server.listen(port);
    } else {
      console.error(error);
    }
  });

export const getPort = () => port;

export const getOrigin = () => `http://localhost:${port}`;

// ... 其他的 Express 配置和路由 ...

export function createServer() {
  // ... existing code ...
  // 移除任何使用 getNativeAddon 的代码
  // ... existing code ...
}
