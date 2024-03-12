import { EventBridgeEvent, Context } from "aws-lambda";
import { TenantConfigService } from "../services/tenantConfigurationService";
import { DeliverySolutionsOrderSync } from "../processors/deliverySolutionsOrderSync";
import { initKiboApiContextFromHeaders } from "../types/kiboContext";

export const handler = async (
  event: EventBridgeEvent<string, any>,
  context: Context
) => {
  const detail = event.detail;
  const body = detail?.body;
  const extendedProperties = body?.extendedProperties;
  const apiContext = initKiboApiContextFromHeaders(detail.headers);
  if ( apiContext.tenantId == undefined ) {
    console.error("No tenantId found in headers");
    return;
  }
  const config = await new TenantConfigService().getConfigByKiboTenant(
    apiContext.tenantId 
  );

  console.log(event, event.detail.body);
  if (!config) {
    console.error("No config found fer tenant", apiContext.tenantId);
    return;
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
  if ( isNaN(shipmentNumber) ) {
    console.error("Invalid shipmentNumber", body.entityId);
    return;
  }

  const deliverySolutionsOrderSync = new DeliverySolutionsOrderSync(
    config,
    apiContext
  );


  try{
  switch (newState) {
    case "ACCEPTED_SHIPMENT": //todo make configurable
      await deliverySolutionsOrderSync.processShipmentCreate(body.entityId);
      break;
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
    console.error("Error creating order", e);
  }

  
};

export default handler;
