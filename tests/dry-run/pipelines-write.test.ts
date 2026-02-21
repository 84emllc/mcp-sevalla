// Copyright (c) 2026 84EM LLC (https://84em.io). MIT License.

import { describe, it, expect, vi, afterEach } from 'vitest';
import { SevallaAPI } from '../../src/sevalla-api.js';
import { installFetchSpy } from '../helpers/fetch-spy.js';

const API_KEY = 'test-api-key';
const COMPANY_ID = 'test-company-id';

describe('pipelines write operations (dry-run)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('createPreviewApp sends POST with pipeline ID in URL and body', async () => {
    const { captured } = installFetchSpy({ success: true });
    const api = new SevallaAPI(API_KEY, COMPANY_ID);

    await api.createPreviewApp('pipe-1', { pipeline_id: 'pipe-1', branch: 'feature/test' });

    expect(captured).toHaveLength(1);
    expect(captured[0].method).toBe('POST');
    expect(captured[0].url).toBe('https://api.sevalla.com/v2/pipelines/pipe-1/create-preview-app');
    expect(captured[0].body).toMatchObject({ branch: 'feature/test' });
  });

  it('createPreviewApp sends correct headers', async () => {
    const { captured } = installFetchSpy({ success: true });
    const api = new SevallaAPI(API_KEY, COMPANY_ID);

    await api.createPreviewApp('pipe-1', { pipeline_id: 'pipe-1', branch: 'develop' });

    expect(captured[0].headers['Authorization']).toBe(`Bearer ${API_KEY}`);
    expect(captured[0].headers['Content-Type']).toBe('application/json');
  });
});
