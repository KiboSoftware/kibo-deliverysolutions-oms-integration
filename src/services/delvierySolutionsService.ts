import axios, { AxiosError } from "axios";
import { DeliverySolutionsOrder } from "../types/deliverySolutions";
import { TenantConfiguration } from "../types/tenantConfiguration";

export class DeliverySolutionsService {
  private tenantConfiguration: TenantConfiguration;

  constructor(tenantConfiguration: TenantConfiguration) {
    this.tenantConfiguration = tenantConfiguration;
  }

  async editOrder(
    order: DeliverySolutionsOrder
  ): Promise<DeliverySolutionsOrder> {
    const url = `${this.tenantConfiguration.dsCredentials.api}/api/v2/order/edit/orderExternalId/${order.orderExternalId}`;
    const headers = {
      tenantId: this.tenantConfiguration.dsTenant,
      "x-api-key": this.tenantConfiguration.dsCredentials.apiKey,
    };

    const response = await axios.post(url, order, { headers });

    return response.data as DeliverySolutionsOrder;
  }

  async createOrder(
    order: DeliverySolutionsOrder
  ): Promise<DeliverySolutionsOrder> {
    const url = `${this.tenantConfiguration.dsCredentials.api}/api/v2/order/placeorderasync`;
    const headers = {
      tenantId: this.tenantConfiguration.dsTenant,
      "x-api-key": this.tenantConfiguration.dsCredentials.apiKey,
    };
    try{
      const response = await axios.post(url, order, { headers });
      return response.data as DeliverySolutionsOrder;
    }
    catch (error) {
      if ((error as AxiosError).response && (error as AxiosError).response.status === 400 && (error as AxiosError).response.headers['content-type'].includes('application/json')) {
        throw new Error(`Request body: ${JSON.stringify(order)}, Response body: ${JSON.stringify((error as AxiosError).response.data)}`);
      }
      throw error;
    }
    
  }

  async cancelOrder(
    orderExternalId: string
  ): Promise<DeliverySolutionsOrder | undefined> {
    const url = `${this.tenantConfiguration.dsCredentials.api}/api/v2/order/orderExternalId/${orderExternalId}`;
    const headers = {
      tenantId: this.tenantConfiguration.dsTenant,
      "x-api-key": this.tenantConfiguration.dsCredentials.apiKey,
    };

    const response = await axios.delete(url, { headers });

    try {
      return response.data as DeliverySolutionsOrder;
    } catch (err) {
      return undefined;
    }
  }
  async getOrder(
    orderExternalId: string
  ): Promise<DeliverySolutionsOrder | undefined> {
    const url = `${this.tenantConfiguration.dsCredentials.api}/api/v2/order/getById/orderExternalId/${orderExternalId}`;
    const headers = {
      tenantId: this.tenantConfiguration.dsTenant,
      "x-api-key": this.tenantConfiguration.dsCredentials.apiKey,
    };

    const response = await axios.get(url, { headers });
    return response.data as DeliverySolutionsOrder;
  }
}
