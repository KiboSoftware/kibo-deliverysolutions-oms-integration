import { EntityModelOfShipment } from "@kibocommerce/rest-sdk/clients/Fulfillment/models";
import { DeliverySolutionsOrder, TimeWindow } from "../types/deliverySolutions";
import { TenantConfiguration } from "../types/tenantConfiguration";
import parsePhoneNumber, { CountryCode } from 'libphonenumber-js'

function getImageUrl(url: string | null): string {
  if (!url) {
    return '';
  }

  if (url.startsWith('//')) {
    return 'https:' + url;
  }
  return url;
}
function mapPackages(  {
  kiboShipment,
  tenantConfig
  
}: {
  kiboShipment: EntityModelOfShipment,
  tenantConfig: TenantConfiguration
 
}){
  return [
      {
         "name":"custom",
         "size":{
            "length":15,
            "width":25,
            "height":25
         },
         "weight":10,
         "items":1,
         "temperatureControl":"none",
         "description":"Small",
         "quantity":1
      }
   ];
}
function mapTimeWindows( {data, attributes}:{data?:any, attributes?: any}){
  if(data?.confirmedWindow){
    return  JSON.parse(data.confirmedWindow);
  }
  return {};
}
function toInternationalPhoneNubmer ({rawPhone, countryCodeStr}:{rawPhone:string, countryCodeStr?:string}){

  const countryCode = ((countryCodeStr?.toUpperCase()) || 'US' ) as CountryCode
  const phoneNumber = parsePhoneNumber(rawPhone, countryCode);
  return phoneNumber?.formatInternational();

}

function mapNotifications( {data}:{data?:any}){   
  
  return {
    notifySms: data?.delviery?.notifySms || true,
    notifyEmail: data?.delviery?.notifyEmail || true
  }
}

export function mapKiboShipmentToDsOrder(
  {
    kiboShipment,
    tenantConfig
    
  }: {
    kiboShipment: EntityModelOfShipment,
    tenantConfig: TenantConfiguration
   
  }
 
): DeliverySolutionsOrder {
  
  const deliveryContact = kiboShipment.destination?.destinationContact;

  let storeExternalId = kiboShipment.fulfillmentLocationCode;
  if (tenantConfig.locationMapping) {
    storeExternalId =
      tenantConfig.locationMapping.find(
        (x) => x.kibo === kiboShipment.fulfillmentLocationCode
      )?.ds || kiboShipment.fulfillmentLocationCode;
  }

  const timeWindows = mapTimeWindows(kiboShipment);
  const notifySettings = mapNotifications (kiboShipment);
  const packages = mapPackages({tenantConfig,kiboShipment});
  return {
    pickupTime: timeWindows?.pickupTime,
    dropoffTime: timeWindows?.dropoffTime,
    deliveryContact: {
      name:
        deliveryContact?.firstName + " " + deliveryContact?.lastNameOrSurname,
      phone: toInternationalPhoneNubmer({rawPhone:deliveryContact?.phoneNumbers?.mobile ||
        deliveryContact?.phoneNumbers?.home ||
        deliveryContact?.phoneNumbers?.work ,countryCodeStr: deliveryContact?.address?.countryCode}),
      email: deliveryContact?.email,
      notifySms: notifySettings?.notifySms,
      notifyEmail: notifySettings?.notifyEmail
    },
    deliveryAddress: {
      street: deliveryContact?.address?.address1 || "",
      street2: deliveryContact?.address?.address2 || "",
      city: deliveryContact?.address?.cityOrTown || "",
      state: deliveryContact?.address?.stateOrProvince || "",
      zipcode: deliveryContact?.address?.postalOrZipCode || "",
      country: deliveryContact?.address?.countryCode || "",
    },
    // dispatch: {
    //   type: "manual",
    // },
    type: "delivery",
    storeExternalId: storeExternalId,
    orderExternalId: 'kibo_'+ kiboShipment.shipmentNumber?.toString() ,
    orderValue: kiboShipment.total || 0,
    tips: 0,
    packages:packages,
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

