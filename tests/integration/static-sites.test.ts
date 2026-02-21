// Copyright (c) 2026 84EM LLC (https://84em.io). MIT License.

import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { createApi, hasCredentials, RATE_LIMIT_DELAY } from '../setup.js';
import type { SevallaAPI } from '../../src/sevalla-api.js';

describe.skipIf(!hasCredentials)('static sites endpoints (integration)', { timeout: 30_000 }, () => {
  let api: SevallaAPI;

  beforeAll(() => {
    api = createApi();
  });

  beforeEach(async () => {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
  });

  it('listStaticSites returns items array', async () => {
    const data = await api.getStaticSites({ limit: 5 });

    expect(data).toHaveProperty('company');
    expect(data.company).toHaveProperty('static_sites');
    expect(data.company.static_sites).toHaveProperty('items');
    expect(Array.isArray(data.company.static_sites.items)).toBe(true);
  });

  it('listStaticSites respects limit parameter', async () => {
    const data = await api.getStaticSites({ limit: 2 });

    expect(data.company.static_sites.items.length).toBeLessThanOrEqual(2);
  });

  it('getStaticSite returns details for first site', async () => {
    const list = await api.getStaticSites({ limit: 1 });
    const items = list.company.static_sites.items;

    if (items.length === 0) {
      console.warn('No static sites found, skipping getStaticSite test');
      return;
    }

    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));

    const data = await api.getStaticSite(items[0].id);

    expect(data).toHaveProperty('static_site');
    expect(data.static_site).toHaveProperty('id');
    expect(data.static_site.id).toBe(items[0].id);
  });

  it('getStaticSite with bogus UUID returns error', async () => {
    try {
      await api.getStaticSite('00000000-0000-0000-0000-000000000000');
      expect.fail('Expected an error for bogus UUID');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toMatch(/40[04]/);
    }
  });
});
