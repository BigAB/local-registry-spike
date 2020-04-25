const startServer = require('verdaccio').default;

const configJsonFormat = {
  uplinks: {
    npmjs: {
      url: 'https://registry.npmjs.org/',
      cache: false,
    },
  },
  packages: {
    '@*/*': {
      access: '$all',
      publish: '$all',
      unpublish: '$all',
      proxy: 'npmjs',
    },
    '**': {
      access: '$all',
      publish: '$all',
      unpublish: '$all',
      proxy: 'npmjs',
    },
  },
  logs: [
    {
      type: 'stdout',
      format: 'pretty',
      level: 'http',
    },
  ],
};

async function spawnLocalRegistry(port) {
  const storage = `./local-registry/storage/${port}`;
  startServer(
    {
      ...configJsonFormat,
      storage,
    },
    port,
    'local-registry/storage',
    '1.0.0',
    'Local Registry Test Env',
    (webServer, addrs, pkgName, pkgVersion) => {
      console.log(addrs, pkgName, pkgVersion);
      webServer.listen(addrs.port || addrs.path, addrs.host, () => {
        console.log('verdaccio running');
      });
    }
  );
}

spawnLocalRegistry('4872');
spawnLocalRegistry('4871');
spawnLocalRegistry('4870');
