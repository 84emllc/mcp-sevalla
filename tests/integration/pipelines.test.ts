// Copyright (c) 2026 84EM LLC (https://84em.io). MIT License.

import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { createApi, hasCredentials, RATE_LIMIT_DELAY } from '../setup.js';
import type { SevallaAPI } from '../../src/sevalla-api.js';

describe.skipIf(!hasCredentials)('pipelines endpoints (integration)', { timeout: 30_000 }, () => {
  let api: SevallaAPI;

  beforeAll(() => {
    api = createApi();
  });

  beforeEach(async () => {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
  });

  it('getPipelines returns items array', async () => {
    const data = await api.getPipelines({ limit: 5 });

    expect(data).toHaveProperty('company');
    expect(data.company).toHaveProperty('pipelines');
    expect(data.company.pipelines).toHaveProperty('items');
    expect(Array.isArray(data.company.pipelines.items)).toBe(true);
  });

  it('getPipelines respects limit parameter', async () => {
    const data = await api.getPipelines({ limit: 2 });

    expect(data.company.pipelines.items.length).toBeLessThanOrEqual(2);
  });

  it('getPipelines with offset', async () => {
    const data = await api.getPipelines({ limit: 5, offset: 0 });

    expect(data).toHaveProperty('company');
    expect(Array.isArray(data.company.pipelines.items)).toBe(true);
  });
});
