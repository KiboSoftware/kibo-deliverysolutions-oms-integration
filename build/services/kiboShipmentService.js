"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KiboShipmentService = void 0;
const rest_sdk_1 = require("@kibocommerce/rest-sdk");
const Fulfillment_1 = require("@kibocommerce/rest-sdk/clients/Fulfillment");
class KiboShipmentService {
    constructor(config, context) {
        var _a, _b, _c, _d;
        const configuration = new rest_sdk_1.Configuration({
            tenantId: (_a = context.tenantId) === null || _a === void 0 ? void 0 : _a.toString(),
            siteId: (_b = context.siteId) === null || _b === void 0 ? void 0 : _b.toString(),
            catalog: (_c = context.catalogId) === null || _c === void 0 ? void 0 : _c.toString(),
            masterCatalog: (_d = context.masterCatalogId) === null || _d === void 0 ? void 0 : _d.toString(),
            sharedSecret: config.kiboCredentials.clientSecret,
            clientId: config.kiboCredentials.clientId,
            authHost: config.kiboCredentials.api,
            apiHost: config.dsCredentials.api,
        });
        this.shipmentApi = new Fulfillment_1.ShipmentApi(configuration);
        this.shipmentNotesApi = new Fulfillment_1.ShipmentNotesApi(configuration);
    }
    getShipmentById(shipmentNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.shipmentApi.getShipment({ shipmentNumber });
        });
    }
    cancel(shipmentNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            let requestParams = {
                shipmentNumber,
                cancelShipmentRequestDto: {
                    canceledReason: {
                        reasonCode: "Customer changed mind.",
                    },
                },
            };
            return yield this.shipmentApi.cancelShipment(requestParams);
        });
    }
    sendToCustomerCare(shipmentNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            let requestParams = {
                shipmentNumber,
                rejectShipmentRequestDto: {
                    rejectedReason: {
                        reasonCode: "DSP Driver refused delivery.",
                    },
                    blockAssignment: true,
                },
            };
            return yield this.shipmentApi.customerCareShipment(requestParams);
        });
    }
    execute(shipmentNumber, taskName) {
        return __awaiter(this, void 0, void 0, function* () {
            let requestParams = {
                shipmentNumber,
                taskName,
                taskCompleteDto: {
                    taskBody: {},
                },
            };
            return yield this.shipmentApi.execute(requestParams);
        });
    }
    updateTracking(deliverySolutionsOrder, kiboShipment) {
        return __awaiter(this, void 0, void 0, function* () {
            const shipmentPatch = {
                shopperNotes: {
                    deliveryInstructions: deliverySolutionsOrder.trackingUrl,
                },
            };
            return Promise.resolve({});
            // return await this.shipmentApi.replaceShipment({
            //   shipmentNumber: kiboShipment.shipmentNumber || 0,
            //   updateFields: ["shopperNotes.deliveryInstructions"],
            //   shipment: shipmentPatch as Shipment,
            // });
        });
    }
}
exports.KiboShipmentService = KiboShipmentService;
//# sourceMappingURL=kiboShipmentService.js.map