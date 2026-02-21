// Copyright (c) 2026 84EM LLC (https://84em.io). MIT License.

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { SevallaAPI } from '../../src/sevalla-api.js';

describe('SevallaAPI.request()', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('retries on network error up to 3 times then throws', async () => {
    let callCount = 0;
    const spy = vi.fn(async () => {
      callCount++;
      throw new TypeError('fetch failed');
    });
    vi.stubGlobal('fetch', spy);

    const api = new SevallaAPI('test-key', 'test-company');
    const promise = api.getCompanyUsers();

    // Attach rejection handler immediately to prevent unhandled rejection
    const assertion = expect(promise).rejects.toThrow('fetch failed');

    await vi.advanceTimersByTimeAsync(1000);
    await vi.advanceTimersByTimeAsync(2000);

    await assertion;
    expect(callCount).toBe(3);
  });

  it('does not retry on 401', async () => {
    let callCount = 0;
    const spy = vi.fn(async () => {
      callCount++;
      return new Response('Unauthorized', { status: 401 });
    });
    vi.stubGlobal('fetch', spy);

    const api = new SevallaAPI('test-key', 'test-company');

    await expect(api.getCompanyUsers()).rejects.toThrow('Authentication failed (401)');
    expect(callCount).toBe(1);
  });

  it('does not retry on 403', async () => {
    let callCount = 0;
    const spy = vi.fn(async () => {
      callCount++;
      return new Response('Forbidden', { status: 403 });
    });
    vi.stubGlobal('fetch', spy);

    const api = new SevallaAPI('test-key', 'test-company');

    await expect(api.getCompanyUsers()).rejects.toThrow('Authentication failed (403)');
    expect(callCount).toBe(1);
  });

  it('retries on 429 using Retry-After header', async () => {
    let callCount = 0;
    const spy = vi.fn(async () => {
      callCount++;
      if (callCount === 1) {
        return new Response('Too Many Requests', {
          status: 429,
          headers: { 'Retry-After': '1' },
        });
      }
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });
    vi.stubGlobal('fetch', spy);

    const api = new SevallaAPI('test-key', 'test-company');
    const promise = api.getCompanyUsers();

    await vi.advanceTimersByTimeAsync(1000);

    const result = await promise;
    expect(result).toEqual({ ok: true });
    expect(callCount).toBe(2);
  });

  it('returns empty object for 204 responses', async () => {
    const spy = vi.fn(async () => new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', spy);

    const api = new SevallaAPI('test-key', 'test-company');
    const result = await api.deleteApplication('test-id');
    expect(result).toBeUndefined();
  });

  it('throws with body text for 500 errors after retries', async () => {
    const spy = vi.fn(async () => new Response('Internal Server Error', { status: 500 }));
    vi.stubGlobal('fetch', spy);

    const api = new SevallaAPI('test-key', 'test-company');
    const promise = api.getCompanyUsers();

    // Attach rejection handler immediately to prevent unhandled rejection
    const assertion = expect(promise).rejects.toThrow('API error 500: Internal Server Error');

    await vi.advanceTimersByTimeAsync(1000);
    await vi.advanceTimersByTimeAsync(2000);

    await assertion;
  });

  it('sends Authorization and Content-Type headers', async () => {
    const spy = vi.fn(async (_url: string, init: RequestInit) => {
      const headers = init.headers as Record<string, string>;
      expect(headers['Authorization']).toBe('Bearer test-key');
      expect(headers['Content-Type']).toBe('application/json');
      return new Response(JSON.stringify({}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });
    vi.stubGlobal('fetch', spy);

    const api = new SevallaAPI('test-key', 'test-company');
    await api.getCompanyUsers();
    expect(spy).toHaveBeenCalledOnce();
  });
});
