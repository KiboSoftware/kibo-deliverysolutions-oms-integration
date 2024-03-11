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
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    const detail = event.detail;
    const body = detail === null || detail === void 0 ? void 0 : detail.body;
    const extendedProperties = body === null || body === void 0 ? void 0 : body.extendedProperties;
    const tenant = detail === null || detail === void 0 ? void 0 : detail.headers['x-vol-tenant'];
    const config = yield new tenantConfigurationService_1.TenantConfigService().getConfigByKiboTenant(tenant);
    if (!config) {
        console.error('No config found for tenant', tenant);
        return;
    }
    //todo look up cofig for when to create the ordre in ds
    // Process the event detail
    console.log(event, event.detail.body);
});
exports.handler = handler;
