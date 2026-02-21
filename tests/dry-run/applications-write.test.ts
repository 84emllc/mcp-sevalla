// Copyright (c) 2026 84EM LLC (https://84em.io). MIT License.

import { describe, it, expect, vi, afterEach } from 'vitest';
import { SevallaAPI } from '../../src/sevalla-api.js';
import { installFetchSpy } from '../helpers/fetch-spy.js';

const API_KEY = 'test-api-key';
const COMPANY_ID = 'test-company-id';

describe('applications write operations (dry-run)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('updateApplication sends PUT with correct URL and body', async () => {
    const { captured } = installFetchSpy({ app: { id: 'app-1' } });
    const api = new SevallaAPI(API_KEY, COMPANY_ID);

    await api.updateApplication('app-1', { display_name: 'New Name' });

    expect(captured).toHaveLength(1);
    expect(captured[0].method).toBe('PUT');
    expect(captured[0].url).toBe('https://api.sevalla.com/v2/applications/app-1');
    expect(captured[0].body).toEqual({ display_name: 'New Name' });
    expect(captured[0].headers['Authorization']).toBe(`Bearer ${API_KEY}`);
    expect(captured[0].headers['Content-Type']).toBe('application/json');
  });

  it('deleteApplication sends DELETE with company query param', async () => {
    const { captured } = installFetchSpy({}, 204);
    const api = new SevallaAPI(API_KEY, COMPANY_ID);

    await api.deleteApplication('app-to-delete');

    expect(captured).toHaveLength(1);
    expect(captured[0].method).toBe('DELETE');
    expect(captured[0].url).toContain('/applications/app-to-delete');
    expect(captured[0].url).toContain(`company=${COMPANY_ID}`);
    expect(captured[0].body).toBeUndefined();
  });

  it('promoteApplication sends POST to /applications/promote', async () => {
    const { captured } = installFetchSpy({ success: true });
    const api = new SevallaAPI(API_KEY, COMPANY_ID);

    await api.promoteApplication({
      app_id: 'app-1',
      pipeline_id: 'pipe-1',
      source_app_id: 'source-app',
    });

    expect(captured).toHaveLength(1);
    expect(captured[0].method).toBe('POST');
    expect(captured[0].url).toBe('https://api.sevalla.com/v2/applications/promote');
    expect(captured[0].body).toEqual({
      app_id: 'app-1',
      pipeline_id: 'pipe-1',
      source_app_id: 'source-app',
    });
  });

  it('promoteApplication works without optional source_app_id', async () => {
    const { captured } = installFetchSpy({ success: true });
    const api = new SevallaAPI(API_KEY, COMPANY_ID);

    await api.promoteApplication({
      app_id: 'app-1',
      pipeline_id: 'pipe-1',
    });

    expect(captured[0].body).toEqual({
      app_id: 'app-1',
      pipeline_id: 'pipe-1',
    });
  });
});
