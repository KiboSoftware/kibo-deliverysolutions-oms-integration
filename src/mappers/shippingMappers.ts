import { EntityModelOfShipment } from "@kibocommerce/rest-sdk/clients/Fulfillment/models";
import { DeliverySolutionsOrder, TimeWindow } from "../types/deliverySolutions";
import { TenantConfiguration } from "../types/tenantConfiguration";

function getImageUrl(url: string | null): string {
  if (!url) {
    return '';
  }

  if (url.startsWith('//')) {
    return 'https:' + url;
  }
  return url;
}

export function mapKiboShipmentToDsOrder(
  kiboShipment: EntityModelOfShipment,
  tenantConfig: TenantConfiguration,
  dropoffTime?: TimeWindow,
  pickupTime?: TimeWindow ,
): DeliverySolutionsOrder {
  
  const deliveryContact = kiboShipment.destination?.destinationContact;

  let storeExternalId = kiboShipment.fulfillmentLocationCode;
  if (tenantConfig.locationMapping) {
    storeExternalId =
      tenantConfig.locationMapping.find(
        (x) => x.kibo === kiboShipment.fulfillmentLocationCode
      )?.ds || kiboShipment.fulfillmentLocationCode;
  }


  return {
    pickupTime: pickupTime,
    dropoffTime: dropoffTime,
    deliveryContact: {
      name:
        deliveryContact?.firstName + " " + deliveryContact?.lastNameOrSurname,
      phone:
        deliveryContact?.phoneNumbers?.mobile ||
        deliveryContact?.phoneNumbers?.home ||
        deliveryContact?.phoneNumbers?.work ||
        "",
      email: deliveryContact?.email,
    },
    deliveryAddress: {
      street: deliveryContact?.address?.address1 || "",
      street2: deliveryContact?.address?.address2 || "",
      city: deliveryContact?.address?.cityOrTown || "",
      state: deliveryContact?.address?.stateOrProvince || "",
      zipcode: deliveryContact?.address?.postalOrZipCode || "",
      country: deliveryContact?.address?.countryCode || "",
    },
    dispatch: {
      type: "manual",
    },
    type: "delivery",
    storeExternalId: storeExternalId,
    orderExternalId: 'kibo_'+ kiboShipment.shipmentNumber?.toString() ,
    orderValue: kiboShipment.total || 0,
    tips: 0,
    itemList:
      kiboShipment.items?.map((item) => ({
        quantity: item.quantity || 0,
        size: {
          height: (item as any).height || 1,
          width: (item as any).width || 1,
          length: (item as any).length || 1,
        },
        image: getImageUrl(item.imageUrl ),
        sku: item.productCode || "",
        weight: item.weight || 1,
        price: item.actualPrice || 0,
        sale_price: item.actualPrice || 0,
        title: item.name || "",
      })) || [],
    isEstimate: false,
    tenantId: tenantConfig.dsTenant,
    isPickup: false,
  };
}
