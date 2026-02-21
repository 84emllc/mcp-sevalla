// Copyright (c) 2026 84EM LLC (https://84em.io). MIT License.

import { describe, it, expect, vi, afterEach } from 'vitest';
import { SevallaAPI } from '../../src/sevalla-api.js';
import { installFetchSpy } from '../helpers/fetch-spy.js';

const API_KEY = 'test-api-key';
const COMPANY_ID = 'test-company-id';

describe('networking write operations (dry-run)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('createInternalConnection sends POST with body', async () => {
    const { captured } = installFetchSpy({ connection: {} });
    const api = new SevallaAPI(API_KEY, COMPANY_ID);

    await api.createInternalConnection('app-1', {
      target_id: 'db-1',
      target_type: 'database',
    });

    expect(captured).toHaveLength(1);
    expect(captured[0].method).toBe('POST');
    expect(captured[0].url).toBe('https://api.sevalla.com/v2/applications/app-1/internal-connections');
    expect(captured[0].body).toEqual({ target_id: 'db-1', target_type: 'database' });
  });

  it('toggleCdn sends POST with enabled flag', async () => {
    const { captured } = installFetchSpy({ success: true });
    const api = new SevallaAPI(API_KEY, COMPANY_ID);

    await api.toggleCdn('app-1', true);

    expect(captured).toHaveLength(1);
    expect(captured[0].method).toBe('POST');
    expect(captured[0].url).toBe('https://api.sevalla.com/v2/applications/app-1/cdn/toggle-status');
    expect(captured[0].body).toEqual({ enabled: true });
  });

  it('toggleCdn with enabled=false', async () => {
    const { captured } = installFetchSpy({ success: true });
    const api = new SevallaAPI(API_KEY, COMPANY_ID);

    await api.toggleCdn('app-1', false);

    expect(captured[0].body).toEqual({ enabled: false });
  });

  it('toggleEdgeCache sends POST with enabled flag', async () => {
    const { captured } = installFetchSpy({ success: true });
    const api = new SevallaAPI(API_KEY, COMPANY_ID);

    await api.toggleEdgeCache('app-1', true);

    expect(captured).toHaveLength(1);
    expect(captured[0].method).toBe('POST');
    expect(captured[0].url).toBe('https://api.sevalla.com/v2/applications/app-1/edge-cache/toggle-status');
    expect(captured[0].body).toEqual({ enabled: true });
  });

  it('toggleEdgeCache with enabled=false', async () => {
    const { captured } = installFetchSpy({ success: true });
    const api = new SevallaAPI(API_KEY, COMPANY_ID);

    await api.toggleEdgeCache('app-1', false);

    expect(captured[0].body).toEqual({ enabled: false });
  });

  it('clearCache sends POST with no body', async () => {
    const { captured } = installFetchSpy({ success: true });
    const api = new SevallaAPI(API_KEY, COMPANY_ID);

    await api.clearCache('app-1');

    expect(captured).toHaveLength(1);
    expect(captured[0].method).toBe('POST');
    expect(captured[0].url).toBe('https://api.sevalla.com/v2/applications/app-1/clear-cache');
    expect(captured[0].body).toBeUndefined();
  });
});
