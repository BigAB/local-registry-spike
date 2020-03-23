const { execAsync, publishToLocalRegistry } = require('../local-registry/util');

beforeAll(() => publishToLocalRegistry());

describe('a test that requires the local-registry', () => {
  test('publish the package and use it with npx', async () => {
    const expected = 'Hello Adam\n';

    const output = await execAsync(`npx @bigab/local-registry-spike`);

    expect(output).toBe(expected);
  });
});
