import axios from 'axios';
import { DeliverySolutionsOrder } from '../types/deliverySolutions';
import { TenantConfiguration } from '../types/tenantConfiguration';

export class DeliverySolutionsService {
    private tenantConfiguration: TenantConfiguration;

    constructor(tenantConfiguration: TenantConfiguration) {
        this.tenantConfiguration = tenantConfiguration;
    }

    async createOrder(order: DeliverySolutionsOrder): Promise<DeliverySolutionsOrder> {
        const url = `${this.tenantConfiguration.dsCredentials.api}/api/v2/order/placeorderasync`;
        const headers = {
            'tenantId': this.tenantConfiguration.dsTenant,
            'x-api-key': this.tenantConfiguration.dsCredentials.apiKey
        };

        const response = await axios.post(url, order, { headers });

        return response.data as DeliverySolutionsOrder;
    }
}