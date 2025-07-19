import { testkubePlugin } from './plugin';

describe('testkube', () => {
  it('should export plugin', () => {
    expect(testkubePlugin).toBeDefined();
  });
});
