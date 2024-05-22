import { EventBridgeEvent } from "aws-lambda";
import { TenantConfigService } from "../services/tenantConfigurationService";
import { DeliverySolutionsOrderSync } from "../processors/deliverySolutionsOrderSync";
import { initKiboApiContextFromHeaders } from "../types/kiboContext";
import { ApplicationEventProcessor } from "../processors/applicationEventProcessor";
import { KiboAppConfigurationService } from "../services/kiboAppConfigurationService";
const appConfig = KiboAppConfigurationService.getCurrent();
export const handler = async (event: EventBridgeEvent<string, any>) => {
  const detail = event.detail;
  const body = detail?.body;
  const extendedProperties = body?.extendedProperties;
  const apiContext = initKiboApiContextFromHeaders(detail.headers);
  if (apiContext.tenantId == undefined) {
    console.error("No tenantId found in headers");
    return;
  }
  const tenantConfig = await new TenantConfigService().getConfigByKiboTenant(
    apiContext.tenantId
  );

  console.log(event, event.detail.body);
  if (!tenantConfig) {
    console.error("No config found fer tenant", apiContext.tenantId);
    return;
  }
  const eventType: string = event["detail-type"];
  const eventDomain = eventType.split(".")[0];

  if (eventDomain == "application") {
    try {
      return await new ApplicationEventProcessor({
        tenantConfig,
        appConfig,
        apiContext,
      }).processEvent(event.detail);
    } catch (e) {
      console.error("Error processing application event", e);
    }
  }

 

  if (event["detail-type"] != "shipment.workflowstatechanged") {
    console.log("Not a shipment.workflowstatechanged event");
    return;
  }
  if (extendedProperties == null) {
    console.error("No extendedProperties found in event");
    return;
  }

  const newState = extendedProperties.find(
    (prop: { key: string }) => prop.key === "newState"
  )?.value;

  if (newState) {
    console.log(newState);
  } else {
    console.error("newState not found in extendedProperties");
    return;
  }
  const shipmentNumber = parseInt(body.entityId);
  if (isNaN(shipmentNumber)) {
    console.error("Invalid shipmentNumber", body.entityId);
    return;
  }

  const deliverySolutionsOrderSync = new DeliverySolutionsOrderSync({
    tenantConfig,
    apiContext,
    appConfig,
  });

  try {
    switch (newState) {
      case "PRE_ACCEPT_SHIPMENT": //todo make configurable
        break;
      case "ACCEPTED_SHIPMENT": //todo make configurable
        await deliverySolutionsOrderSync.processShipmentCreate(body.entityId);
        break;
      case "CANCELED":
      case "BACKORDER": //todo make configurable
        await deliverySolutionsOrderSync.processShipmentCancel(body.entityId);
        break;
      case "PARTIAL_INVENTORY_NOPE": //todo make configurable
        await deliverySolutionsOrderSync.updateShipmentItems(body.entityId);
        break;
      case "READY_FOR_DELIVERY":
        await deliverySolutionsOrderSync.releaseShipment(body.entityId);
        break;
      default:
        console.log("Not an actionable state change event");
        return;
    }
  } catch (e) {
    console.error("Error creating order.", e);
  }
};

export default handler;
