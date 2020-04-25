/**
 * @jest-environment ./local-registry/test-env.js
 */
const { exec } = require('child_process');
const { promisify } = require('util');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const asyncExec = promisify(exec);
const rmrf = promisify(rimraf);

describe('using this modules cli from npx', () => {
  beforeAll(() => asyncExec(`npm publish`));
  test('publish the package and use it with npx', async () => {
    const expected = 'Hello World\n';

    const stdio = await asyncExec(`npx @bigab/local-registry-spike`);
    const actual = stdio.stdout.toString();

    expect(actual).toBe(expected);
  });
});
