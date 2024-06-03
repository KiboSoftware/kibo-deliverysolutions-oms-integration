import { EntityModelOfShipment, FulfillmentAPIProductionProfileItemGoodsTypeEnum } from "@kibocommerce/rest-sdk/clients/Fulfillment/models";
import { DeliverySolutionsOrder, KiboDataBlock, TimeWindow } from "../types/deliverySolutions";
import { TenantConfiguration } from "../types/tenantConfiguration";
import parsePhoneNumber, { isSupportedCountry } from "libphonenumber-js";
import { CommerceRuntimeProductProperty, Order } from "@kibocommerce/rest-sdk/clients/Commerce";

function getImageUrl(url: string | null): string {
  if (!url) {
    return "";
  }

  if (url.startsWith("//")) {
    return "https:" + url;
  }
  return url;
}

function toInternationalPhoneNumber({phoneNumber, countryCode}:{phoneNumber: string, countryCode: string}): string {
  if (isSupportedCountry(countryCode) && phoneNumber) {
    const parsedPhoneNumber = parsePhoneNumber(phoneNumber, countryCode);
    return parsedPhoneNumber?.formatInternational() || "";
  } else {
    const parsedPhoneNumber = parsePhoneNumber(phoneNumber, "US");
    return parsedPhoneNumber?.formatInternational() || "";
  }
}

function mapPackages({ kiboShipment, tenantConfig, kiboDataBlock }: { kiboShipment: EntityModelOfShipment; tenantConfig: TenantConfiguration; kiboDataBlock: KiboDataBlock }) {
  if (kiboDataBlock.packages) {
    return kiboDataBlock.packages;
  }
  const totalWeight = kiboShipment.items?.reduce((total, item) => total + item.weight || 1, 0) || 1;
  return [
    {
      name: "custom",
      size: {
        length: 15,
        width: 25,
        height: 25,
      },
      weight: totalWeight,
      items: 1,
      temperatureControl: "none",
      quantity: 1,
    },
  ];
}
function mapKiboDataBlock(entity:any): KiboDataBlock {
  if (entity?.data?.ds) {
    return entity?.data?.ds as KiboDataBlock;
  }

  if (entity?.data?.KiboDataBlock) {
    return JSON.parse(entity?.data.KiboDataBlock) as KiboDataBlock;
  }

  if (entity?.data?.dropoffTime) {
    return entity?.data as KiboDataBlock;
  }

  return;
}

function mapNotifications(kiboDataBlock: KiboDataBlock): { notifySms?: boolean; notifyEmail?: boolean } {
  return {
    notifySms: kiboDataBlock?.deliveryContact ? kiboDataBlock?.deliveryContact?.notifySms : true,
    notifyEmail: kiboDataBlock?.deliveryContact ? kiboDataBlock?.deliveryContact?.notifyEmail : true,
  };
}

export function mapTimeWindows(kiboDataBlock: KiboDataBlock): { pickupTime: TimeWindow; dropoffTime: TimeWindow } {
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const ret = {
    pickupTime: kiboDataBlock.pickupTime,
    dropoffTime: kiboDataBlock.dropoffTime,
  };

  if (!ret.pickupTime?.startsAt) {
    ret.pickupTime = {};
    ret.pickupTime = {
      startsAt: now.getTime(),
    };
  }
  if (!ret.dropoffTime?.endsAt) {
    ret.dropoffTime = {
      endsAt: tomorrow.getTime(),
    };
  }
  return ret;
}
interface OrderItemFlags {
  isSpirit?: boolean;
  isBeerOrWine?: boolean;  
  isTobacco?: boolean;
  isFragile?: boolean;
  isRx?: boolean;
  hasPerishableItems?: boolean;
  hasRefrigeratedItems?: boolean;
}
function mapOrderItemFlags(kiboShipment: EntityModelOfShipment, kiboOrder: Order): OrderItemFlags {
  const flags :OrderItemFlags = {};
  const dsItemTypeAttribute = 'dsItemType';
  if (kiboShipment.items) {
    kiboShipment.items.forEach((item) => {
      flags.isSpirit = flags.isSpirit || getPropertyValue( { attributeCode:dsItemTypeAttribute, originalOrderItemId: item.originalOrderItemId, kiboOrder: kiboOrder} ) === 'Spirit';
      flags.isBeerOrWine = flags.isBeerOrWine || getPropertyValue( { attributeCode:dsItemTypeAttribute, originalOrderItemId: item.originalOrderItemId, kiboOrder: kiboOrder} ) === 'BeerOrWine';
      flags.isTobacco = flags.isTobacco || getPropertyValue( { attributeCode:dsItemTypeAttribute, originalOrderItemId: item.originalOrderItemId, kiboOrder: kiboOrder} ) === 'Tobacco';
      flags.isRx = flags.isRx || getPropertyValue( { attributeCode:dsItemTypeAttribute, originalOrderItemId: item.originalOrderItemId, kiboOrder: kiboOrder} ) === 'Rx';
      flags.isFragile = flags.isFragile || getPropertyValue( { attributeCode:'dsFragile', originalOrderItemId: item.originalOrderItemId, kiboOrder: kiboOrder} );
      flags.hasPerishableItems = flags.hasPerishableItems || getPropertyValue( { attributeCode:'dsPerishable', originalOrderItemId: item.originalOrderItemId, kiboOrder: kiboOrder} );
      flags.hasRefrigeratedItems = flags.hasRefrigeratedItems || getPropertyValue( { attributeCode:'dsRefrigerated', originalOrderItemId: item.originalOrderItemId, kiboOrder: kiboOrder} );
    });
  }
 
  return flags;

}
function getPropertyValue ( { attributeCode , originalOrderItemId, kiboOrder }: { attributeCode: string; originalOrderItemId: string; kiboOrder: Order }) : any {
  const item = kiboOrder.items?.find((item) => item.id === originalOrderItemId);
  return item?.product.properties?.find((attr) => attr?.attributeFQN?.split('~')[1].toLocaleLowerCase() === attributeCode.toLocaleLowerCase())?.values?.[0]?.value
}
export function mapKiboShipmentToDsOrder({ kiboShipment, kiboOrder, tenantConfig }: { kiboShipment: EntityModelOfShipment; tenantConfig: TenantConfiguration; kiboOrder: Order }): DeliverySolutionsOrder {
  const deliveryContact = kiboShipment.destination?.destinationContact;

  let storeExternalId = kiboShipment.fulfillmentLocationCode;
  if (tenantConfig.locationMapping) {
    storeExternalId = tenantConfig.locationMapping.find((x) => x.kibo === kiboShipment.fulfillmentLocationCode)?.ds || kiboShipment.fulfillmentLocationCode;
  }
  const dataBlock = mapKiboDataBlock(kiboShipment) || mapKiboDataBlock(kiboOrder.fulfillmentInfo) || mapKiboDataBlock(kiboOrder);
  if (!dataBlock) {
    throw new Error("No data block found");
  }
  const orderItemFlags = mapOrderItemFlags(kiboShipment,kiboOrder);
  const timeWindows = mapTimeWindows(dataBlock);
  const notifySettings = mapNotifications(dataBlock);
  const packages = mapPackages({ tenantConfig, kiboShipment, kiboDataBlock: dataBlock });
  return {
    ...orderItemFlags,
    pickupTime: timeWindows?.pickupTime,
    dropoffTime: timeWindows?.dropoffTime,
    tips: dataBlock.tips || 0,
    deliveryContact: {
      name: deliveryContact?.firstName + " " + deliveryContact?.lastNameOrSurname,
      phone: toInternationalPhoneNumber({
        phoneNumber: deliveryContact?.phoneNumbers?.mobile || deliveryContact?.phoneNumbers?.home || deliveryContact?.phoneNumbers?.work,
        countryCode: deliveryContact?.address?.countryCode?.toUpperCase() ,
      }),
      email: deliveryContact?.email || kiboShipment.email || kiboOrder.email,
      notifySms: notifySettings?.notifySms,
      notifyEmail: notifySettings?.notifyEmail,
    },
    deliveryAddress: {
      street: deliveryContact?.address?.address1 || "",
      street2: deliveryContact?.address?.address2 || "",
      city: deliveryContact?.address?.cityOrTown || "",
      state: deliveryContact?.address?.stateOrProvince || "",
      zipcode: deliveryContact?.address?.postalOrZipCode || "",
      country: deliveryContact?.address?.countryCode || "",
    },
    type: "delivery",
    storeExternalId: storeExternalId,
    orderExternalId: "kibo_" + kiboShipment.shipmentNumber?.toString(),
    orderValue: kiboShipment.total || 0,
    packages: packages,
    itemList:
      kiboShipment.items
        ?.filter((item)=>{
          return item.goodsType != FulfillmentAPIProductionProfileItemGoodsTypeEnum.Service
        }).map((item) => ({
        quantity: item.quantity || 0,
        size: {
          height: (item as any).height || 1,
          width: (item as any).width || 1,
          length: (item as any).length || 1,
        },
        image: getImageUrl(item.imageUrl),
        sku: item.productCode || "",
        weight: item.weight || 1,
        price: item.actualPrice || 0,
        sale_price: item.actualPrice || 0,
        title: item.name || ""  
      })) || [],
    isEstimate: false,
    tenantId: tenantConfig.dsTenant,
    isPickup: false,
  };
}
