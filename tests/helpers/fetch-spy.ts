// Copyright (c) 2026 84EM LLC (https://84em.io). MIT License.

import { vi } from 'vitest';

export interface CapturedRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: unknown;
}

export function createFetchSpy(responseBody: unknown = {}, status = 200) {
  const captured: CapturedRequest[] = [];

  const spy = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    const method = init?.method ?? 'GET';
    const headers = init?.headers as Record<string, string> ?? {};
    const body = init?.body ? JSON.parse(init.body as string) : undefined;

    captured.push({ url, method, headers, body });

    return new Response(
      status === 204 ? null : JSON.stringify(responseBody),
      {
        status,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  });

  return { spy, captured };
}

export function installFetchSpy(responseBody: unknown = {}, status = 200) {
  const result = createFetchSpy(responseBody, status);
  vi.stubGlobal('fetch', result.spy);
  return result;
}
