// Copyright (c) 2026 84EM LLC (https://84em.io). MIT License.

import { describe, it, expect, vi, afterEach } from 'vitest';
import { SevallaAPI } from '../../src/sevalla-api.js';
import { installFetchSpy } from '../helpers/fetch-spy.js';

const API_KEY = 'test-api-key';
const COMPANY_ID = 'test-company-id';

describe('static sites write operations (dry-run)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('updateStaticSite sends PUT with correct URL and body', async () => {
    const { captured } = installFetchSpy({ static_site: { id: 'site-1' } });
    const api = new SevallaAPI(API_KEY, COMPANY_ID);

    await api.updateStaticSite('site-1', { display_name: 'Updated Site' });

    expect(captured).toHaveLength(1);
    expect(captured[0].method).toBe('PUT');
    expect(captured[0].url).toBe('https://api.sevalla.com/v2/static-sites/site-1');
    expect(captured[0].body).toEqual({ display_name: 'Updated Site' });
  });

  it('deleteStaticSite sends DELETE with correct URL', async () => {
    const { captured } = installFetchSpy({}, 204);
    const api = new SevallaAPI(API_KEY, COMPANY_ID);

    await api.deleteStaticSite('site-to-delete');

    expect(captured).toHaveLength(1);
    expect(captured[0].method).toBe('DELETE');
    expect(captured[0].url).toBe('https://api.sevalla.com/v2/static-sites/site-to-delete');
    expect(captured[0].body).toBeUndefined();
  });

  it('deployStaticSite sends POST with site ID and branch', async () => {
    const { captured } = installFetchSpy({ deployment: { id: 'deploy-1' } });
    const api = new SevallaAPI(API_KEY, COMPANY_ID);

    await api.deployStaticSite({ static_site_id: 'site-1', branch: 'main' });

    expect(captured).toHaveLength(1);
    expect(captured[0].method).toBe('POST');
    expect(captured[0].url).toBe('https://api.sevalla.com/v2/static-site-deployments');
    expect(captured[0].body).toEqual({ static_site_id: 'site-1', branch: 'main' });
  });

  it('deployStaticSite works without optional branch', async () => {
    const { captured } = installFetchSpy({ deployment: { id: 'deploy-2' } });
    const api = new SevallaAPI(API_KEY, COMPANY_ID);

    await api.deployStaticSite({ static_site_id: 'site-1' });

    expect(captured[0].body).toEqual({ static_site_id: 'site-1' });
  });
});
