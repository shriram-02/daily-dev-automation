const secretPatterns = [
  /gh[pousr]_[A-Za-z0-9_]{36,255}/,
  /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/,
  /(api[_-]?key|token|secret|password)\s*[:=]\s*['"][A-Za-z0-9_-]{20,}['"]/i
];

export function assertNoSecrets(content: string, fileName: string): void {
  for (const pattern of secretPatterns) {
    if (pattern.test(content)) {
      throw new Error(`Potential secret detected before writing ${fileName}`);
    }
  }
}
