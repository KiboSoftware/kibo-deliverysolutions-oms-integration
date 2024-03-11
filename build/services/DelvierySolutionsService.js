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
exports.DeliverySolutionsService = void 0;
const axios_1 = require("axios");
class DeliverySolutionsService {
    constructor(tenantConfiguration) {
        this.tenantConfiguration = tenantConfiguration;
    }
    createOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.tenantConfiguration.dsCredentials.api}/api/v2/order/placeorderasync`;
            const headers = {
                'tenantId': this.tenantConfiguration.dsTenant,
                'x-api-key': this.tenantConfiguration.dsCredentials.apiKey
            };
            const response = yield axios_1.default.post(url, order, { headers });
            return response.data;
        });
    }
}
exports.DeliverySolutionsService = DeliverySolutionsService;
