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
// export const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
//   if (!process.env.DYNAMODB_TABLE) {
//     throw new Error('DYNAMODB_TABLE is not defined');
//   }
//   const TableName = process.env.DYNAMODB_TABLE;
//   const params = {
//   TableName,
//     Item: {
//       id: '123',
//       dsTenant: 'tenant1',
//       kiboSite: 456,
//       settings: { setting1: 'value1' },
//       dsConfig: { config1: 'value1' },
//       kiboConfig: { config1: 'value1' },
//     },
//   };
//   // write the todo to the database
//   await dynamoDb.put(params).promise();
//   // read the todo from the database
//   const result = await dynamoDb.get({ TableName, Key: { id: '123' } }).promise();
//   // return the retrieved item
//   return { statusCode: 200, body: JSON.stringify(result.Item) };
// };
