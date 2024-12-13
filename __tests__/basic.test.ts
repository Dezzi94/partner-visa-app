import { describe, it, expect } from '@jest/globals';

describe('Basic Jest Setup', () => {
  it('should run a simple test', () => {
    expect(2 + 2).toBe(4);
  });

  it('should handle string operations', () => {
    expect('hello').toEqual('hello');
    expect('hello world').toContain('world');
  });

  it('should handle arrays', () => {
    const array = [1, 2, 3];
    expect(array).toHaveLength(3);
    expect(array).toContain(2);
  });
}); 