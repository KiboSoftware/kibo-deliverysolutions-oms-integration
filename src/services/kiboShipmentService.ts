import { Configuration } from "@kibocommerce/rest-sdk";
import { EntityModelOfShipment, ShipmentApi, ShipmentNotesApi, ShipmentDataApi, shipmentNotesApiParams } from "@kibocommerce/rest-sdk/clients/Fulfillment";
import { KiboApiContext } from "../types/kiboContext";
import { KiboAppConfiguration } from "./kiboAppConfigurationService";
import * as runtime from "@kibocommerce/rest-sdk/client-runtime";

export class KiboShipmentService {
  shipmentApi: ShipmentApi2;
  shipmentNotesApi: ShipmentNotesApi;
  shipmentDataApi: ShipmentDataApi;

  constructor({ apiContext, appConfig }: { apiContext: KiboApiContext; appConfig: KiboAppConfiguration }) {
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
    this.shipmentApi = new ShipmentApi2(configuration);
    this.shipmentNotesApi = new ShipmentNotesApi(configuration);
    this.shipmentDataApi = new ShipmentDataApi(configuration);
  }
  async getShipmentById(shipmentNumber: number): Promise<EntityModelOfShipment> {
    return await this.shipmentApi.getShipment({ shipmentNumber });
  }

  async addNote(shipmentNumber: number, noteText: string): Promise<any> {
    const newNoteRequest = {
      shipmentNumber,
      shipmentNoteDto: {
        noteText,
      },
    } as shipmentNotesApiParams.NewShipmentNoteRequest;
    const result =await this.shipmentNotesApi.newShipmentNote(newNoteRequest);
    return result;
  }

  async appendLog(shipmentNumber: number, text: string): Promise<any> {
    const existing: any = (await this.shipmentDataApi.getShipmentData({ shipmentNumber })) || {};
    const eventNumber = Object.keys(existing).filter((key) => key.startsWith("event")).length + 1;
    const data: any = {};
    data[`event_${eventNumber}`] = `${new Date().toISOString()} ${text}`;
    
    return await this.shipmentDataApi.replaceShipmentData({ shipmentNumber, merge: true, data });
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
  async sendToCustomerCare(shipmentNumber: number): Promise<EntityModelOfShipment> {
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
  async markImutable (shipmentNumber:number, body:{ blockedActions: string[],reason :string } ):Promise<EntityModelOfShipment> {
    
    return await this.shipmentApi.makeImMutable({
      shipmentNumber: shipmentNumber,
      body: body
    });

  }
  async markMutable (shipmentNumber:number, body:{ blockedActions?: string[], reason :string } ):Promise<EntityModelOfShipment> {
    return await this.shipmentApi.makeMutable({
      shipmentNumber: shipmentNumber,
      body: body
    });
  }
  async execute(shipmentNumber: number, taskName: string): Promise<EntityModelOfShipment> {
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


export class ShipmentApi2 extends ShipmentApi {
  constructor(configuration: Configuration) {
    super(configuration);    
  }

  async makeMutable(
    requestParameters: {shipmentNumber:number, body:{ reason :string }}, initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<EntityModelOfShipment> {
    const queryParameters: any = {};
   
    const headerParameters: runtime.HTTPHeaders = {};

    await this.addAuthorizationHeaders(headerParameters);
    headerParameters['Content-Type'] = 'application/json';
    const response = await this.request(
      {
        path: `/commerce/shipments/${requestParameters.shipmentNumber}/mutable`,
        method: "PUT",
        body:requestParameters.body,
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides
    );

    const reps2 =  new runtime.JSONApiResponse(response);
    return await reps2.value();
  }

  async makeImMutable(
    requestParameters: {shipmentNumber:number, body:{ blockedActions: string[],reason :string }}, initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<EntityModelOfShipment> {
    const queryParameters: any = {};
   
    const headerParameters: runtime.HTTPHeaders = {};

    await this.addAuthorizationHeaders(headerParameters);
    headerParameters['Content-Type'] = 'application/json';
    const response = await this.request(
      {
        path: `/commerce/shipments/${requestParameters.shipmentNumber}/immutable`,
        method: "PUT",
        body:requestParameters.body,
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides
    );

    const reps2 =  new runtime.JSONApiResponse(response);
    return await reps2.value();
  }
}
