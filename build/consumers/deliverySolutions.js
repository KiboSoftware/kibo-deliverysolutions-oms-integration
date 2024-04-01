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
const kiboAppConfigurationService_1 = require("../services/kiboAppConfigurationService");
const appConfig = kiboAppConfigurationService_1.KiboAppConfigurationService.getCurrent();
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const detail = event.detail;
    const dsTenant = detail.tenantId;
    const tenantConfig = yield new tenantConfigurationService_1.TenantConfigService().getConfigByDsTenant(dsTenant);
    if (!tenantConfig) {
        console.error(`No config found for tenant ${dsTenant}`);
        return;
    }
    const apiContext = (0, kiboContext_1.initKiboApiContextFromTenantConfig)(tenantConfig);
    const deliverySolutionsOrderSync = new deliverySolutionsOrderSync_1.DeliverySolutionsOrderSync({
        tenantConfig,
        apiContext,
        appConfig,
    });
    try {
        switch (event["detail-type"]) {
            case "ORDER_CANCELLED":
                yield deliverySolutionsOrderSync.cancelKiboShipment(event.detail);
                break;
            case "ORDER_DELIVERED":
                yield deliverySolutionsOrderSync.markKiboShipmentDelivered(event.detail);
                break;
            default:
                console.log("Unknown event type", event["detail-type"]);
                break;
        }
    }
    catch (err) {
        console.log("Error processing event", err);
        return;
    }
});
exports.handler = handler;
exports.default = exports.handler;
//# sourceMappingURL=deliverySolutions.js.map