/**
 * @jest-environment ./local-registry/test-env.js
 */
const { execSync } = require('child_process');

beforeAll(() => execSync(`npm publish --registry ${global.localRegistry.url}`));

describe('a test that requires the local-registry', () => {
  test('publish the package and use it with npx', () => {
    const expected = 'Hello Adam\n';

    const actual = execSync(
      `NPM_CONFIG_REGISTRY=${global.localRegistry.url} npx @bigab/local-registry-spike`
    ).toString();

    expect(actual).toBe(expected);
  });
});
