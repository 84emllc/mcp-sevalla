// Copyright (c) 2026 84EM LLC (https://84em.io). MIT License.

import { describe, it, expect, vi, afterEach } from 'vitest';
import { SevallaAPI } from '../../src/sevalla-api.js';
import { installFetchSpy } from '../helpers/fetch-spy.js';

const API_KEY = 'test-api-key';
const COMPANY_ID = 'test-company-id';

describe('deployments write operations (dry-run)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('startDeployment sends POST with app_id and branch', async () => {
    const { captured } = installFetchSpy({ deployment: { id: 'deploy-1' } });
    const api = new SevallaAPI(API_KEY, COMPANY_ID);

    await api.startDeployment({ app_id: 'app-1', branch: 'main' });

    expect(captured).toHaveLength(1);
    expect(captured[0].method).toBe('POST');
    expect(captured[0].url).toBe('https://api.sevalla.com/v2/applications/deployments');
    expect(captured[0].body).toEqual({ app_id: 'app-1', branch: 'main' });
  });

  it('startDeployment with docker_image instead of branch', async () => {
    const { captured } = installFetchSpy({ deployment: { id: 'deploy-2' } });
    const api = new SevallaAPI(API_KEY, COMPANY_ID);

    await api.startDeployment({ app_id: 'app-1', docker_image: 'nginx:latest' });

    expect(captured[0].body).toEqual({ app_id: 'app-1', docker_image: 'nginx:latest' });
  });

  it('startDeployment with is_restart flag', async () => {
    const { captured } = installFetchSpy({ deployment: { id: 'deploy-3' } });
    const api = new SevallaAPI(API_KEY, COMPANY_ID);

    await api.startDeployment({ app_id: 'app-1', is_restart: true });

    expect(captured[0].body).toEqual({ app_id: 'app-1', is_restart: true });
  });

  it('startDeployment with only required app_id', async () => {
    const { captured } = installFetchSpy({ deployment: { id: 'deploy-4' } });
    const api = new SevallaAPI(API_KEY, COMPANY_ID);

    await api.startDeployment({ app_id: 'app-1' });

    expect(captured[0].body).toEqual({ app_id: 'app-1' });
  });
});
