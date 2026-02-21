// Copyright (c) 2026 84EM LLC (https://84em.io). MIT License.

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { SevallaAPI } from './sevalla-api.js';

export async function handleToolCall(
  api: SevallaAPI,
  companyId: string,
  name: string,
  args: Record<string, unknown> | undefined,
): Promise<CallToolResult> {
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
          company: companyId,
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
}
