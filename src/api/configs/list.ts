import { APIGatewayProxyHandlerV2,  APIGatewayProxyResultV2 , APIGatewayProxyEventV2} from 'aws-lambda';
import  {TenantConfigService}  from '../../services/tenantConfigurationService';
import { KiboAppConfigurationService } from '../../services/kiboAppConfigurationService';
import { JwtService } from '../../services/jwtService';

export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  const sharedSecret =  KiboAppConfigurationService.getCurrent().clientSecret;  
  const jwtService = new JwtService(sharedSecret);
  const token = jwtService.readJwtFromEvent(event);
  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized' }),
    };
  }
  const tenantId: number = token.tenantId;

  const tenantConfigService = new TenantConfigService(); 
  console.log('list');
  try {
    const configs = await tenantConfigService.getAllConfigs(tenantId);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Credentials': true,
      },
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