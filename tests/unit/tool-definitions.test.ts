// Copyright (c) 2026 84EM LLC (https://84em.io). MIT License.

import { describe, it, expect } from 'vitest';
import { tools } from '../../src/tools.js';

describe('tool definitions', () => {
  it('exports exactly 28 tools', () => {
    expect(tools).toHaveLength(28);
  });

  it('all tool names are prefixed with sevalla_', () => {
    for (const tool of tools) {
      expect(tool.name).toMatch(/^sevalla_/);
    }
  });

  it('all tools have an inputSchema', () => {
    for (const tool of tools) {
      expect(tool.inputSchema).toBeDefined();
      expect(tool.inputSchema.type).toBe('object');
    }
  });

  it('has no duplicate tool names', () => {
    const names = tools.map(t => t.name);
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });

  it('all tools have a description', () => {
    for (const tool of tools) {
      expect(tool.description).toBeTruthy();
      expect(typeof tool.description).toBe('string');
    }
  });

  it('contains all expected tool names', () => {
    const names = new Set(tools.map(t => t.name));
    const expected = [
      'sevalla_get_company_users',
      'sevalla_get_usage',
      'sevalla_list_applications',
      'sevalla_get_application',
      'sevalla_update_application',
      'sevalla_delete_application',
      'sevalla_promote_application',
      'sevalla_get_process',
      'sevalla_update_process',
      'sevalla_create_internal_connection',
      'sevalla_toggle_cdn',
      'sevalla_toggle_edge_cache',
      'sevalla_clear_cache',
      'sevalla_get_deployment',
      'sevalla_start_deployment',
      'sevalla_get_pipelines',
      'sevalla_create_preview_app',
      'sevalla_list_databases',
      'sevalla_get_database',
      'sevalla_create_database',
      'sevalla_update_database',
      'sevalla_delete_database',
      'sevalla_list_static_sites',
      'sevalla_get_static_site',
      'sevalla_update_static_site',
      'sevalla_delete_static_site',
      'sevalla_get_static_site_deployment',
      'sevalla_deploy_static_site',
    ];
    for (const name of expected) {
      expect(names.has(name), `missing tool: ${name}`).toBe(true);
    }
  });

  it('tools with required fields have them defined in inputSchema', () => {
    const toolsWithRequired = tools.filter(t => {
      const schema = t.inputSchema as { required?: string[] };
      return schema.required && schema.required.length > 0;
    });
    expect(toolsWithRequired.length).toBeGreaterThan(0);

    for (const tool of toolsWithRequired) {
      const schema = tool.inputSchema as { required: string[]; properties: Record<string, unknown> };
      for (const field of schema.required) {
        expect(schema.properties[field], `${tool.name} missing property for required field: ${field}`).toBeDefined();
      }
    }
  });
});
