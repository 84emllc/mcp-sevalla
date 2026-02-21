// Copyright (c) 2026 84EM LLC (https://84em.io). MIT License.

import type { Tool } from '@modelcontextprotocol/sdk/types.js';

export const tools: Tool[] = [
  // --- Company ---
  {
    name: 'sevalla_get_company_users',
    description: 'List all users belonging to the company',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'sevalla_get_usage',
    description: 'Get PaaS usage data for the company within a billing period',
    inputSchema: {
      type: 'object',
      properties: {
        period_offset: {
          type: 'number',
          description: 'Billing period offset (0 = current, 1 = previous, etc.)',
        },
      },
    },
  },

  // --- Applications ---
  {
    name: 'sevalla_list_applications',
    description: 'List all applications accessible in the company',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Maximum items per response (1-100, default 10)' },
        offset: { type: 'number', description: 'Pagination offset (default 0)' },
      },
    },
  },
  {
    name: 'sevalla_get_application',
    description: 'Get detailed information about a specific application',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'string', description: 'Application UUID' },
      },
      required: ['app_id'],
    },
  },
  {
    name: 'sevalla_update_application',
    description: 'Update properties or settings of an existing application',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'string', description: 'Application UUID' },
        display_name: { type: 'string', description: 'New display name' },
      },
      required: ['app_id'],
    },
  },
  {
    name: 'sevalla_delete_application',
    description: 'Permanently delete an application and all related resources',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'string', description: 'Application UUID' },
      },
      required: ['app_id'],
    },
  },
  {
    name: 'sevalla_promote_application',
    description: 'Promote an application in a pipeline to the next stage',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'string', description: 'Application UUID to promote' },
        pipeline_id: { type: 'string', description: 'Pipeline UUID' },
        source_app_id: { type: 'string', description: 'Source application UUID (optional)' },
      },
      required: ['app_id', 'pipeline_id'],
    },
  },

  // --- Processes ---
  {
    name: 'sevalla_get_process',
    description: 'Get information about the running processes for a specific application',
    inputSchema: {
      type: 'object',
      properties: {
        process_id: { type: 'string', description: 'Process UUID' },
      },
      required: ['process_id'],
    },
  },
  {
    name: 'sevalla_update_process',
    description: 'Update or scale the running processes of an application',
    inputSchema: {
      type: 'object',
      properties: {
        process_id: { type: 'string', description: 'Process UUID' },
        replicas: { type: 'number', description: 'Number of replicas' },
        pod_size: { type: 'string', description: 'Pod size identifier' },
      },
      required: ['process_id'],
    },
  },

  // --- Networking ---
  {
    name: 'sevalla_create_internal_connection',
    description: 'Create an internal connection between resources within the same region',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'string', description: 'Application UUID' },
        target_id: { type: 'string', description: 'Target resource UUID to connect to' },
        target_type: { type: 'string', description: 'Target type (e.g., database, application)' },
      },
      required: ['app_id'],
    },
  },
  {
    name: 'sevalla_toggle_cdn',
    description: 'Enable or disable CDN for an application',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'string', description: 'Application UUID' },
        enabled: { type: 'boolean', description: 'Whether to enable (true) or disable (false) CDN' },
      },
      required: ['app_id', 'enabled'],
    },
  },
  {
    name: 'sevalla_toggle_edge_cache',
    description: 'Toggle edge caching for improved application performance',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'string', description: 'Application UUID' },
        enabled: { type: 'boolean', description: 'Whether to enable (true) or disable (false) edge cache' },
      },
      required: ['app_id', 'enabled'],
    },
  },
  {
    name: 'sevalla_clear_cache',
    description: 'Clear the edge cache for an application to instantly update cached resources',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'string', description: 'Application UUID' },
      },
      required: ['app_id'],
    },
  },

  // --- Deployments ---
  {
    name: 'sevalla_get_deployment',
    description: 'Get deployment details for a specific application deployment',
    inputSchema: {
      type: 'object',
      properties: {
        deployment_id: { type: 'string', description: 'Deployment UUID' },
      },
      required: ['deployment_id'],
    },
  },
  {
    name: 'sevalla_start_deployment',
    description: 'Start a new deployment for an application',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: { type: 'string', description: 'Application UUID to deploy' },
        branch: { type: 'string', description: 'Git branch to deploy' },
        docker_image: { type: 'string', description: 'Docker image to deploy' },
        is_restart: { type: 'boolean', description: 'Whether this is a restart deployment (default false)' },
      },
      required: ['app_id'],
    },
  },

  // --- Pipelines ---
  {
    name: 'sevalla_get_pipelines',
    description: 'List all pipeline configurations and workflows',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Maximum items per response (1-100, default 10)' },
        offset: { type: 'number', description: 'Pagination offset (default 0)' },
      },
    },
  },
  {
    name: 'sevalla_create_preview_app',
    description: 'Create a preview application in a pipeline from a branch',
    inputSchema: {
      type: 'object',
      properties: {
        pipeline_id: { type: 'string', description: 'Pipeline UUID' },
        branch: { type: 'string', description: 'Git branch for the preview app' },
      },
      required: ['pipeline_id', 'branch'],
    },
  },

  // --- Databases ---
  {
    name: 'sevalla_list_databases',
    description: 'List all databases available to the company',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Maximum items per response (1-100, default 10)' },
        offset: { type: 'number', description: 'Pagination offset (default 0)' },
      },
    },
  },
  {
    name: 'sevalla_get_database',
    description: 'Get details for a specific database including configuration and status',
    inputSchema: {
      type: 'object',
      properties: {
        database_id: { type: 'string', description: 'Database UUID' },
      },
      required: ['database_id'],
    },
  },
  {
    name: 'sevalla_create_database',
    description: 'Create a new database with the specified configuration',
    inputSchema: {
      type: 'object',
      properties: {
        location: { type: 'string', description: 'Cluster location identifier (e.g., europe-west1)' },
        resource_type: { type: 'string', description: 'Resource type name (e.g., db-standard-1)' },
        display_name: { type: 'string', description: 'Display name (2-64 characters)' },
        db_name: { type: 'string', description: 'Database name (2-100 characters)' },
        db_password: { type: 'string', description: 'Database password (4-100 characters)' },
        type: {
          type: 'string',
          description: 'Database engine type',
          enum: ['postgresql', 'mariadb', 'mysql', 'mongodb', 'redis', 'valkey'],
        },
        version: { type: 'string', description: 'Database engine version (e.g., "16")' },
        db_user: { type: 'string', description: 'Database user (required for non-Redis/Valkey)' },
      },
      required: ['location', 'resource_type', 'display_name', 'db_name', 'db_password', 'type', 'version'],
    },
  },
  {
    name: 'sevalla_update_database',
    description: 'Update settings or metadata for an existing database',
    inputSchema: {
      type: 'object',
      properties: {
        database_id: { type: 'string', description: 'Database UUID' },
        resource_type: { type: 'string', description: 'New resource type' },
        display_name: { type: 'string', description: 'New display name' },
      },
      required: ['database_id'],
    },
  },
  {
    name: 'sevalla_delete_database',
    description: 'Permanently delete a database and all its associated data',
    inputSchema: {
      type: 'object',
      properties: {
        database_id: { type: 'string', description: 'Database UUID' },
      },
      required: ['database_id'],
    },
  },

  // --- Static Sites ---
  {
    name: 'sevalla_list_static_sites',
    description: 'List all static sites accessible in the company',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Maximum items per response (1-100, default 10)' },
        offset: { type: 'number', description: 'Pagination offset (default 0)' },
      },
    },
  },
  {
    name: 'sevalla_get_static_site',
    description: 'Get detailed information about a specific static site',
    inputSchema: {
      type: 'object',
      properties: {
        static_site_id: { type: 'string', description: 'Static site UUID' },
      },
      required: ['static_site_id'],
    },
  },
  {
    name: 'sevalla_update_static_site',
    description: 'Update properties or settings of an existing static site',
    inputSchema: {
      type: 'object',
      properties: {
        static_site_id: { type: 'string', description: 'Static site UUID' },
        display_name: { type: 'string', description: 'New display name' },
      },
      required: ['static_site_id'],
    },
  },
  {
    name: 'sevalla_delete_static_site',
    description: 'Permanently delete a static site and all related resources',
    inputSchema: {
      type: 'object',
      properties: {
        static_site_id: { type: 'string', description: 'Static site UUID' },
      },
      required: ['static_site_id'],
    },
  },
  {
    name: 'sevalla_get_static_site_deployment',
    description: 'Get deployment details for a specific static site deployment',
    inputSchema: {
      type: 'object',
      properties: {
        deployment_id: { type: 'string', description: 'Deployment UUID' },
      },
      required: ['deployment_id'],
    },
  },
  {
    name: 'sevalla_deploy_static_site',
    description: 'Manually or programmatically deploy a static site',
    inputSchema: {
      type: 'object',
      properties: {
        static_site_id: { type: 'string', description: 'Static site UUID' },
        branch: { type: 'string', description: 'Git branch to deploy' },
      },
      required: ['static_site_id'],
    },
  },
];
