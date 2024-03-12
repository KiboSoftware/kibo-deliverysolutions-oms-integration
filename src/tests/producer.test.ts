// kiboWebhook
import { EventBridge } from "aws-sdk";
import kiboHandler from "../consumers/kibo";
import { TenantConfiguration } from "../types/tenantConfiguration";
import {
  KiboApiContext,
  initKiboApiContextFromHeaders,
} from "../types/kiboContext";

import {handler} from "../consumers/kibo";

import { DeliverySolutionsOrderSync } from "../processors/deliverySolutionsOrderSync";

process.env.GLOBAL_AGENT_HTTP_PROXY = "http://localhost:8866";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import "global-agent/bootstrap";
import { KiboCommerceService } from "../services/kiboCommerceService";
import { KiboShipmentService } from "../services/kiboShipmentService";

describe("Test Class", () => {
  let config: TenantConfiguration;
  let apiContext: KiboApiContext;

  beforeEach(() => {
    config = {
      id: "34851",
      dsCredentials: {
        api: process.env.DS_API || "https://api.deliverysolutions.co",
        apiKey: process.env.DS_API_KEY ||'',
      },
      dsTenant: "kibo",
      kiboCredentials: {
        api: process.env.KIBO_API_HOST||'',
        clientId: process.env.KIBO_CLIENT_ID ||'',
        clientSecret: process.env.KIBO_CLIENT_SECRET||'',
      },
      locationMapping: [
        {
          kibo: "70672974049",
          ds: "002",
        },
      ],

      kiboSites: [65126],
      kiboTenant: parseInt(process.env.KIBO_TENANT||'')|| 0,
    };

    apiContext = {
      tenantId: parseInt(process.env.KIBO_TENANT||'')|| 0,
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
      trackingUrl:"https://www.google.com",
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
    
    await handler( {
        "detail-type": "shipment.workflowstatechanged",
        detail: {
            body: {
                shipmentNumber: 2,
                extendedProperties: [
                    {
                        key: "newState",
                        value: "ACCEPTED_SHIPMENT",
                    },
                ],
            },
            headers: {
                "x-vol-tenant": parseInt(process.env.KIBO_TENANT||'')|| 0,
            },
        },
        id: "",
        version: "",
        account: "",
        time: "",
        region: "",
        resources: [],
        source: ""
    }, {
        callbackWaitsForEmptyEventLoop: false,
        functionName: "",
        functionVersion: "",
        invokedFunctionArn: "",
        memoryLimitInMB: "",
        awsRequestId: "",
        logGroupName: "",
        logStreamName: "",
        getRemainingTimeInMillis: function (): number {
            throw new Error("Function not implemented.");
        },
        done: function (error?: Error | undefined, result?: any): void {
            throw new Error("Function not implemented.");
        },
        fail: function (error: string | Error): void {
            throw new Error("Function not implemented.");
        },
        succeed: function (messageOrObject: any): void {
            throw new Error("Function not implemented.");
        }
    });
    //const shipment = await deliverySolutionsOrderSync.processShipmentCreate(2);
    console.log("hi");
  }, 30000);
});

