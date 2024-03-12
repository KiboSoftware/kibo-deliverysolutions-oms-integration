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
            const result = yield dynamoDb
                .get({ TableName: process.env.DYNAMODB_TABLE, Key: { id } })
                .promise();
            return result.Item;
        });
    }
    getAllConfigs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield dynamoDb
                .scan({ TableName: process.env.DYNAMODB_TABLE })
                .promise();
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
    getConfigByKiboTenant2(kiboTenant) {
        return __awaiter(this, void 0, void 0, function* () {
            kiboTenant = parseInt(kiboTenant.toString());
            const filter = { kiboTenant: kiboTenant };
            try {
                const result = yield dynamoDb
                    .get({ TableName: process.env.DYNAMODB_TABLE, Key: filter })
                    .promise();
                return result.Item;
            }
            catch (err) {
                console.log("Error getting config by kiboTenant", filter, process.env.DYNAMODB_TABLE);
                console.log(err);
                throw err;
            }
        });
    }
    getConfigByKiboTenant(kiboTenant) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: process.env.DYNAMODB_TABLE,
                FilterExpression: "#kt = :kt",
                ExpressionAttributeNames: {
                    "#kt": "kiboTenant",
                },
                ExpressionAttributeValues: {
                    ":kt": kiboTenant,
                },
            };
            const result = yield dynamoDb.scan(params).promise();
            // If items are found, return the first item. Otherwise, return null.
            return ((_a = result.Items) !== null && _a !== void 0 ? _a : [])[0];
        });
    }
    getConfigByKiboSite(kiboSite) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: process.env.DYNAMODB_TABLE,
                FilterExpression: "contains(#ks, :ks)",
                ExpressionAttributeNames: {
                    "#ks": "kiboSite",
                },
                ExpressionAttributeValues: {
                    ":ks": kiboSite,
                },
            };
            const result = yield dynamoDb.scan(params).promise();
            // If items are found, return the first item. Otherwise, return null.
            return ((_a = result.Items) !== null && _a !== void 0 ? _a : [])[0];
        });
    }
    getConfigByDsTenant(dsTenant) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: process.env.DYNAMODB_TABLE,
                FilterExpression: "#dt = :dt",
                ExpressionAttributeNames: {
                    "#dt": "dsTenant",
                },
                ExpressionAttributeValues: {
                    ":dt": dsTenant,
                },
            };
            const result = yield dynamoDb.scan(params).promise();
            // If items are found, return the first item. Otherwise, return null.
            return ((_a = result.Items) !== null && _a !== void 0 ? _a : [])[0];
        });
    }
}
exports.TenantConfigService = TenantConfigService;
//# sourceMappingURL=tenantConfigurationService.js.map