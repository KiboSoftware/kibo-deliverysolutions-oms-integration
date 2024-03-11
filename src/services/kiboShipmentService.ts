import { Configuration } from "@kibocommerce/rest-sdk";
import {
  EntityModelOfShipment,
  Shipment,
  ShipmentApi,
  ShipmentNotesApi,
} from "@kibocommerce/rest-sdk/clients/Fulfillment";
import { TenantConfiguration } from "../types/tenantConfiguration";
import { KiboApiContext } from "../types/kiboContext";
import { DeliverySolutionsOrder } from "../types/deliverySolutions";

export class KiboShipmentService {
  private shipmentApi: ShipmentApi;
  shipmentNotesApi: ShipmentNotesApi;
  constructor(config: TenantConfiguration, context: KiboApiContext) {
    const configuration = new Configuration({
      tenantId: context.tenantId?.toString(),
      siteId: context.siteId?.toString(),
      catalog: context.catalogId?.toString(),
      masterCatalog: context.masterCatalogId?.toString(),
      sharedSecret: config.kiboCredentials.clientSecret,
      clientId: config.kiboCredentials.clientId,
      authHost: config.kiboCredentials.api,
      apiHost: config.dsCredentials.api,
    });
    this.shipmentApi = new ShipmentApi(configuration);
    this.shipmentNotesApi = new ShipmentNotesApi(configuration);
  }
  async getShipmentById(
    shipmentNumber: number
  ): Promise<EntityModelOfShipment> {
    return await this.shipmentApi.getShipmentUsingGET({ shipmentNumber });
  }

  async updateTracking(
    deliverySolutionsOrder: DeliverySolutionsOrder,
    kiboShipment: EntityModelOfShipment
  ): Promise<EntityModelOfShipment> {

    const shipmentPatch : any= {
        "shopperNotes": {
            "deliveryInstructions": deliverySolutionsOrder.trackingUrl 
        }
    }
    return await this.shipmentApi.replaceShipmentUsingPUT({shipmentNumber: kiboShipment.shipmentNumber || 0,
        updateFields:"shopperNotes.deliveryInstructions",
        shipment: shipmentPatch as Shipment        
    });
   
  }
}
