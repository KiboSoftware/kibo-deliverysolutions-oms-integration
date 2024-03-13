// kiboWebhook
import { EventBridge } from "aws-sdk";
import kiboHandler from "../consumers/kibo";
import { TenantConfiguration } from "../types/tenantConfiguration";

import deliverySolutionsHandler from "../consumers/deliverySolutions";
import {
  KiboApiContext,
  initKiboApiContextFromHeaders,
} from "../types/kiboContext";

import { handler } from "../consumers/kibo";

import { DeliverySolutionsOrderSync } from "../processors/deliverySolutionsOrderSync";

import "global-agent/bootstrap";
import { KiboCommerceService } from "../services/kiboCommerceService";
import { KiboShipmentService } from "../services/kiboShipmentService";
import { Context, EventBridgeEvent } from "aws-lambda";
import { TenantConfigService } from "../services/tenantConfigurationService";

describe("Test Class", () => {
  let config: TenantConfiguration;
  let apiContext: KiboApiContext;

  beforeEach(() => {
    config = {
      id: "34851",
      dsCredentials: {
        api: process.env.DS_API || "https://api.deliverysolutions.co",
        apiKey: process.env.DS_API_KEY || "",
      },
      dsTenant: "kibo",
      kiboCredentials: {
        api: process.env.KIBO_API_HOST || "",
        clientId: process.env.KIBO_CLIENT_ID || "",
        clientSecret: process.env.KIBO_CLIENT_SECRET || "",
      },
      locationMapping: [
        {
          kibo: "70672974049",
          ds: "002",
        },
      ],

      kiboSites: [65126],
      kiboTenant: parseInt(process.env.KIBO_TENANT || "") || 0,
    };

    apiContext = {
      tenantId: parseInt(process.env.KIBO_TENANT || "") || 0,
      siteId: 47032,
      masterCatalogId: 1,
      catalogId: 1,
      localeCode: "en-US",
      currencyCode: "USD",
    };
  });

  test("test1", async () => {
    const deliverySolutionsOrderSync = new DeliverySolutionsOrderSync(
      config,
      apiContext
    );

    const kiboShipmentService = new KiboShipmentService(config, apiContext);

    const deliverySolutionsOrder = {
      pickupTime: {
        startsAt: 1710196978171,
        endsAt: 1710283378171,
      },
      dropoffTime: {
        startsAt: 1710196978171,
        endsAt: 1710283378171,
      },
      deliveryContact: {
        name: "Thomas Phipps",
        phone: "5126081704",
        email: "dirkelfman@gmail.com",
      },
      deliveryAddress: {
        street: "5207 RAIN CREEK PKWY",
        street2: "",
        city: "AUSTIN",
        state: "TX",
        zipcode: "78759-5641",
        country: "US",
      },
      dispatch: {
        type: "manual",
      },
      type: "delivery",
      storeExternalId: "002",
      orderExternalId: "2",
      orderValue: 25,
      tips: 0,
      trackingUrl: "https://www.google.com",
      itemList: [
        {
          quantity: 1,
          size: {
            height: 1,
            width: 1,
            length: 1,
          },
          sku: "7800002150625",
          weight: 0.01,
          price: 25,
          sale_price: 25,
          title: "Zebra Mussels",
        },
      ],
      isEstimate: false,
      tenantId: "kibo",
      isPickup: false,
    };

    let event = {
      event: "ORDER_CANCELLED",
      receivedAt: "March 12th 2024, 6:10:24 pm",
      trackingNumber: "2188147903",
      provider: "DoorDash",
      orderId: "65f0e088f72a15c366879846",
      orderExternalId: "kibo_23",
      storeExternalId: "3",
      tenantId: "kibo",
      note: "dfgdfgdf",
      statusUser: "thomas.phipps@kibocommerce.com",
      driverExternalId: "",
      driverId: "",
    
      status: "ORDER_CANCELLED",
      webhookType: "status",
    
      customerWebflowUrl: "",
      hostedTrackingUrl: "https://s.dl-s.co/hWAKal70UaX",
      hostedFeedbackUrl: "https://s.dl-s.co/pU6nZHIv6e3",
      returnsUrl: "https://s.dl-s.co/p_qU43J9gej",
      estimatedPickupTime: 1710285765000,
      estimatedPickupTimeStarts: 1710285765000,
    
      labelLink:
        "https://sandbox.api.deliverysolutions.co/api/v2/label?orderId=65f0e088f72a15c366879846&token=NjVmMGUwODhmNzJhMTVjMzY2ODc5ODQ2",
      timeZone: "America/Chicago",
      receivedAtEpoch: 1710285024486,
      preferredProvider: "",
      preferredService: "",
      orderAttributes: {},
   
      trackingUrl: "https://s.dl-s.co/J7WdfZLM9Jo",
      pickupInstructions: "",
      deliveryContact: {
        name: "Thomas Phipps",
        phone: "5126081704",
        email: "dirkelfman@gmail.com",
      },
      pickUpAddress: {
        street: "10601 Ranch Rd 620 Nte",
        street2: "",
        apartmentNumber: "",
        city: "Austin",
        state: "TX",
        zipcode: "78759",
        country: "US",
        latitude: 30.479841,
        longitude: -97.795084,
      },
      deliveryAddress: {
        street: "5207 RAIN CREEK PKWY",
        street2: "",
        city: "Austin",
        state: "TX",
        zipcode: "78759",
        country: "US",
        latitude: 30.3966576,
        longitude: -97.7574377,
      },
     
      type: "delivery",
      serviceType: "Delivery",
      isTipsPosted: false,
    
      serviceId: "delivery",
      pickupTime: {
        startsAt: 1710284935762,
        endsAt: 1710371335762,
      },
      dropoffTime: {
        startsAt: 1710284935762,
        endsAt: 1710371335762,
      },
    
      carrier: {
        providerInfo: {
          id: "65af5afdf5236b5201a253fb",
          name: "DoorDash",
          displayName: "DoorDash",
        },
      },
     
      isSelfHealed: false,
      batchId: "",
      batchSequence: "",
      itemList: [
        {
          sku: "7800002150625",
          title: "Zebra Mussels",
          image:
            "https://cdn.shopify.com/s/files/1/0659/8062/9217/products/2022-08-22-10-58-20.png?v=1661183967",
       
          price: 25,
          sale_price: 25,
          weight: 0.01,
          quantity: 1,
        },
      ],
   
      createdAt: "2024-03-12T23:08:56.037Z",
      lastUpdatedAt: "2024-03-12T23:10:20.457Z",
      pickUpContact: {
        name: "Thomas Phipps",
        phone: "+1 512-555-1212",
        email: "dirkelfman@gmail.com",
      },
      brandExternalId: "kibo",
      orderValue: 25,
   
      isSpirit: false,
      isBeerOrWine: false,
      isTobacco: false,
      isFragile: false,
      isRx: false,
      hasRefrigeratedItems: false,
      hasPerishableItems: false,
    
      undeliverableOrderReturnLocation: {
        address: {
          street: "10601 Ranch Rd 620 Nte",
          street2: "",
          apartmentNumber: "",
          city: "Austin",
          state: "TX",
          zipcode: "78759",
          country: "US",
          latitude: 30.479841,
          longitude: -97.795084,
        },
        contact: {
          name: "Thomas Phipps",
          phone: "+1 512-555-1212",
          email: "dirkelfman@gmail.com",
        },
        name: "kibo store 3",
        pickupInstructions: "",
      },
      returnStoreId: "3",
    
      sentAt: "2024-03-12T23:10:24.486Z",
    };
    TenantConfigService.prototype.getConfigByDsTenant = ()=> Promise.resolve(config);
    await deliverySolutionsHandler(
      { detail: event, "detail-type": "ORDER_CANCELLED" } as EventBridgeEvent<string, any>,
      {} as Context
    );
    //const shipment = await deliverySolutionsOrderSync.processShipmentCreate(2);
    console.log("hi");
  }, 30000);
});
