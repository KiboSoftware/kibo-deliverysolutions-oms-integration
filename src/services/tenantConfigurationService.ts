import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyHandler, APIGatewayEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { TenantConfiguration } from '../types/tenantConfiguration';
const dynamoDb = new DynamoDB.DocumentClient();



export class TenantConfigService {
    async getConfigById(id: string): Promise<TenantConfiguration> {
        const result = await dynamoDb.get({ TableName: process.env.DYNAMODB_TABLE!, Key: { id } }).promise();
        return result.Item as TenantConfiguration;
    }
    async getAllConfigs(){
        return await dynamoDb.scan({ TableName: process.env.DYNAMODB_TABLE! }).promise();
    }
    async upsert(config: TenantConfiguration){
     
        const params = {
            TableName: process.env.DYNAMODB_TABLE!,
            Item: config,
        };
        return await dynamoDb.put(params).promise();
    }
    async getConfigByKiboTenant(kiboTenant: number): Promise<TenantConfiguration> {
        const result = await dynamoDb.get({ TableName: process.env.DYNAMODB_TABLE!, Key: { kiboTenant } }).promise();
        return result.Item as TenantConfiguration;
    }
    async getConfigByKiboSite(kiboSite: number): Promise<TenantConfiguration> {
        const result = await dynamoDb.get({ TableName: process.env.DYNAMODB_TABLE!, Key: { kiboSite } }).promise();
        return result.Item as TenantConfiguration;
    }
    
    async getConfigByDsTenant(dsTenant: string): Promise<TenantConfiguration> {
        const result = await dynamoDb.get({ TableName: process.env.DYNAMODB_TABLE!, Key: { dsTenant } }).promise();
        return result.Item as TenantConfiguration;
    }
    
}



