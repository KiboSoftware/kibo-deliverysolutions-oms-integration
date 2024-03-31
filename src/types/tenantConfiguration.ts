export interface TenantConfiguration {
  id: string;
  kiboTenant: number;
  kiboSites: number[];
  dsTenant: string;
  locationMapping: LocationMapping[];
  createOrderEvent: string;
  orderReadyEvent: string;
  tipProductCode: string;
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

interface LocationMapping {
  kibo: string;
  ds: string;
}
