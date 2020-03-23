const { spawn } = require('child_process');
const getUrls = require('get-urls');

async function spawnLocalRegistry() {
  const port = process.env.E2E_LOCAL_REGISTRY_PORT || 4872;
  const localRegistryProcess = spawn('npx', [
    'verdaccio',
    '--config',
    './local-registry/config.yml',
    '--listen',
    `${port}`,
  ]);
  const localRegistryUrl = await new Promise((res, rej) => {
    localRegistryProcess.stdout.on('data', (data) => {
      // wait for local-registry to come online
      if (data.includes('http address')) {
        const localRegistry = [...getUrls(data.toString())][0];
        res(localRegistry);
      }
    });
  });
  return {
    process: localRegistryProcess,
    url: localRegistryUrl,
  };
}

module.exports = async function setup(globalConfig) {
  global.localRegistry = await spawnLocalRegistry();
  console.log(
    '\n\n' + `Local registry started at ${global.localRegistry.url}` + '\n'
  );
  process.env.E2E_LOCAL_REGISTRY_URL = global.localRegistry.url;
  process.env.npm_config_registry = global.localRegistry.url;
};
