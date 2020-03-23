const { exec } = require('child_process');
const { promisify } = require('util');

const asyncExec = promisify(exec);

module.exports = async function teardown(globalConfig) {
  global.localRegistry.process.kill();
  console.log('\n' + `Local registry stopped`);
  await asyncExec(`rm -rf local-registry/storage`);
  console.log('Local registry storage purged');
};
