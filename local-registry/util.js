const { exec } = require('child_process');
const { promisify } = require('util');

const aExec = promisify(exec);

module.exports.publishToLocalRegistry = async (
  path = null,
  { debug = false } = {}
) => {
  const output = await aExec(`npm publish`, {
    cwd: path,
    // this is basically to ignore the error where you can't publish the same thing twice
    stdio: ['pipe', 'pipe', debug ? 'pipe' : 'ignore'],
  }).catch(() => {});
  return output;
};

module.exports.unpublishFromLocalRegistry = async (
  path = null,
  { debug = false } = {}
) => {
  const output = await aExec(`npm unpublish`, {
    cwd: path,
    // this is basically to ignore the error where you can't publish the same thing twice
    stdio: ['pipe', 'pipe', debug ? 'pipe' : 'ignore'],
  }).catch(() => {});
  return output;
};

module.exports.execAsync = async (command, options) => {
  const { stdout } = await aExec(command, options);
  return stdout.toString();
};
