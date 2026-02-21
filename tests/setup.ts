// Copyright (c) 2026 84EM LLC (https://84em.io). MIT License.

import { config } from 'dotenv';
import { SevallaAPI } from '../src/sevalla-api.js';

config();

export function getEnvOrSkip(key: string): string {
  const value = process.env[key]?.trim();
  if (!value) {
    throw new Error(`Missing ${key} -- skipping integration tests`);
  }
  return value;
}

export function createApi(): SevallaAPI {
  const apiKey = getEnvOrSkip('SEVALLA_API_KEY');
  const companyId = getEnvOrSkip('SEVALLA_COMPANY_ID');
  return new SevallaAPI(apiKey, companyId);
}

export function getCompanyId(): string {
  return getEnvOrSkip('SEVALLA_COMPANY_ID');
}

export const RATE_LIMIT_DELAY = 300;

export const hasCredentials = !!(
  process.env.SEVALLA_API_KEY?.trim() &&
  process.env.SEVALLA_COMPANY_ID?.trim()
);
