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
exports.handler = void 0;
const tenantConfigurationService_1 = require("../services/tenantConfigurationService");
const deliverySolutionsOrderSync_1 = require("../processors/deliverySolutionsOrderSync");
const kiboContext_1 = require("../types/kiboContext");
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const detail = event.detail;
    const body = detail === null || detail === void 0 ? void 0 : detail.body;
    const extendedProperties = body === null || body === void 0 ? void 0 : body.extendedProperties;
    const apiContext = (0, kiboContext_1.initKiboApiContextFromHeaders)(detail.headers);
    if (apiContext.tenantId == undefined) {
        console.error("No tenantId found in headers");
        return;
    }
    const config = yield new tenantConfigurationService_1.TenantConfigService().getConfigByKiboTenant(apiContext.tenantId);
    console.log(event, event.detail.body);
    if (!config) {
        console.error("No config found fer tenant", apiContext.tenantId);
        return;
    }
    if (event["detail-type"] != "shipment.workflowstatechanged") {
        console.log("Not a shipment.workflowstatechanged event");
        return;
    }
    if (extendedProperties == null) {
        console.error("No extendedProperties found in event");
        return;
    }
    const newState = (_a = extendedProperties.find((prop) => prop.key === "newState")) === null || _a === void 0 ? void 0 : _a.value;
    if (newState) {
        console.log(newState);
    }
    else {
        console.error("newState not found in extendedProperties");
        return;
    }
    const shipmentNumber = parseInt(body.entityId);
    if (isNaN(shipmentNumber)) {
        console.error("Invalid shipmentNumber", body.entityId);
        return;
    }
    const deliverySolutionsOrderSync = new deliverySolutionsOrderSync_1.DeliverySolutionsOrderSync(config, apiContext);
    try {
        switch (newState) {
            case "ACCEPTED_SHIPMENT": //todo make configurable
                yield deliverySolutionsOrderSync.processShipmentCreate(body.entityId);
                break;
            case "BACKORDER": //todo make configurable
                yield deliverySolutionsOrderSync.processShipmentCancel(body.entityId);
                break;
            case "PARTIAL_INVENTORY_NOPE": //todo make configurable
                yield deliverySolutionsOrderSync.updateShipmentItems(body.entityId);
                break;
            case "READY_FOR_DELIVERY":
                yield deliverySolutionsOrderSync.releaseShipment(body.entityId);
                break;
            default:
                console.log("Not an actionable state change event");
                return;
        }
    }
    catch (e) {
        console.error("Error creating order", e);
    }
});
exports.handler = handler;
exports.default = exports.handler;
//# sourceMappingURL=kibo.js.map