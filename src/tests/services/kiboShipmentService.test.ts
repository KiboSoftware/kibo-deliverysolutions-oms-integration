import {
  EntityModelOfShipment,
  ShipmentApi,
  ShipmentNotesApi,
} from "@kibocommerce/rest-sdk/clients/Fulfillment";
import { KiboShipmentService } from "../../services/kiboShipmentService";
import { Configuration } from "@kibocommerce/rest-sdk";
import { TenantConfiguration } from "../../types/tenantConfiguration";
import { KiboApiContext } from "../../types/kiboContext";

describe("KiboShipmentService", () => {
  let shipmentApi: ShipmentApi;
  let shipmentNotesApi: ShipmentNotesApi;
  let kiboShipmentService: KiboShipmentService;
  let config: TenantConfiguration;
  let apiContext: KiboApiContext;

  beforeEach(() => {
    config = {
      id: "34851",
      dsCredentials: {
        api: process.env.DS_API || "https://api.deliverysolutions.co",
        apiKey: process.env.DS_API_KEY || "",
      },
      dsTenant: "kibo",
      
      locationMapping: [
        {
          kibo: "70672974049",
          ds: "002",
        },
      ],

      kiboSites: [65126],
      kiboTenant: parseInt(process.env.KIBO_TENANT || "") || 0,
    };

    apiContext = {
      tenantId: parseInt(process.env.KIBO_TENANT || "") || 0,
      siteId: 47032,
      masterCatalogId: 1,
      catalogId: 1,
      localeCode: "en-US",
      currencyCode: "USD",
    };
  });

  describe("getShipmentById", () => {
    test("should return shipment by ID", async () => {
      const shipmentNumber = 123;
      const expectedShipment: EntityModelOfShipment = {
        /* mocked shipment object */
      };
      shipmentApi.getShipment = jest.fn().mockResolvedValue(expectedShipment);

      const result = await kiboShipmentService.getShipmentById(shipmentNumber);

      expect(result).toEqual(expectedShipment);
      expect(shipmentApi.getShipment).toHaveBeenCalledWith({ shipmentNumber });
    });
  });

  describe("cancel", () => {
    test("should cancel shipment", async () => {
      const shipmentNumber = 123;
      const expectedShipment: EntityModelOfShipment = {
        /* mocked shipment object */
      };
      shipmentApi.cancelShipment = jest
        .fn()
        .mockResolvedValue(expectedShipment);

      const result = await kiboShipmentService.cancel(shipmentNumber);

      expect(result).toEqual(expectedShipment);
      expect(shipmentApi.cancelShipment).toHaveBeenCalledWith({
        shipmentNumber,
        cancelShipmentRequestDto: {
          canceledReason: {
            reasonCode: "Customer changed mind.",
          },
        },
      });
    });
  });

  describe("sendToCustomerCare", () => {
    test("should send shipment to customer care", async () => {
      const shipmentNumber = 123;
      const expectedShipment: EntityModelOfShipment = {
        /* mocked shipment object */
      };
      shipmentApi.customerCareShipment = jest
        .fn()
        .mockResolvedValue(expectedShipment);

      const result = await kiboShipmentService.sendToCustomerCare(
        shipmentNumber
      );

      expect(result).toEqual(expectedShipment);
      expect(shipmentApi.customerCareShipment).toHaveBeenCalledWith({
        shipmentNumber,
        rejectShipmentRequestDto: {
          rejectedReason: {
            reasonCode: "DSP Driver refused delivery.",
          },
          blockAssignment: true,
        },
      });
    });
  });

  describe("execute", () => {
    test("should execute shipment task", async () => {
      const shipmentNumber = 123;
      const taskName = "task";
      const expectedShipment: EntityModelOfShipment = {
        /* mocked shipment object */
      };
      shipmentApi.execute = jest.fn().mockResolvedValue(expectedShipment);

      const result = await kiboShipmentService.execute(
        shipmentNumber,
        taskName
      );

      expect(result).toEqual(expectedShipment);
      expect(shipmentApi.execute).toHaveBeenCalledWith({
        shipmentNumber,
        taskName,
        taskCompleteDto: {
          taskBody: {},
        },
      });
    });
  });
});
