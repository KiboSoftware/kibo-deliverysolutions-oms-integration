import { APIGatewayProxyHandler, APIGatewayEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import  {TenantConfigService, TenantConfiguration}  from '../../util/tenantConfig';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const tenantConfigService = new TenantConfigService();
  const id = event.pathParameters?.id;
  console.log('getById', id);
  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing id parameter' }),
    };
  }

  try {
    const config = await tenantConfigService.getConfigById(id);

    return {
      statusCode: 200,
      body: JSON.stringify(config),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'An error occurred when getting the config' }),
    };
  }
};