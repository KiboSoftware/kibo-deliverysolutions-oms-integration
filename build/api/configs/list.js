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
const kiboAppConfigurationService_1 = require("../../services/kiboAppConfigurationService");
const jwtService_1 = require("../../services/jwtService");
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const sharedSecret = kiboAppConfigurationService_1.KiboAppConfigurationService.getCurrent().clientSecret;
    const jwtService = new jwtService_1.JwtService(sharedSecret);
    const token = jwtService.readJwtFromEvent(event);
    if (!token) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Unauthorized' }),
        };
    }
    const tenantId = token.tenantId;
    const tenantConfigService = new tenantConfigurationService_1.TenantConfigService();
    console.log('list');
    try {
        const configs = yield tenantConfigService.getAllConfigs(tenantId);
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(configs),
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
//# sourceMappingURL=list.js.map