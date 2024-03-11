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
const tenantConfigurationService_1 = require("../../services/tenantConfigurationService");
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const tenantConfigService = new tenantConfigurationService_1.TenantConfigService();
    const tenantConfig = JSON.parse(event.body || '{}');
    const id = ((_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.id) || '';
    if (id !== tenantConfig.id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Id in the body does not match id in the path' }),
        };
    }
    console.log('put', id, tenantConfig);
    try {
        yield tenantConfigService.upsert(tenantConfig);
        return {
            statusCode: 200,
            body: JSON.stringify(tenantConfig),
        };
    }
    catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'An error occurred when getting the config' }),
        };
    }
});
exports.handler = handler;
//# sourceMappingURL=upsert.js.map