import { APIGatewayProxyHandler, APIGatewayEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import  {TenantConfigService}  from '../../services/tenantConfigurationService';
import { TenantConfiguration } from '../../types/tenantConfiguration';  
export const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const tenantConfigService = new TenantConfigService(); 
  console.log('list');
  try {
    const configs = await tenantConfigService.getAllConfigs();

    return {
      statusCode: 200,
      body: JSON.stringify(configs),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'An error occurred when getting the config' }),
    };
  }
};