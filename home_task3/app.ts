import express from 'express';

const PORT = 3002;

async function startServer() {
  const app = express();

  await require('./routers').default(app);

  app.listen(PORT, async () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
  });
}

startServer();
