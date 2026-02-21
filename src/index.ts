#!/usr/bin/env node
// Copyright (c) 2026 84EM LLC (https://84em.io). MIT License.

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { config } from 'dotenv';
import { SevallaAPI } from './sevalla-api.js';

config();

const VERSION = '1.0.0';

if (process.argv.includes('--version')) {
  console.log(VERSION);
  process.exit(0);
}

if (process.argv.includes('--help')) {
  console.log(`mcp-sevalla v${VERSION} - MCP server for Sevalla cloud hosting API`);
  console.log('Environment variables: SEVALLA_API_KEY, SEVALLA_COMPANY_ID');
  process.exit(0);
}

const API_KEY = process.env.SEVALLA_API_KEY?.trim();
const COMPANY_ID = process.env.SEVALLA_COMPANY_ID?.trim();

if (!API_KEY) {
  console.error('Missing required environment variable: SEVALLA_API_KEY');
  process.exit(1);
}

if (!COMPANY_ID) {
  console.error('Missing required environment variable: SEVALLA_COMPANY_ID');
  process.exit(1);
}

const api = new SevallaAPI(API_KEY, COMPANY_ID);

const tools: Tool[] = [
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

const server = new Server(
  { name: 'mcp-sevalla', version: VERSION },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, () => ({ tools }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      // --- Company ---
      case 'sevalla_get_company_users': {
        const data = await api.getCompanyUsers();
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'sevalla_get_usage': {
        const data = await api.getUsage(args?.period_offset as number | undefined);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      // --- Applications ---
      case 'sevalla_list_applications': {
        const data = await api.getApplications({
          limit: args?.limit as number | undefined,
          offset: args?.offset as number | undefined,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'sevalla_get_application': {
        const data = await api.getApplication(args?.app_id as string);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'sevalla_update_application': {
        const { app_id, ...updates } = args as Record<string, unknown>;
        const data = await api.updateApplication(app_id as string, updates);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'sevalla_delete_application': {
        await api.deleteApplication(args?.app_id as string);
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, message: 'Application deleted' }, null, 2) }] };
      }
      case 'sevalla_promote_application': {
        const data = await api.promoteApplication({
          app_id: args?.app_id as string,
          pipeline_id: args?.pipeline_id as string,
          source_app_id: args?.source_app_id as string | undefined,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      // --- Processes ---
      case 'sevalla_get_process': {
        const data = await api.getProcess(args?.process_id as string);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'sevalla_update_process': {
        const { process_id, ...updates } = args as Record<string, unknown>;
        const data = await api.updateProcess(process_id as string, updates);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      // --- Networking ---
      case 'sevalla_create_internal_connection': {
        const { app_id, ...body } = args as Record<string, unknown>;
        const data = await api.createInternalConnection(app_id as string, body);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'sevalla_toggle_cdn': {
        const data = await api.toggleCdn(args?.app_id as string, args?.enabled as boolean);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'sevalla_toggle_edge_cache': {
        const data = await api.toggleEdgeCache(args?.app_id as string, args?.enabled as boolean);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'sevalla_clear_cache': {
        const data = await api.clearCache(args?.app_id as string);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      // --- Deployments ---
      case 'sevalla_get_deployment': {
        const data = await api.getDeployment(args?.deployment_id as string);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'sevalla_start_deployment': {
        const data = await api.startDeployment({
          app_id: args?.app_id as string,
          branch: args?.branch as string | undefined,
          docker_image: args?.docker_image as string | undefined,
          is_restart: args?.is_restart as boolean | undefined,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      // --- Pipelines ---
      case 'sevalla_get_pipelines': {
        const data = await api.getPipelines({
          limit: args?.limit as number | undefined,
          offset: args?.offset as number | undefined,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'sevalla_create_preview_app': {
        const { pipeline_id, ...body } = args as Record<string, unknown>;
        const data = await api.createPreviewApp(pipeline_id as string, body as { pipeline_id: string; branch: string });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      // --- Databases ---
      case 'sevalla_list_databases': {
        const data = await api.getDatabases({
          limit: args?.limit as number | undefined,
          offset: args?.offset as number | undefined,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'sevalla_get_database': {
        const data = await api.getDatabase(args?.database_id as string);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'sevalla_create_database': {
        const data = await api.createDatabase({
          location: args?.location as string,
          resource_type: args?.resource_type as string,
          display_name: args?.display_name as string,
          db_name: args?.db_name as string,
          db_password: args?.db_password as string,
          type: args?.type as 'postgresql' | 'mariadb' | 'mysql' | 'mongodb' | 'redis' | 'valkey',
          version: args?.version as string,
          db_user: args?.db_user as string | undefined,
          company: COMPANY_ID,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'sevalla_update_database': {
        const { database_id, ...updates } = args as Record<string, unknown>;
        const data = await api.updateDatabase(database_id as string, updates);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'sevalla_delete_database': {
        await api.deleteDatabase(args?.database_id as string);
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, message: 'Database deleted' }, null, 2) }] };
      }

      // --- Static Sites ---
      case 'sevalla_list_static_sites': {
        const data = await api.getStaticSites({
          limit: args?.limit as number | undefined,
          offset: args?.offset as number | undefined,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'sevalla_get_static_site': {
        const data = await api.getStaticSite(args?.static_site_id as string);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'sevalla_update_static_site': {
        const { static_site_id, ...updates } = args as Record<string, unknown>;
        const data = await api.updateStaticSite(static_site_id as string, updates);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'sevalla_delete_static_site': {
        await api.deleteStaticSite(args?.static_site_id as string);
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, message: 'Static site deleted' }, null, 2) }] };
      }
      case 'sevalla_get_static_site_deployment': {
        const data = await api.getStaticSiteDeployment(args?.deployment_id as string);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }
      case 'sevalla_deploy_static_site': {
        const data = await api.deployStaticSite({
          static_site_id: args?.static_site_id as string,
          branch: args?.branch as string | undefined,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: 'text', text: JSON.stringify({ error: true, message }, null, 2) }],
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`mcp-sevalla v${VERSION} running`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
