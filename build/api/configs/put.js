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
const tenantConfig_1 = require("../../util/tenantConfig");
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const tenantConfig = new tenantConfig_1.default();
    const body = JSON.parse(event.body || '{}');
    const id = ((_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.id) || '';
    console.log('put', id, body);
    try {
        yield tenantConfig.upsert(body);
        return {
            statusCode: 200,
            body: JSON.stringify(body),
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
