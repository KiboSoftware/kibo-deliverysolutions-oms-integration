export interface TenantConfiguration {
  id: string;
  kiboTenant: number;
  kiboSites: number[];
  dsTenant: string;
  kiboCredentials: {
    clientId: string;
    clientSecret: string;
    api: string;
  };
  dsCredentials: {
    apiKey: string;
    api: string;
  };
}
