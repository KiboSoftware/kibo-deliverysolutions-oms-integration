import { Configuration } from "@kibocommerce/rest-sdk";
import { OrderApi, Order } from "@kibocommerce/rest-sdk/clients/Commerce";
import { TenantConfiguration } from "../types/tenantConfiguration";
import { KiboApiContext } from "../types/kiboContext";
import { KiboAppConfiguration } from "./kiboAppConfigurationService";

export class KiboCommerceService {
  private client: OrderApi;
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
    this.client = new OrderApi(configuration);
  }
  async getOrderById(orderId: string): Promise<Order> {
    return await this.client.getOrder({ orderId });
  }
}
