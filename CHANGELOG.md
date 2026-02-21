# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-21

### Added

- Initial release with 28 MCP tools covering the full Sevalla API
- Application management (list, get, update, delete, promote)
- Database management (list, get, create, update, delete)
- Static site management (list, get, update, delete, deploy, get deployment)
- Deployment management (get, start)
- Pipeline management (list, create preview app)
- Process management (get, update)
- Networking (clear cache, toggle CDN, toggle edge cache, create internal connection)
- Company (list users, get usage)
- Retry with exponential backoff on rate-limited requests
