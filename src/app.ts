import buildServer from './server';

(async () => {
  const server = await buildServer();

  try {
    await server.listen({ port: server.config.PORT, host: server.config.HOST });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
