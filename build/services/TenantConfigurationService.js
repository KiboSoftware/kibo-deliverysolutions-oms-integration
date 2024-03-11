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
exports.TenantConfigService = void 0;
const aws_sdk_1 = require("aws-sdk");
const dynamoDb = new aws_sdk_1.DynamoDB.DocumentClient();
class TenantConfigService {
    getConfigById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield dynamoDb.get({ TableName: process.env.DYNAMODB_TABLE, Key: { id } }).promise();
            return result.Item;
        });
    }
    getAllConfigs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield dynamoDb.scan({ TableName: process.env.DYNAMODB_TABLE }).promise();
        });
    }
    upsert(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: process.env.DYNAMODB_TABLE,
                Item: config,
            };
            return yield dynamoDb.put(params).promise();
        });
    }
    getConfigByKiboTenant(kiboTenant) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield dynamoDb.get({ TableName: process.env.DYNAMODB_TABLE, Key: { kiboTenant } }).promise();
            return result.Item;
        });
    }
    getConfigByKiboSite(kiboSite) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield dynamoDb.get({ TableName: process.env.DYNAMODB_TABLE, Key: { kiboSite } }).promise();
            return result.Item;
        });
    }
    getConfigByDsTenant(dsTenant) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield dynamoDb.get({ TableName: process.env.DYNAMODB_TABLE, Key: { dsTenant } }).promise();
            return result.Item;
        });
    }
}
exports.TenantConfigService = TenantConfigService;
//# sourceMappingURL=tenantConfigurationService.js.map