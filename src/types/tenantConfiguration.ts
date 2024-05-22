export interface TenantConfiguration {
  id: string;
  kiboTenant: number;
  kiboSites: number[];
  dsTenant: string;
  locationMapping: LocationMapping[];
  createOrderEvent?: string;
  orderReadyEvent?: string;
  tipProductCode?: string;
  // kiboCredentials: {
  //   clientId: string;
  //   clientSecret: string;
  //   api: string;
  // };
  dsCredentials: dsCredentials;
}

export interface LocationMapping {
  kibo: string;
  ds: string;
}

export interface dsCredentials {
  apiKey: string;
  api: string;
}