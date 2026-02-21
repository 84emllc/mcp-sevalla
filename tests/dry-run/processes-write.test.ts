// Copyright (c) 2026 84EM LLC (https://84em.io). MIT License.

import { describe, it, expect, vi, afterEach } from 'vitest';
import { SevallaAPI } from '../../src/sevalla-api.js';
import { installFetchSpy } from '../helpers/fetch-spy.js';

const API_KEY = 'test-api-key';
const COMPANY_ID = 'test-company-id';

describe('processes write operations (dry-run)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('getProcess sends GET with company query param', async () => {
    const { captured } = installFetchSpy({ process: { id: 'proc-1' } });
    const api = new SevallaAPI(API_KEY, COMPANY_ID);

    await api.getProcess('proc-1');

    expect(captured).toHaveLength(1);
    expect(captured[0].method).toBe('GET');
    expect(captured[0].url).toContain('/applications/processes/proc-1');
    expect(captured[0].url).toContain(`company=${COMPANY_ID}`);
  });

  it('updateProcess sends PUT with correct URL and body', async () => {
    const { captured } = installFetchSpy({ process: { id: 'proc-1' } });
    const api = new SevallaAPI(API_KEY, COMPANY_ID);

    await api.updateProcess('proc-1', { replicas: 3, pod_size: 'medium' });

    expect(captured).toHaveLength(1);
    expect(captured[0].method).toBe('PUT');
    expect(captured[0].url).toBe('https://api.sevalla.com/v2/applications/processes/proc-1');
    expect(captured[0].body).toEqual({ replicas: 3, pod_size: 'medium' });
  });

  it('updateProcess with only replicas', async () => {
    const { captured } = installFetchSpy({ process: { id: 'proc-1' } });
    const api = new SevallaAPI(API_KEY, COMPANY_ID);

    await api.updateProcess('proc-1', { replicas: 5 });

    expect(captured[0].body).toEqual({ replicas: 5 });
  });
});
