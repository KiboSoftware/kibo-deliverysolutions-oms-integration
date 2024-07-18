import { EventBridgeEvent } from "aws-lambda";
import { TenantConfigService } from "../services/tenantConfigurationService";
import { DeliverySolutionsOrderSync } from "../processors/deliverySolutionsOrderSync";
import { initKiboApiContextFromTenantConfig } from "../types/kiboContext";
import { KiboAppConfigurationService } from "../services/kiboAppConfigurationService";
const appConfig = KiboAppConfigurationService.getCurrent();
export const handler = async (event: EventBridgeEvent<string, any>) => {
  const detail = event.detail;
  const dsTenant = detail.tenantId;

  const tenantConfig = await new TenantConfigService().getConfigByDsTenant(
    dsTenant
  );
  if (!tenantConfig) {
    console.error(`No config found for tenant ${dsTenant}`);
    return;
  }
  const apiContext = initKiboApiContextFromTenantConfig(tenantConfig);
  const deliverySolutionsOrderSync = new DeliverySolutionsOrderSync({
    tenantConfig,
    apiContext,
    appConfig,
  });
  try{
    await deliverySolutionsOrderSync.logEvent ( event["detail-type"], event.detail);
  }
  catch (err) {
      console.error(detail);
      console.error("Error processing event", err);
  }
  try {
    switch (event["detail-type"]) {
      case "ORDER_CANCELLED":
        await deliverySolutionsOrderSync.cancelKiboShipment(event.detail);
        break;
      case "ORDER_DELIVERED":
        await deliverySolutionsOrderSync.markKiboShipmentDelivered(
          event.detail
        );
        break;
        case "ORDER_DISPATCHED":
          await deliverySolutionsOrderSync.blockKiboOrderCancel(
            event.detail
          );
          break;
      default:        
        break;
    }
  } catch (err) {
    console.error(detail);
    console.error("Error processing event", err);
    throw err;
  }
};
export default handler;
