# MCP Sevalla Server

A Model Context Protocol (MCP) server for the [Sevalla](https://sevalla.com/) cloud hosting API. Manage applications, databases, static sites, deployments, pipelines, and infrastructure programmatically through any MCP client.

## Features

- **Application Management**: List, get, update, delete, and promote applications
- **Database Management**: List, get, create, update, and delete databases (PostgreSQL, MySQL, MariaDB, MongoDB, Redis, Valkey)
- **Static Site Management**: List, get, update, delete, and deploy static sites
- **Deployment Control**: Start deployments from Git branches or Docker images, check deployment status
- **Pipeline Management**: List pipelines, create preview apps from feature branches
- **Process Scaling**: Get and update application processes
- **Networking**: Toggle CDN, toggle edge cache, clear cache, create internal connections
- **Company**: List users, get usage metrics

## Installation

```bash
git clone https://github.com/84emllc/mcp-sevalla.git
cd mcp-sevalla
npm install
npm run build
```

## Configuration

1. Generate an API key from your [Sevalla dashboard](https://app.sevalla.com/api-keys).

2. Find your Company ID in the Sevalla dashboard URL or API responses.

3. Copy `.env.example` to `.env` and fill in your values:

```env
SEVALLA_API_KEY=your_api_key_here
SEVALLA_COMPANY_ID=your_company_id_here
```

4. Add to your MCP client:

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "sevalla": {
      "command": "node",
      "args": ["/path/to/mcp-sevalla/dist/index.js"],
      "env": {
        "SEVALLA_API_KEY": "your_api_key",
        "SEVALLA_COMPANY_ID": "your_company_id"
      }
    }
  }
}
```

### Cursor

Add to your Cursor MCP settings:

```json
{
  "mcpServers": {
    "sevalla": {
      "command": "node",
      "args": ["/path/to/mcp-sevalla/dist/index.js"],
      "env": {
        "SEVALLA_API_KEY": "your_api_key",
        "SEVALLA_COMPANY_ID": "your_company_id"
      }
    }
  }
}
```

## Available Tools (28)

### Company

| Tool | Description |
|---|---|
| `sevalla_get_company_users` | List all users belonging to the company |
| `sevalla_get_usage` | Get PaaS usage data for a billing period |

### Applications

| Tool | Description |
|---|---|
| `sevalla_list_applications` | List all applications |
| `sevalla_get_application` | Get application details |
| `sevalla_update_application` | Update application settings |
| `sevalla_delete_application` | Delete an application |
| `sevalla_promote_application` | Promote an application in a pipeline |

### Processes

| Tool | Description |
|---|---|
| `sevalla_get_process` | Get process details |
| `sevalla_update_process` | Update or scale processes |

### Networking

| Tool | Description |
|---|---|
| `sevalla_create_internal_connection` | Create internal connection between resources |
| `sevalla_toggle_cdn` | Enable or disable CDN |
| `sevalla_toggle_edge_cache` | Toggle edge caching |
| `sevalla_clear_cache` | Clear edge cache |

### Deployments

| Tool | Description |
|---|---|
| `sevalla_get_deployment` | Get deployment details |
| `sevalla_start_deployment` | Start a deployment from Git branch or Docker image |

### Pipelines

| Tool | Description |
|---|---|
| `sevalla_get_pipelines` | List pipeline configurations |
| `sevalla_create_preview_app` | Create a preview app from a branch |

### Databases

| Tool | Description |
|---|---|
| `sevalla_list_databases` | List all databases |
| `sevalla_get_database` | Get database details |
| `sevalla_create_database` | Create a database |
| `sevalla_update_database` | Update database settings |
| `sevalla_delete_database` | Delete a database |

### Static Sites

| Tool | Description |
|---|---|
| `sevalla_list_static_sites` | List all static sites |
| `sevalla_get_static_site` | Get static site details |
| `sevalla_update_static_site` | Update static site settings |
| `sevalla_delete_static_site` | Delete a static site |
| `sevalla_get_static_site_deployment` | Get static site deployment details |
| `sevalla_deploy_static_site` | Deploy a static site |

## API Permissions

Tool access depends on the API key's role. See the [Sevalla/Kinsta user roles and permissions chart](https://kinsta.com/docs/company-settings/user-management/#mykinsta-user-roles-and-permissions-chart) for details.

## Development

```bash
npm run build    # Compile TypeScript to dist/
npm run dev      # Watch mode with tsx
npm start        # Run compiled server
```

## Contributing

Pull requests welcome.

## License

MIT

## Credits

Created by [84EM](https://84em.io).
