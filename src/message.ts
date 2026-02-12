import type { IncomingMessage, ServerResponse } from 'http';

export function buildSuccessMessage(req: IncomingMessage, res: ServerResponse, responseTime: number): string {
  return `[Http] ${req.method} ${req.url} ${res.statusCode} (${responseTime}ms)`;
}

export function buildErrorMessage(req: IncomingMessage, res: ServerResponse): string {
  return `[Http] ${req.method} ${req.url} ${res.statusCode}`;
}
