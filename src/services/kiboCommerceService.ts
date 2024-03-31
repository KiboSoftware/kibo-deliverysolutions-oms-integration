import { Configuration } from '@kibocommerce/rest-sdk'
import {  OrderApi, Order } from '@kibocommerce/rest-sdk/clients/Commerce'
import { TenantConfiguration } from '../types/tenantConfiguration'
import { KiboApiContext } from '../types/kiboContext'


export class KiboCommerceService {
    private client: OrderApi
    constructor(config: TenantConfiguration, context: KiboApiContext) {
        const configuration = new Configuration({
        tenantId: context.tenantId?.toString(),
        fetchApi: fetch,
        siteId: context.siteId?.toString(),
        catalog: context.catalogId?.toString(),
        masterCatalog: context.masterCatalogId?.toString(),
        sharedSecret: config.kiboCredentials.clientSecret,
        clientId: config.kiboCredentials.clientId,
        authHost:  config.kiboCredentials.api,
        apiHost: config.dsCredentials.api
        })
        this.client = new OrderApi(configuration)
    }
    async getOrderById(orderId: string) : Promise<Order>{
        return await this.client.getOrder({orderId});
    }
   
    
}
