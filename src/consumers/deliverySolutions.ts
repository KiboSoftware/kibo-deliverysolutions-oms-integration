import { EventBridgeEvent } from "aws-lambda";
import { TenantConfigService } from "../services/tenantConfigurationService";
import { DeliverySolutionsOrderSync } from "../processors/deliverySolutionsOrderSync";
import { initKiboApiContextFromTenantConfig } from "../types/kiboContext";

export const handler = async (
  event: EventBridgeEvent<string, any>
) => {
  const detail = event.detail;
  const dsTenant = detail.tenantId;

  const config = await new TenantConfigService().getConfigByDsTenant(dsTenant);
  if (!config) {
    console.error(`No config found for tenant ${dsTenant}`);
    return;
  }
  const apiContext = initKiboApiContextFromTenantConfig(config);
  const deliverySolutionsOrderSync = new DeliverySolutionsOrderSync(
    config,
    apiContext
  );
  try {
    switch (event["detail-type"]) {
      case "ORDER_CANCELLED":
        await deliverySolutionsOrderSync.cancelKiboShipment(
          event.detail,
        );
        break;
      case "ORDER_DELIVERED":
        await deliverySolutionsOrderSync.markKiboShipmentDelivered(
          event.detail
        );
        break;
      default:
        console.log("Unknown event type", event["detail-type"]);
        break;
    }
  } catch (err) {
    console.log("Error processing event", err);
    return;
  }
};
export default handler;