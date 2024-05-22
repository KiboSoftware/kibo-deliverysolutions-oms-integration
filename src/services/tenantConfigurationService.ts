import { DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { TenantConfiguration } from "../types/tenantConfiguration";

const DYNAMODB_TABLE = process.env.DYNAMODB_CONFIG_TABLE!;
export class TenantConfigService {
  static dynamoDb = new DynamoDBClient({ region: process.env.AWS_REGION });
  

  async getConfigById(id: string): Promise<TenantConfiguration> {
    const command = new GetItemCommand({
      TableName: DYNAMODB_TABLE,
      Key: marshall({ id }),
    });
    const result = await TenantConfigService.dynamoDb.send(command);
    return unmarshall(result.Item) as TenantConfiguration;
  }

  async getAllConfigs() {
    const command = new ScanCommand({ TableName: DYNAMODB_TABLE});
    const result = await TenantConfigService.dynamoDb.send(command);
    return result.Items?.map(item => unmarshall(item)) as TenantConfiguration[];
  }

  async upsert(config: TenantConfiguration) {
    const command = new PutItemCommand({
      TableName: process.env.DYNAMODB_CONFIG_TABLE!,
      Item: marshall(config),
    });
    return await TenantConfigService.dynamoDb.send(command);
  }

  async getConfigByKiboTenant2(kiboTenant: number): Promise<TenantConfiguration> {
    kiboTenant = parseInt(kiboTenant.toString());
    const command = new GetItemCommand({
      TableName: DYNAMODB_TABLE,
      Key: marshall({ kiboTenant }),
    });
    const result = await TenantConfigService.dynamoDb.send(command);
    return unmarshall(result.Item) as TenantConfiguration;
  }

  async getConfigByKiboTenant(kiboTenant: number): Promise<TenantConfiguration | null> {
    const command = new ScanCommand({
      TableName: DYNAMODB_TABLE,
      FilterExpression: "#kt = :kt",
      ExpressionAttributeNames: {
        "#kt": "kiboTenant",
      },
      ExpressionAttributeValues: marshall({
        ":kt": kiboTenant,
      }),
    });

    const result = await TenantConfigService.dynamoDb.send(command);

    // If items are found, return the first item. Otherwise, return null.
    return result.Items ? unmarshall(result.Items[0]) as TenantConfiguration : null;
  }

  async getConfigByKiboSite(kiboSite: number): Promise<TenantConfiguration | null> {
    const command = new ScanCommand({
      TableName: DYNAMODB_TABLE,
      FilterExpression: "contains(#ks, :ks)",
      ExpressionAttributeNames: {
        "#ks": "kiboSite",
      },
      ExpressionAttributeValues: marshall({
        ":ks": kiboSite,
      }),
    });

    const result = await TenantConfigService.dynamoDb.send(command);

    // If items are found, return the first item. Otherwise, return null.
    return result.Items && result.Items.length ? unmarshall(result.Items[0]) as TenantConfiguration : null;
  }

  async getConfigByDsTenant(dsTenant: string): Promise<TenantConfiguration | null> {
    const command = new ScanCommand({
      TableName: DYNAMODB_TABLE,
      FilterExpression: "#dt = :dt",
      ExpressionAttributeNames: {
        "#dt": "dsTenant",
      },
      ExpressionAttributeValues: marshall({
        ":dt": dsTenant,
      }),
    });

    const result = await TenantConfigService.dynamoDb.send(command);

    // If items are found, return the first item. Otherwise, return null.
    return result.Items && result.Items.length  ? unmarshall(result.Items[0]) as TenantConfiguration : null;
  }

  
  // async getConfigById(id: string): Promise<TenantConfiguration> {
  //   const result = await TenantConfigService.dynamoDb
  //     .get({ TableName: DYNAMODB_TABLE, Key: { id } })
  //     .promise();
  //   return result.Item as TenantConfiguration;
  // }
  // async getAllConfigs() {
  //   return await TenantConfigService.dynamoDb
  //     .scan({ TableName: DYNAMODB_TABLE })
  //     .promise();
  // }
  // async upsert(config: TenantConfiguration) {
  //   const params = {
  //     TableName: DYNAMODB_TABLE,
  //     Item: config,
  //   };
  //   return await TenantConfigService.dynamoDb.put(params).promise();
  // }

  // async getConfigByKiboTenant2(
  //   kiboTenant: number
  // ): Promise<TenantConfiguration> {
  //   kiboTenant = parseInt(kiboTenant.toString());
  //   const filter = { kiboTenant: kiboTenant };
  //   try {
  //     const result = await TenantConfigService.dynamoDb
  //       .get({ TableName: DYNAMODB_TABLE, Key: filter })
  //       .promise();
  //     return result.Item as TenantConfiguration;
  //   } catch (err) {
  //     console.log(
  //       "Error getting config by kiboTenant",
  //       filter,
  //       process.env.DYNAMODB_TABLE
  //     );
  //     console.log(err);
  //     throw err;
  //   }
  // }
  // async getConfigByKiboTenant(
  //   kiboTenant: number
  // ): Promise<TenantConfiguration | null> {
   
  //   const params = {
  //     TableName: DYNAMODB_TABLE,
  //     FilterExpression: "#kt = :kt",
  //     ExpressionAttributeNames: {
  //       "#kt": "kiboTenant",
  //     },
  //     ExpressionAttributeValues: {
  //       ":kt": kiboTenant,
  //     },
  //   };

  //   const result = await TenantConfigService.dynamoDb.scan(params).promise();

  //   // If items are found, return the first item. Otherwise, return null.
  //   return (result.Items ?? [])[0] as TenantConfiguration;
  // }

  // async getConfigByKiboSite(kiboSite: number): Promise<TenantConfiguration> {
  //   const params = {
  //     TableName: DYNAMODB_TABLE,
  //     FilterExpression: "contains(#ks, :ks)",
  //     ExpressionAttributeNames: {
  //       "#ks": "kiboSite",
  //     },
  //     ExpressionAttributeValues: {
  //       ":ks": kiboSite,
  //     },
  //   };

  //   const result = await TenantConfigService.dynamoDb.scan(params).promise();

  //   // If items are found, return the first item. Otherwise, return null.
  //   return (result.Items ?? [])[0] as TenantConfiguration;
  // }

  // async getConfigByDsTenant(
  //   dsTenant: string
  // ): Promise<TenantConfiguration | null> {
  //   const params = {
  //     TableName: DYNAMODB_TABLE,
  //     FilterExpression: "#dt = :dt",
  //     ExpressionAttributeNames: {
  //       "#dt": "dsTenant",
  //     },
  //     ExpressionAttributeValues: {
  //       ":dt": dsTenant,
  //     },
  //   };

  //   const result = await TenantConfigService.dynamoDb.scan(params).promise();

  //   // If items are found, return the first item. Otherwise, return null.
  //   return (result.Items ?? [])[0] as TenantConfiguration;
  // }
}
