// Copyright (c) 2026 84EM LLC (https://84em.io). MIT License.

import { describe, it, expect, vi, afterEach } from 'vitest';
import { SevallaAPI } from '../../src/sevalla-api.js';

describe('SevallaAPI.buildQuery() via captured URLs', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  function captureUrl(): { getUrl: () => string } {
    let capturedUrl = '';
    const spy = vi.fn(async (url: string) => {
      capturedUrl = url;
      return new Response(JSON.stringify({ company: { apps: { items: [] } } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });
    vi.stubGlobal('fetch', spy);
    return { getUrl: () => capturedUrl };
  }

  it('includes limit and offset when provided', async () => {
    const { getUrl } = captureUrl();
    const api = new SevallaAPI('key', 'comp-id');

    await api.getApplications({ limit: 25, offset: 50 });

    expect(getUrl()).toContain('limit=25');
    expect(getUrl()).toContain('offset=50');
  });

  it('excludes undefined params', async () => {
    const { getUrl } = captureUrl();
    const api = new SevallaAPI('key', 'comp-id');

    await api.getApplications({});

    expect(getUrl()).not.toContain('limit=');
    expect(getUrl()).not.toContain('offset=');
  });

  it('appends company ID to queries', async () => {
    const { getUrl } = captureUrl();
    const api = new SevallaAPI('key', 'my-company');

    await api.getApplications({});

    expect(getUrl()).toContain('company=my-company');
  });

  it('encodes special characters in params', async () => {
    const { getUrl } = captureUrl();
    const api = new SevallaAPI('key', 'comp&id=test');

    await api.getApplications({});

    expect(getUrl()).toContain('company=comp%26id%3Dtest');
  });

  it('builds correct URL for company users endpoint', async () => {
    let capturedUrl = '';
    const spy = vi.fn(async (url: string) => {
      capturedUrl = url;
      return new Response(JSON.stringify({ company: { users: [] } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });
    vi.stubGlobal('fetch', spy);

    const api = new SevallaAPI('key', 'test-comp');
    await api.getCompanyUsers();

    expect(capturedUrl).toBe('https://api.sevalla.com/v2/company/test-comp/users');
  });

  it('builds correct URL for usage with period offset', async () => {
    let capturedUrl = '';
    const spy = vi.fn(async (url: string) => {
      capturedUrl = url;
      return new Response(JSON.stringify({ company: { usage: {} } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });
    vi.stubGlobal('fetch', spy);

    const api = new SevallaAPI('key', 'test-comp');
    await api.getUsage(1);

    expect(capturedUrl).toContain('/company/test-comp/paas-usage');
    expect(capturedUrl).toContain('period_offset=1');
  });

  it('builds correct URL for pipelines with pagination', async () => {
    let capturedUrl = '';
    const spy = vi.fn(async (url: string) => {
      capturedUrl = url;
      return new Response(JSON.stringify({ company: { pipelines: { items: [] } } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });
    vi.stubGlobal('fetch', spy);

    const api = new SevallaAPI('key', 'comp');
    await api.getPipelines({ limit: 10, offset: 0 });

    expect(capturedUrl).toContain('/pipelines');
    expect(capturedUrl).toContain('company=comp');
    expect(capturedUrl).toContain('limit=10');
    expect(capturedUrl).toContain('offset=0');
  });
});
