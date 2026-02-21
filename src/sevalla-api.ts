// Copyright (c) 2026 84EM LLC (https://84em.io). MIT License.

import type {
  ApplicationListResponse,
  ApplicationResponse,
  CompanyUsersResponse,
  CreateDatabaseRequest,
  CreateInternalConnectionRequest,
  CreatePreviewAppRequest,
  DatabaseListResponse,
  DatabaseResponse,
  DeploymentResponse,
  DeployStaticSiteRequest,
  PaginationParams,
  PipelineListResponse,
  ProcessResponse,
  PromoteApplicationRequest,
  StartDeploymentRequest,
  StaticSiteDeploymentResponse,
  StaticSiteListResponse,
  StaticSiteResponse,
  UpdateApplicationRequest,
  UpdateDatabaseRequest,
  UpdateProcessRequest,
  UpdateStaticSiteRequest,
  UsageResponse,
} from './types.js';

export class SevallaAPI {
  private baseUrl = 'https://api.sevalla.com/v2';
  private headers: Record<string, string>;
  private companyId: string;

  constructor(apiKey: string, companyId: string) {
    this.companyId = companyId;
    this.headers = {
      'Authorization': `Bearer ${apiKey.trim()}`,
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: unknown,
    retries = 3
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          method,
          headers: this.headers,
          body: body ? JSON.stringify(body) : undefined,
        });

        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const delay = retryAfter ? parseInt(retryAfter, 10) * 1000 : (i + 1) * 2000;
          console.error(`Rate limited, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        if (response.status === 401 || response.status === 403) {
          const text = await response.text();
          throw new Error(`Authentication failed (${response.status}): ${text}`);
        }

        if (response.status === 204) {
          return {} as T;
        }

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`API error ${response.status}: ${text}`);
        }

        return await response.json() as T;
      } catch (error) {
        if (i === retries - 1) throw error;
        if (error instanceof Error && error.message.startsWith('Authentication failed')) throw error;
        const delay = (i + 1) * 1000;
        console.error(`Request failed, retrying in ${delay}ms...`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error(`Request failed after ${retries} retries`);
  }

  private buildQuery(params: Record<string, string | number | undefined>): string {
    const entries = Object.entries(params).filter(([, v]) => v !== undefined);
    if (entries.length === 0) return '';
    return '?' + entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&');
  }

  // --- Company ---

  async getCompanyUsers(): Promise<CompanyUsersResponse> {
    return this.request<CompanyUsersResponse>('GET', `/company/${this.companyId}/users`);
  }

  async getUsage(periodOffset?: number): Promise<UsageResponse> {
    const query = this.buildQuery({ period_offset: periodOffset });
    return this.request<UsageResponse>('GET', `/company/${this.companyId}/paas-usage${query}`);
  }

  // --- Applications ---

  async getApplications(pagination?: PaginationParams): Promise<ApplicationListResponse> {
    const query = this.buildQuery({
      company: this.companyId,
      limit: pagination?.limit,
      offset: pagination?.offset,
    });
    return this.request<ApplicationListResponse>('GET', `/applications${query}`);
  }

  async getApplication(appId: string): Promise<ApplicationResponse> {
    const query = this.buildQuery({ company: this.companyId });
    return this.request<ApplicationResponse>('GET', `/applications/${appId}${query}`);
  }

  async updateApplication(appId: string, updates: UpdateApplicationRequest): Promise<ApplicationResponse> {
    return this.request<ApplicationResponse>('PUT', `/applications/${appId}`, updates);
  }

  async deleteApplication(appId: string): Promise<void> {
    const query = this.buildQuery({ company: this.companyId });
    await this.request<unknown>('DELETE', `/applications/${appId}${query}`);
  }

  async promoteApplication(body: PromoteApplicationRequest): Promise<unknown> {
    return this.request<unknown>('POST', `/applications/promote`, body);
  }

  // --- Processes ---

  async getProcess(processId: string): Promise<ProcessResponse> {
    const query = this.buildQuery({ company: this.companyId });
    return this.request<ProcessResponse>('GET', `/applications/processes/${processId}${query}`);
  }

  async updateProcess(processId: string, updates: UpdateProcessRequest): Promise<ProcessResponse> {
    return this.request<ProcessResponse>('PUT', `/applications/processes/${processId}`, updates);
  }

  // --- Networking ---

  async createInternalConnection(appId: string, body: CreateInternalConnectionRequest): Promise<unknown> {
    return this.request<unknown>('POST', `/applications/${appId}/internal-connections`, body);
  }

  async toggleCdn(appId: string, enabled: boolean): Promise<unknown> {
    return this.request<unknown>('POST', `/applications/${appId}/cdn/toggle-status`, { enabled });
  }

  async toggleEdgeCache(appId: string, enabled: boolean): Promise<unknown> {
    return this.request<unknown>('POST', `/applications/${appId}/edge-cache/toggle-status`, { enabled });
  }

  async clearCache(appId: string): Promise<unknown> {
    return this.request<unknown>('POST', `/applications/${appId}/clear-cache`);
  }

  // --- Deployments ---

  async getDeployment(deploymentId: string): Promise<DeploymentResponse> {
    const query = this.buildQuery({ company: this.companyId });
    return this.request<DeploymentResponse>('GET', `/applications/deployments/${deploymentId}${query}`);
  }

  async startDeployment(body: StartDeploymentRequest): Promise<DeploymentResponse> {
    return this.request<DeploymentResponse>('POST', `/applications/deployments`, body);
  }

  // --- Pipelines ---

  async getPipelines(pagination?: PaginationParams): Promise<PipelineListResponse> {
    const query = this.buildQuery({
      company: this.companyId,
      limit: pagination?.limit,
      offset: pagination?.offset,
    });
    return this.request<PipelineListResponse>('GET', `/pipelines${query}`);
  }

  async createPreviewApp(pipelineId: string, body: CreatePreviewAppRequest): Promise<unknown> {
    return this.request<unknown>('POST', `/pipelines/${pipelineId}/create-preview-app`, body);
  }

  // --- Databases ---

  async getDatabases(pagination?: PaginationParams): Promise<DatabaseListResponse> {
    const query = this.buildQuery({
      company: this.companyId,
      limit: pagination?.limit,
      offset: pagination?.offset,
    });
    return this.request<DatabaseListResponse>('GET', `/databases${query}`);
  }

  async getDatabase(databaseId: string): Promise<DatabaseResponse> {
    return this.request<DatabaseResponse>('GET', `/databases/${databaseId}`);
  }

  async createDatabase(body: CreateDatabaseRequest): Promise<DatabaseResponse> {
    return this.request<DatabaseResponse>('POST', `/databases`, { ...body, company: this.companyId });
  }

  async updateDatabase(databaseId: string, updates: UpdateDatabaseRequest): Promise<DatabaseResponse> {
    return this.request<DatabaseResponse>('PUT', `/databases/${databaseId}`, updates);
  }

  async deleteDatabase(databaseId: string): Promise<void> {
    await this.request<unknown>('DELETE', `/databases/${databaseId}`);
  }

  // --- Static Sites ---

  async getStaticSites(pagination?: PaginationParams): Promise<StaticSiteListResponse> {
    const query = this.buildQuery({
      company: this.companyId,
      limit: pagination?.limit,
      offset: pagination?.offset,
    });
    return this.request<StaticSiteListResponse>('GET', `/static-sites${query}`);
  }

  async getStaticSite(staticSiteId: string): Promise<StaticSiteResponse> {
    return this.request<StaticSiteResponse>('GET', `/static-sites/${staticSiteId}`);
  }

  async updateStaticSite(staticSiteId: string, updates: UpdateStaticSiteRequest): Promise<StaticSiteResponse> {
    return this.request<StaticSiteResponse>('PUT', `/static-sites/${staticSiteId}`, updates);
  }

  async deleteStaticSite(staticSiteId: string): Promise<void> {
    await this.request<unknown>('DELETE', `/static-sites/${staticSiteId}`);
  }

  async getStaticSiteDeployment(deploymentId: string): Promise<StaticSiteDeploymentResponse> {
    return this.request<StaticSiteDeploymentResponse>('GET', `/static-site-deployments/${deploymentId}`);
  }

  async deployStaticSite(body: DeployStaticSiteRequest): Promise<StaticSiteDeploymentResponse> {
    return this.request<StaticSiteDeploymentResponse>('POST', `/static-site-deployments`, body);
  }
}
