import express from 'express';

const PORT = 3002;

async function startServer() {
  const app = express();

  await require('./routers').default(app);

  app.listen(PORT, async () => {
    try {
      // await dbConnection.authenticate();
      // console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
  });
}

startServer();
