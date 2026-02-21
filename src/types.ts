// Copyright (c) 2026 84EM LLC (https://84em.io). MIT License.

export interface Application {
  id: string;
  name: string;
  display_name: string;
  status: string;
  [key: string]: unknown;
}

export interface ApplicationListResponse {
  company: {
    apps: {
      items: Application[];
    };
  };
}

export interface ApplicationResponse {
  app: Application;
}

export interface Process {
  id: string;
  [key: string]: unknown;
}

export interface ProcessResponse {
  process: Process;
}

export interface Deployment {
  id: string;
  [key: string]: unknown;
}

export interface DeploymentResponse {
  deployment: Deployment;
}

export interface Pipeline {
  id: string;
  [key: string]: unknown;
}

export interface PipelineListResponse {
  company: {
    pipelines: {
      items: Pipeline[];
    };
  };
}

export interface Database {
  id: string;
  [key: string]: unknown;
}

export interface DatabaseListResponse {
  company: {
    databases: {
      items: Database[];
    };
  };
}

export interface DatabaseResponse {
  database: Database;
}

export interface StaticSite {
  id: string;
  [key: string]: unknown;
}

export interface StaticSiteListResponse {
  company: {
    static_sites: {
      items: StaticSite[];
    };
  };
}

export interface StaticSiteResponse {
  static_site: StaticSite;
}

export interface StaticSiteDeploymentResponse {
  deployment: Deployment;
}

export interface CompanyUser {
  user: {
    id: string;
    email: string;
    image: string;
    full_name: string;
  };
}

export interface CompanyUsersResponse {
  company: {
    users: CompanyUser[];
  };
}

export interface UsageResponse {
  company: {
    usage: unknown;
  };
}

export interface InternalConnectionResponse {
  connection: unknown;
}

export interface CreateDatabaseRequest {
  location: string;
  resource_type: string;
  display_name: string;
  db_name: string;
  db_password: string;
  type: 'postgresql' | 'mariadb' | 'mysql' | 'mongodb' | 'redis' | 'valkey';
  version: string;
  db_user?: string;
  company: string;
}

export interface UpdateDatabaseRequest {
  resource_type?: string;
  display_name?: string;
}

export interface StartDeploymentRequest {
  app_id: string;
  branch?: string;
  docker_image?: string;
  is_restart?: boolean;
}

export interface UpdateApplicationRequest {
  display_name?: string;
  [key: string]: unknown;
}

export interface UpdateProcessRequest {
  [key: string]: unknown;
}

export interface UpdateStaticSiteRequest {
  [key: string]: unknown;
}

export interface CreateInternalConnectionRequest {
  [key: string]: unknown;
}

export interface ToggleRequest {
  app_id: string;
  enabled: boolean;
}

export interface PromoteApplicationRequest {
  app_id: string;
  pipeline_id: string;
  source_app_id?: string;
}

export interface CreatePreviewAppRequest {
  pipeline_id: string;
  branch: string;
  [key: string]: unknown;
}

export interface DeployStaticSiteRequest {
  static_site_id: string;
  branch?: string;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface ApiError {
  message: string;
  status: number;
  error_code?: string;
}
