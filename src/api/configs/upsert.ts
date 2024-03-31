import { APIGatewayProxyHandler, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import  {TenantConfigService}  from '../../services/tenantConfigurationService';
import { TenantConfiguration } from '../../types/tenantConfiguration';  

export const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent, ): Promise<APIGatewayProxyResult> => {
  const tenantConfigService = new TenantConfigService();
  const tenantConfig = JSON.parse(event.body || '{}') as TenantConfiguration;
  const id: string = event.pathParameters?.id || '';  
  if (id !== tenantConfig.id){
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Id in the body does not match id in the path' }),
    };
  }
  console.log('put', id, tenantConfig);
  try {
    await tenantConfigService.upsert(tenantConfig);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(tenantConfig),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'An error occurred when getting the config' }),
    };
  }
};