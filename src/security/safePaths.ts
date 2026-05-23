import fs from 'node:fs/promises';
import path from 'node:path';

const allowedRoots = ['README.md', 'docs', 'data', 'dashboard'];

function assertAllowedRelativePath(relativePath: string): void {
  if (path.isAbsolute(relativePath)) {
    throw new Error(`Absolute output paths are not allowed: ${relativePath}`);
  }
  const normalized = relativePath.replaceAll('\\', '/');
  if (normalized.includes('\0') || normalized.split('/').includes('..')) {
    throw new Error(`Unsafe output path rejected: ${relativePath}`);
  }
  const firstSegment = normalized.split('/')[0];
  if (!firstSegment || !allowedRoots.includes(firstSegment)) {
    throw new Error(`Output path is outside allowed automation roots: ${relativePath}`);
  }
}

export function resolveSafePath(workspaceRoot: string, relativePath: string): string {
  assertAllowedRelativePath(relativePath);
  const resolved = path.resolve(workspaceRoot, relativePath);
  const rootWithSeparator = workspaceRoot.endsWith(path.sep)
    ? workspaceRoot
    : `${workspaceRoot}${path.sep}`;
  if (resolved !== workspaceRoot && !resolved.startsWith(rootWithSeparator)) {
    throw new Error(`Path traversal rejected: ${relativePath}`);
  }
  return resolved;
}

export async function writeFileIfChanged(
  workspaceRoot: string,
  relativePath: string,
  content: string
): Promise<boolean> {
  const target = resolveSafePath(workspaceRoot, relativePath);
  await fs.mkdir(path.dirname(target), { recursive: true });
  let existing: string | undefined;
  try {
    existing = await fs.readFile(target, 'utf8');
  } catch {
    existing = undefined;
  }
  if (existing === content) return false;
  await fs.writeFile(target, content, { encoding: 'utf8', flag: 'w' });
  return true;
}
