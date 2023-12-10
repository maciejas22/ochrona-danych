import buildServer from './server';

const server = buildServer();

(async () => {
  try {
    await server.listen({ port: 3000, host: '127.0.0.1' });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
