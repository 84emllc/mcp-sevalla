# mcp-sevalla

MCP server for the Sevalla cloud hosting REST API.

## Architecture

- TypeScript + Node.js ES modules
- `@modelcontextprotocol/sdk` with stdio transport
- Bearer token auth against `https://api.sevalla.com/v2/`
- 28 tools covering applications, databases, static sites, deployments, pipelines, processes, networking, and company

## File Structure

- `src/index.ts` -- MCP server entry, tool definitions, request handlers
- `src/sevalla-api.ts` -- API client class with all endpoint methods
- `src/types.ts` -- TypeScript interfaces for API request/response shapes

## Development

```bash
npm run build    # Compile TypeScript to dist/
npm run dev      # Watch mode with tsx
npm start        # Run compiled server
```

## Environment Variables

- `SEVALLA_API_KEY` -- API key from Sevalla dashboard (required)
- `SEVALLA_COMPANY_ID` -- Company UUID for list endpoints (required)

## API Key Permissions

The configured API key has **Company Developer** access. Refer to the roles chart below to understand what actions are available.

### Sevalla/Kinsta User Roles and Permissions Chart

*Last updated: 2026-02-21. Source: https://kinsta.com/docs/company-settings/user-management/*

| Capability | Company Owner | Company Admin | Company Developer | Company Billing | Site Admin | Site Developer |
|---|---|---|---|---|---|---|
| Access billing details or change plan | Yes | Yes | No | Yes | No | No |
| Access referrals | Yes | Yes | No | Yes | No | No |
| Cancel WordPress plan | Yes | No | No | No | No | No |
| Access company analytics | Yes | Yes | Yes | No | No | No |
| Access site analytics | Yes | Yes | Yes | No | Yes | No |
| Install or remove paid add-on | Yes | Yes | No | Yes (1) | No | No |
| Adjust PHP performance settings | Yes | Yes | Yes (2) | No | Yes (2) | No |
| Approve inbound WordPress site transfer | Yes | Yes | No | No | No | No |
| Initiate inbound WordPress site/DNS transfer | Yes | Yes | No | No | No | No |
| Request WordPress paid malware cleanup | Yes | Yes | No | No | No | No |
| Request WordPress site data center change | Yes | Yes | Yes | No | Yes | No |
| Request WordPress site migration | Yes | Yes | No | No | No | No |
| Manage WordPress site labels | Yes | Yes | Yes | No | Yes | No |
| DNS in MyKinsta | Yes | Yes | Yes | No | Yes (3) | No |
| Add or delete WordPress site/live environment | Yes | Yes | Yes (4) | No | No | No |
| Add or delete SFTP users | Yes | Yes | Yes | No | No | Yes (5) |
| Access live WordPress environment | Yes | Yes | Yes | No | Yes | No |
| Access or Add Standard Staging Environment | Yes | Yes | Yes | No | Yes | Yes |
| Delete or Replace Existing Standard Staging | Yes | Yes | Yes | No | Yes | No |
| Add or delete Premium Staging Environment | Yes | Yes | No | No | No | No |
| Access Premium Staging Environment | Yes | Yes | Yes | No | Yes | Yes |
| Access any staging environment analytics | Yes | Yes | Yes | No | Yes | Yes |
| Push any staging to live | Yes | Yes | Yes | No | Yes | No |
| Push any staging to another staging | Yes | Yes | Yes | No | Yes | Yes |
| Request persistent storage backup restoration | Yes | Yes | No | No | No | No |
| Request 2FA be disabled for other users | Yes | No | No | No | No | No |

1. Can add disk space add-on only
2. Can adjust PHP threads/memory per thread only
3. Only if WordPress site is linked to DNS zone
4. Cannot delete if Premium Staging Environment attached
5. Staging environment SFTP users only

### MCP Tool Access by Role

Inferred from the permissions chart above. (C) = confirmed via testing with Company Developer key.

| MCP Tool | Closest Capability | Owner | Admin | Dev | Billing | Site Admin | Site Dev |
|---|---|---|---|---|---|---|---|
| **Company** | | | | | | | |
| `sevalla_get_company_users` | Access company analytics | Yes | Yes | Yes (C) | No | No | No |
| `sevalla_get_usage` | Access billing details | Yes | Yes | No (C) | Yes | No | No |
| **Applications** | | | | | | | |
| `sevalla_list_applications` | Access live environment | Yes | Yes | Yes (C) | No | Yes | No |
| `sevalla_get_application` | Access live environment | Yes | Yes | Yes (C) | No | Yes | No |
| `sevalla_update_application` | Manage site labels/settings | Yes | Yes | Yes | No | Yes | No |
| `sevalla_delete_application` | Add/delete site | Yes | Yes | Yes (1) | No | No | No |
| `sevalla_promote_application` | Push staging to live | Yes | Yes | Yes | No | Yes | No |
| **Processes** | | | | | | | |
| `sevalla_get_process` | Access live environment | Yes | Yes | Yes | No | Yes | No |
| `sevalla_update_process` | Adjust PHP performance | Yes | Yes | Yes (2) | No | Yes (2) | No |
| **Networking** | | | | | | | |
| `sevalla_create_internal_connection` | Site infrastructure | Yes | Yes | Yes | No | No | No |
| `sevalla_toggle_cdn` | Site infrastructure | Yes | Yes | Yes | No | Yes | No |
| `sevalla_toggle_edge_cache` | Site infrastructure | Yes | Yes | Yes | No | Yes | No |
| `sevalla_clear_cache` | Site infrastructure | Yes | Yes | Yes | No | Yes | No |
| **Deployments** | | | | | | | |
| `sevalla_get_deployment` | Access live environment | Yes | Yes | Yes | No | Yes | Yes |
| `sevalla_start_deployment` | Push staging to live | Yes | Yes | Yes | No | Yes | No |
| **Pipelines** | | | | | | | |
| `sevalla_get_pipelines` | Access staging environment | Yes | Yes | Yes | No | Yes | Yes |
| `sevalla_create_preview_app` | Add Standard Staging | Yes | Yes | Yes | No | Yes | Yes |
| **Databases** | | | | | | | |
| `sevalla_list_databases` | Access live environment | Yes | Yes | Yes (C) | No | No | No |
| `sevalla_get_database` | Access live environment | Yes | Yes | Yes | No | No | No |
| `sevalla_create_database` | Install paid add-on | Yes | Yes | No | Yes (3) | No | No |
| `sevalla_update_database` | Site infrastructure | Yes | Yes | Yes | No | No | No |
| `sevalla_delete_database` | Add/delete site | Yes | Yes | No | No | No | No |
| **Static Sites** | | | | | | | |
| `sevalla_list_static_sites` | Access live environment | Yes | Yes | Yes (C) | No | Yes | No |
| `sevalla_get_static_site` | Access live environment | Yes | Yes | Yes | No | Yes | No |
| `sevalla_update_static_site` | Manage site settings | Yes | Yes | Yes | No | Yes | No |
| `sevalla_delete_static_site` | Add/delete site | Yes | Yes | Yes (1) | No | No | No |
| `sevalla_get_static_site_deployment` | Access live environment | Yes | Yes | Yes | No | Yes | Yes |
| `sevalla_deploy_static_site` | Push staging to live | Yes | Yes | Yes | No | Yes | No |

(C) = Confirmed via API testing. All other values are inferred from the dashboard permissions chart.

1. Cannot delete if Premium Staging Environment attached
2. PHP threads/memory per thread only
3. Disk space add-on only

## Git Workflow

- Code changes require branches and PRs
- Conventional Commits for commit messages
- Semantic Versioning for releases
