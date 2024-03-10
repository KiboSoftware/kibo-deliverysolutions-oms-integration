import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyHandler, APIGatewayEvent, Context, APIGatewayProxyResult } from 'aws-lambda';

const dynamoDb = new DynamoDB.DocumentClient();

interface TenantConfiguration {
    id: string;
    kiboTenant: number;
    kiboSites: number[];
    dsTenant: string;
    kiboCredentials: {
      clientId: string;
      clientSecret: string;
      api: string;
    };
    dsCredentials: {
      apiKey: string;
      api: string;
    };
  }

class TenantConfigService {
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
    async getConfigByKiboSite(kiboSite: number): Promise<TenantConfiguration> {
        const result = await dynamoDb.get({ TableName: process.env.DYNAMODB_TABLE!, Key: { kiboSite } }).promise();
        return result.Item as TenantConfiguration;
    }
    
    async getConfigByDsTenant(dsTenant: string): Promise<TenantConfiguration> {
        const result = await dynamoDb.get({ TableName: process.env.DYNAMODB_TABLE!, Key: { dsTenant } }).promise();
        return result.Item as TenantConfiguration;
    }
    
}
export { TenantConfigService , TenantConfiguration};




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