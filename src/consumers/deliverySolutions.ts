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
      default:
        await deliverySolutionsOrderSync.logEvent ( event["detail-type"], event.detail);
        console.log("Unknown event type", event["detail-type"]);
        break;
    }
  } catch (err) {
    console.log("Error processing event", err);
    return;
  }
};
export default handler;
