export async function withRetry<T>(
  action: () => Promise<T>,
  options: { retries: number; delayMs: number }
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= options.retries; attempt += 1) {
    try {
      return await action();
    } catch (error) {
      lastError = error;
      if (attempt === options.retries) break;
      await new Promise((resolve) => setTimeout(resolve, options.delayMs * (attempt + 1)));
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}
