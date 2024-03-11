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
    const config = yield new tenantConfigurationService_1.TenantConfigService().getConfigByKiboTenant(apiContext.tenantId);
    console.log(event, event.detail.body);
    if (!config) {
        console.error("No config found for tenant", apiContext.tenantId);
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
    if (newState !== "ACCEPTED_SHIPMENT") {
        console.log("Not an ACCEPTED_SHIPMENT event");
        return;
    }
    try {
        const deliverySolutionsOrderSync = new deliverySolutionsOrderSync_1.DeliverySolutionsOrderSync(config, apiContext);
        deliverySolutionsOrderSync.processShipmentCreate(body.shipmentNumber);
    }
    catch (e) {
        console.error("Error creating order", e);
    }
    //todo look up config for when to create the order in ds
    //todo look up cofig for when to create the ordre in ds
    // Process the event detail
});
exports.handler = handler;
exports.default = exports.handler;
//# sourceMappingURL=kibo.js.map