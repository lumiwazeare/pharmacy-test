import server from './server';

(async (): Promise<void> => {
  const app = await server();

  await app.start();
  app.log(`App started.... runninng on ${app.info.uri}`);
})();
