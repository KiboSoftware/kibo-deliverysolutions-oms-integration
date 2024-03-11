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
  const config = await new TenantConfigService().getConfigByKiboTenant(
    apiContext.tenantId
  );

  console.log(event, event.detail.body);
  if (!config) {
    console.error("No config found for tenant", apiContext.tenantId);
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

  if (newState !== "ACCEPTED_SHIPMENT") {
    console.log("Not an ACCEPTED_SHIPMENT event");
    return;
  }

  try {
    const deliverySolutionsOrderSync = new DeliverySolutionsOrderSync(
      config,
      apiContext
    );
    deliverySolutionsOrderSync.processShipmentCreate(body.shipmentNumber);
  } catch (e) {
    console.error("Error creating order", e);
  }

  //todo look up config for when to create the order in ds

  //todo look up cofig for when to create the ordre in ds

  // Process the event detail
};

export default handler;
