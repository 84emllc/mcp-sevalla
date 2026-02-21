// Copyright (c) 2026 84EM LLC (https://84em.io). MIT License.

import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { createApi, hasCredentials, RATE_LIMIT_DELAY } from '../setup.js';
import type { SevallaAPI } from '../../src/sevalla-api.js';

describe.skipIf(!hasCredentials)('company endpoints (integration)', { timeout: 30_000 }, () => {
  let api: SevallaAPI;

  beforeAll(() => {
    api = createApi();
  });

  beforeEach(async () => {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
  });

  it('getCompanyUsers returns users array', async () => {
    const data = await api.getCompanyUsers();

    expect(data).toHaveProperty('company');
    expect(data.company).toHaveProperty('users');
    expect(Array.isArray(data.company.users)).toBe(true);
    expect(data.company.users.length).toBeGreaterThan(0);

    const firstUser = data.company.users[0];
    expect(firstUser).toHaveProperty('user');
    expect(firstUser.user).toHaveProperty('id');
    expect(firstUser.user).toHaveProperty('email');
  });

  // Note: getUsage may return 403 for Company Developer role.
  // If this test fails with 403, the API key likely has insufficient permissions.
  it('getUsage returns usage data or 403', async () => {
    try {
      const data = await api.getUsage(0);
      expect(data).toHaveProperty('company');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toContain('403');
    }
  });

  it('getUsage with period offset', async () => {
    try {
      const data = await api.getUsage(1);
      expect(data).toHaveProperty('company');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toMatch(/40[13]/);
    }
  });
});
