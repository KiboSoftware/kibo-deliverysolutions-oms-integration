import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import { TenantConfiguration } from "../types/tenantConfiguration";
const dynamoDb = new DynamoDB.DocumentClient();

export class TenantConfigService {
  async getConfigById(id: string): Promise<TenantConfiguration> {
    const result = await dynamoDb
      .get({ TableName: process.env.DYNAMODB_TABLE!, Key: { id } })
      .promise();
    return result.Item as TenantConfiguration;
  }
  async getAllConfigs() {
    return await dynamoDb
      .scan({ TableName: process.env.DYNAMODB_TABLE! })
      .promise();
  }
  async upsert(config: TenantConfiguration) {
    const params = {
      TableName: process.env.DYNAMODB_TABLE!,
      Item: config,
    };
    return await dynamoDb.put(params).promise();
  }

  async getConfigByKiboTenant2(
    kiboTenant: number
  ): Promise<TenantConfiguration> {
    kiboTenant = parseInt(kiboTenant.toString());
    const filter = { kiboTenant: kiboTenant };
    try {
      const result = await dynamoDb
        .get({ TableName: process.env.DYNAMODB_TABLE!, Key: filter })
        .promise();
      return result.Item as TenantConfiguration;
    } catch (err) {
      console.log(
        "Error getting config by kiboTenant",
        filter,
        process.env.DYNAMODB_TABLE
      );
      console.log(err);
      throw err;
    }
  }
  async getConfigByKiboTenant(
    kiboTenant: number
  ): Promise<TenantConfiguration | null> {
   
    const params = {
      TableName: process.env.DYNAMODB_TABLE!,
      FilterExpression: "#kt = :kt",
      ExpressionAttributeNames: {
        "#kt": "kiboTenant",
      },
      ExpressionAttributeValues: {
        ":kt": kiboTenant,
      },
    };

    const result = await dynamoDb.scan(params).promise();

    // If items are found, return the first item. Otherwise, return null.
    return (result.Items ?? [])[0] as TenantConfiguration;
  }

  async getConfigByKiboSite(kiboSite: number): Promise<TenantConfiguration> {
    const params = {
      TableName: process.env.DYNAMODB_TABLE!,
      FilterExpression: "contains(#ks, :ks)",
      ExpressionAttributeNames: {
        "#ks": "kiboSite",
      },
      ExpressionAttributeValues: {
        ":ks": kiboSite,
      },
    };

    const result = await dynamoDb.scan(params).promise();

    // If items are found, return the first item. Otherwise, return null.
    return (result.Items ?? [])[0] as TenantConfiguration;
  }

  async getConfigByDsTenant(
    dsTenant: string
  ): Promise<TenantConfiguration | null> {
    const params = {
      TableName: process.env.DYNAMODB_TABLE!,
      FilterExpression: "#dt = :dt",
      ExpressionAttributeNames: {
        "#dt": "dsTenant",
      },
      ExpressionAttributeValues: {
        ":dt": dsTenant,
      },
    };

    const result = await dynamoDb.scan(params).promise();

    // If items are found, return the first item. Otherwise, return null.
    return (result.Items ?? [])[0] as TenantConfiguration;
  }
}
