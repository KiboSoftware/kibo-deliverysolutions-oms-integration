import { EventBridgeEvent, Context } from 'aws-lambda';
import { TenantConfigService } from '../services/tenantConfigurationService'
export const handler = async (event: EventBridgeEvent<string, any>, context: Context) => {
  const detail = event.detail;
  const body = detail?.body;
  const extendedProperties = body?.extendedProperties;
  const tenant = detail?.headers['x-vol-tenant'];
  const config = await  new TenantConfigService().getConfigByKiboTenant( tenant );
  if( !config ){
    console.error('No config found for tenant', tenant);
    return;
  }

  //todo look up cofig for when to create the ordre in ds


  // Process the event detail
  console.log(event, event.detail.body);
};