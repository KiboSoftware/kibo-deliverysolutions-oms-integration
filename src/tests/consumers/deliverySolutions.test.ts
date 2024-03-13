// // import { Context, EventBridgeEvent } from "aws-lambda";
// // import { TenantConfigService } from "../../services/tenantConfigurationService";
// // import { DeliverySolutionsOrderSync } from "../../processors/deliverySolutionsOrderSync";
// // jest.mock("../services/tenantConfigService");
// // jest.mock("../services/deliverySolutionsOrderSync");

// // describe("handler", () => {
// //   let event: EventBridgeEvent<string, any>;
// //   let context: Context;

// //   beforeEach(() => {
// //     event = {
// //       detail: {
// //         tenantId: "123",
// //         orderExternalId: "456",
// //       },
// //       "detail-type": "ORDER_CANCELLED",
// //     };
// //     context = {} as Context;
// //   });

// //   afterEach(() => {
// //     jest.clearAllMocks();
// //   });

// //   test("should cancel Kibo shipment when event type is ORDER_CANCELLED", async () => {
// //     const config = { /* mocked config object */ };
// //     const apiContext = { /* mocked apiContext object */ };
// //     const deliverySolutionsOrderSync = { cancelKiboShipment: jest.fn() };

// //     TenantConfigService.prototype.getConfigByDsTenant.mockResolvedValue(config);
// //     DeliverySolutionsOrderSync.mockImplementation(() => deliverySolutionsOrderSync);

// //     await handler(event, context);

// //     expect(TenantConfigService.prototype.getConfigByDsTenant).toHaveBeenCalledWith("123");
// //     expect(DeliverySolutionsOrderSync).toHaveBeenCalledWith(config, apiContext);
// //     expect(deliverySolutionsOrderSync.cancelKiboShipment).toHaveBeenCalledWith("456");
// //   });

// //   test("should mark Kibo shipment as delivered when event type is ORDER_DELIVERED", async () => {
// //     event["detail-type"] = "ORDER_DELIVERED";
// //     const config = { /* mocked config object */ };
// //     const apiContext = { /* mocked apiContext object */ };
// //     const deliverySolutionsOrderSync = { markKiboShipmentDelivered: jest.fn() };

// //     TenantConfigService.prototype.getConfigByDsTenant.mockResolvedValue(config);
// //     DeliverySolutionsOrderSync.mockImplementation(() => deliverySolutionsOrderSync);

// //     await handler(event, context);

// //     expect(TenantConfigService.prototype.getConfigByDsTenant).toHaveBeenCalledWith("123");
// //     expect(DeliverySolutionsOrderSync).toHaveBeenCalledWith(config, apiContext);
// //     expect(deliverySolutionsOrderSync.markKiboShipmentDelivered).toHaveBeenCalledWith("456");
// //   });

// //   test("should log error when no config found for tenant", async () => {
// //     TenantConfigService.prototype.getConfigByDsTenant.mockResolvedValue(null);
// //     console.error = jest.fn();

// //     await handler(event, context);

// //     expect(TenantConfigService.prototype.getConfigByDsTenant).toHaveBeenCalledWith("123");
// //     expect(console.error).toHaveBeenCalledWith("No config found for tenant 123");
// //   });

// //   test("should log error when an unknown event type is received", async () => {
// //     event["detail-type"] = "UNKNOWN_EVENT_TYPE";
// //     console.log = jest.fn();

// //     await handler(event, context);

// //     expect(console.log).toHaveBeenCalledWith("Unknown event type", "UNKNOWN_EVENT_TYPE");
// //   });

// //   test("should log error when an error occurs during event processing", async () => {
// //     const error = new Error("Something went wrong");
// //     console.log = jest.fn();
// //     TenantConfigService.prototype.getConfigByDsTenant.mockRejectedValue(error);

// //     await handler(event, context);

// //     expect(TenantConfigService.prototype.getConfigByDsTenant).toHaveBeenCalledWith("123");
// //     expect(console.log).toHaveBeenCalledWith("Error processing event", error);
// //   });
// // });import { Context, EventBridgeEvent } from "aws-lambda";
// import { TenantConfigService } from "../../services/tenantConfigurationService";
// import { DeliverySolutionsOrderSync } from "../../processors/deliverySolutionsOrderSync";
// import { handler } from "../../consumers/deliverySolutions";
// import { Context, EventBridgeEvent } from "aws-lambda";

// jest.mock("../../services/tenantConfigurationService", () => {
//     return {
//         TenantConfigService: jest.fn().mockImplementation(() => {
//             return {
//                 getConfigByDsTenant: jest.fn()
//             };
//         })
//     };
// });
// jest.mock("../../processors/deliverySolutionsOrderSync");

// describe("handler", () => {
//   let event: EventBridgeEvent<string, any>;
//   let context: Context;

//   beforeEach(() => {
//     event = {
    
//         id: "7bf73129-1428-4cd3-a780-95db273d1602",
//         version: "0",
//         account: "123456789012",
//         time: "2017-12-22T18:43:48Z",
//         region: "us-west-1",
//         source: "kibo",
//       detail: {
//         tenantId: "123",
//         orderExternalId: "456",
//       },
//       "detail-type": "ORDER_CANCELLED",
//     } as EventBridgeEvent<string, any>;
//     context = {} as Context;
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   test("should cancel Kibo shipment when event type is ORDER_CANCELLED", async () => {
//     const config = { /* mocked config object */ };
//     const apiContext = { /* mocked apiContext object */ };
//     const deliverySolutionsOrderSync = { cancelKiboShipment: jest.fn() };

//     TenantConfigService.prototype.getConfigByDsTenant.mockResolvedValue(config);
//     DeliverySolutionsOrderSync.mockImplementation(() => deliverySolutionsOrderSync);

//     await handler(event, context);

//     expect(TenantConfigService.prototype.getConfigByDsTenant).toHaveBeenCalledWith("123");
//     expect(DeliverySolutionsOrderSync).toHaveBeenCalledWith(config, apiContext);
//     expect(deliverySolutionsOrderSync.cancelKiboShipment).toHaveBeenCalledWith("456");
//   });

//   test("should mark Kibo shipment as delivered when event type is ORDER_DELIVERED", async () => {
//     event["detail-type"] = "ORDER_DELIVERED";
//     const config = { /* mocked config object */ };
//     const apiContext = { /* mocked apiContext object */ };
//     const deliverySolutionsOrderSync = { markKiboShipmentDelivered: jest.fn() };

//     TenantConfigService.prototype.getConfigByDsTenant.mockResolvedValue(config);
//     DeliverySolutionsOrderSync.mockImplementation(() => deliverySolutionsOrderSync);

//     await handler(event, context);

//     expect(TenantConfigService.prototype.getConfigByDsTenant).toHaveBeenCalledWith("123");
//     expect(DeliverySolutionsOrderSync).toHaveBeenCalledWith(config, apiContext);
//     expect(deliverySolutionsOrderSync.markKiboShipmentDelivered).toHaveBeenCalledWith("456");
//   });

//     const mockGetConfigByDsTenant = jest.fn().mockResolvedValue(null);
//     TenantConfigService.prototype.getConfigByDsTenant = mockGetConfigByDsTenant;
//     console.error = jest.fn();

//     await handler(event, context);

//     expect(TenantConfigService.prototype.getConfigByDsTenant).toHaveBeenCalledWith("123");
//     expect(console.error).toHaveBeenCalledWith("No config found for tenant 123");
//   });

//   test("should log error when an unknown event type is received", async () => {
//     event["detail-type"] = "UNKNOWN_EVENT_TYPE";
//     console.log = jest.fn();

//     await handler(event, context);

//     expect(console.log).toHaveBeenCalledWith("Unknown event type", "UNKNOWN_EVENT_TYPE");
//   });

//   test("should log error when an error occurs during event processing", async () => {
//     const error = new Error("Something went wrong");
//     console.log = jest.fn();
//     TenantConfigService.prototype.getConfigByDsTenant.mockRejectedValue(error);

//     await handler(event, context);

//     expect(TenantConfigService.prototype.getConfigByDsTenant).toHaveBeenCalledWith("123");
//     expect(console.log).toHaveBeenCalledWith("Error processing event", error);
//   });
// });