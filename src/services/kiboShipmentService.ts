import { Configuration } from "@kibocommerce/rest-sdk";
import {
  EntityModelOfShipment,
  ShipmentApi,
  ShipmentNotesApi,
} from "@kibocommerce/rest-sdk/clients/Fulfillment";
import { TenantConfiguration } from "../types/tenantConfiguration";
import { KiboApiContext } from "../types/kiboContext";

export class KiboShipmentService {
  shipmentApi: ShipmentApi;
  shipmentNotesApi: ShipmentNotesApi;

  constructor(config: TenantConfiguration, context: KiboApiContext) {
    const configuration = new Configuration({
      tenantId: context.tenantId?.toString(),
      siteId: context.siteId?.toString(),
      fetchApi: fetch,
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
    return await this.shipmentApi.getShipment({ shipmentNumber });
  }

  async cancel(shipmentNumber: number): Promise<EntityModelOfShipment> {
    const requestParams = {
      shipmentNumber,
      cancelShipmentRequestDto: {
        canceledReason: {
          reasonCode: "Customer changed mind.",
        },
      },
    };
    return await this.shipmentApi.cancelShipment(requestParams);
  }
  async sendToCustomerCare(
    shipmentNumber: number
  ): Promise<EntityModelOfShipment> {
    const requestParams = {
      shipmentNumber,
      rejectShipmentRequestDto: {
        rejectedReason: {
          reasonCode: "DSP Driver refused delivery.",
        },
        blockAssignment: true,
      },
    };
    return await this.shipmentApi.customerCareShipment(requestParams);
  }

  async execute(
    shipmentNumber: number,
    taskName: string
  ): Promise<EntityModelOfShipment> {
    const requestParams = {
      shipmentNumber,
      taskName,
      taskCompleteDto: {
        taskBody: {},
      },
    };

    return await this.shipmentApi.execute(requestParams);
  }

  async updateTracking(): // deliverySolutionsOrder: DeliverySolutionsOrder,
  // kiboShipment: EntityModelOfShipment
  Promise<EntityModelOfShipment> {
    // const shipmentPatch: any = {
    //   shopperNotes: {
    //     deliveryInstructions: deliverySolutionsOrder.trackingUrl,
    //   },
    // };
    return Promise.resolve({} as EntityModelOfShipment);
    // return await this.shipmentApi.replaceShipment({
    //   shipmentNumber: kiboShipment.shipmentNumber || 0,
    //   updateFields: ["shopperNotes.deliveryInstructions"],
    //   shipment: shipmentPatch as Shipment,
    // });
  }
}
