import { Configuration } from "@kibocommerce/rest-sdk";
import {
  EntityModelOfShipment,
  ShipmentApi,
  ShipmentNotesApi,
  shipmentNotesApiParams,
} from "@kibocommerce/rest-sdk/clients/Fulfillment";
import { TenantConfiguration } from "../types/tenantConfiguration";
import { KiboApiContext } from "../types/kiboContext";
import { KiboAppConfiguration } from "./kiboAppConfigurationService";

export class KiboShipmentService {
  shipmentApi: ShipmentApi;
  shipmentNotesApi: ShipmentNotesApi;

  constructor({
    apiContext,
    appConfig,
  }: {
    apiContext: KiboApiContext;
    appConfig: KiboAppConfiguration;
  }) {
    const configuration = new Configuration({
      tenantId: apiContext.tenantId?.toString(),
      siteId: apiContext.siteId?.toString(),
      fetchApi: fetch,
      catalog: apiContext.catalogId?.toString(),
      masterCatalog: apiContext.masterCatalogId?.toString(),
      sharedSecret: appConfig.clientSecret,
      clientId: appConfig.clientId,
      authHost: appConfig.homeHost,
    });
    this.shipmentApi = new ShipmentApi(configuration);
    this.shipmentNotesApi = new ShipmentNotesApi(configuration);
   
  }
  async getShipmentById(
    shipmentNumber: number
  ): Promise<EntityModelOfShipment> {
    return await this.shipmentApi.getShipment({ shipmentNumber });
  }

  async addNote (shipmentNumber: number, noteText:string) : Promise<any>{

    const newNoteRequest = {
      shipmentNumber,
      shipmentNoteDto:{
        noteText
      }
    } as shipmentNotesApiParams.NewShipmentNoteRequest
    const result = await this.shipmentNotesApi.newShipmentNote(newNoteRequest);
    return result;
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
