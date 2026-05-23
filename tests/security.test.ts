import { describe, expect, it } from 'vitest';
import path from 'node:path';
import { assertNoSecrets } from '../src/security/secretGuard.js';
import { resolveSafePath } from '../src/security/safePaths.js';

describe('safe paths', () => {
  it('allows configured output roots', () => {
    const root = path.resolve('repo');
    expect(resolveSafePath(root, 'docs/daily-notes.md')).toBe(
      path.resolve(root, 'docs/daily-notes.md')
    );
  });

  it('rejects path traversal', () => {
    expect(() => resolveSafePath('/repo', '../secret.txt')).toThrow(/Unsafe output path/);
  });

  it('rejects disallowed roots', () => {
    expect(() => resolveSafePath('/repo', 'src/generated.ts')).toThrow(/outside allowed/);
  });
});

describe('secret guard', () => {
  it('rejects likely GitHub tokens', () => {
    expect(() =>
      assertNoSecrets('token="ghp_abcdefghijklmnopqrstuvwxyzABCDEFGHIJ"', 'example.md')
    ).toThrow(/Potential secret/);
  });

  it('allows normal documentation', () => {
    expect(() =>
      assertNoSecrets('Use least privilege for automation.', 'example.md')
    ).not.toThrow();
  });
});
