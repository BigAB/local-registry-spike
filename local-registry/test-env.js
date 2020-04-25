const { spawn, exec } = require('child_process');
const { promisify } = require('util');
const NodeEnvironment = require('jest-environment-node');
const getPort = require('get-port');
const getUrls = require('get-urls');

const asyncExec = promisify(exec);

class EnvironmentWithLocalRegistry extends NodeEnvironment {
  async setup() {
    await super.setup();
    this.global.localRegistry = await spawnLocalRegistry();
    process.env.npm_config_registry = this.global.localRegistry.url;
  }

  async teardown() {
    // kill the local registry
    this.global.localRegistry.process.kill();
    // delete the local registry store
    await asyncExec(`rm -rf local-registry/storage`);
    await super.teardown();
  }
}

async function spawnLocalRegistry() {
  const port = await getPort({ port: [4873, 4872, 4871] });
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

module.exports = EnvironmentWithLocalRegistry;
