import { KiboAppConfiguration } from "./kiboAppConfigurationService";
import { KiboApiContext } from "../types/kiboContext";

import * as runtime from "@kibocommerce/rest-sdk/client-runtime";

import { Configuration } from "@kibocommerce/rest-sdk";

export class KiboInstalledAppSettingsApi extends runtime.BaseAPI {
  constructor(configuration: Configuration) {
    super(configuration);
    this.basePathTemplate = "https://t{tenantId}.{env}.mozu.com/api";
  }

  async getSettings(
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<runtime.ApiResponse<KiboInstalledAppSettings>> {
    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    await this.addAuthorizationHeaders(headerParameters);

    const response = await this.request(
      {
        path: `/commerce/settings/applications`,
        method: "GET",
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides
    );

    return new runtime.JSONApiResponse(response);
  }

  async updateSettings(
    body: KiboInstalledAppSettings,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<runtime.ApiResponse<KiboInstalledAppSettings>> {
    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    headerParameters["Content-Type"] = "application/json";

    await this.addAuthorizationHeaders(headerParameters);

    const response = await this.request(
      {
        path: `/commerce/settings/applications`,
        method: "PUT",
        headers: headerParameters,
        query: queryParameters,
        body: body,
      },
      initOverrides
    );

    return new runtime.JSONApiResponse(response);
  }
}
export class KiboApplicationService {
  client: KiboInstalledAppSettingsApi;

  constructor({    
    apiContext,
    appConfig,
  }: {
    apiContext: KiboApiContext;
    appConfig: KiboAppConfiguration;
  }) {
    const configuration = new Configuration({
      tenantId: apiContext.tenantId?.toString(),
      fetchApi: fetch,
      siteId: apiContext.siteId?.toString(),
      catalog: apiContext.catalogId?.toString(),
      masterCatalog: apiContext.masterCatalogId?.toString(),
      sharedSecret: appConfig.clientSecret,
      clientId: appConfig.clientId,
      authHost: appConfig.homeHost,
    });
    this.client = new KiboInstalledAppSettingsApi(configuration);
  }

  async getSettings(): Promise<KiboInstalledAppSettings> {
    const resp = await this.client.getSettings();
    return await resp.value();
  }

  async updateSettings(
    newSettings: KiboInstalledAppSettings
  ): Promise<KiboInstalledAppSettings> {
    const resp = await this.client.updateSettings(newSettings);
    return await resp.value();
  }
}

export interface KiboInstalledAppSettings {
  appId: string;
  uiConfigurationUrl: string;
  capabilities: any[];
  isExtension: boolean;
  initialized: boolean;
  enabled: boolean;
  appKey: string;
  isExtensionCertified: boolean;
}
