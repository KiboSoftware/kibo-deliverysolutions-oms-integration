import { EventBridgeEvent } from "aws-lambda";
import handler from "../../consumers/deliverySolutions";
import { DeliverySolutionsOrderSync } from "../../processors/deliverySolutionsOrderSync";
import {
  KiboAppConfiguration,
  KiboAppConfigurationService,
} from "../../services/kiboAppConfigurationService";

import { KiboApiContext } from "../../types/kiboContext";
import { TenantConfiguration } from "../../types/tenantConfiguration";
import { TenantConfigService } from "../../services/tenantConfigurationService";

jest.mock("../services/tenantConfigurationService");
jest.mock("../processors/deliverySolutionsOrderSync");
jest.mock("../services/kiboAppConfigurationService");

describe("deliverySolutions", () => {
  let mockTenantConfigService: jest.Mocked<TenantConfigService>;
  let mockDeliverySolutionsOrderSync: jest.Mocked<DeliverySolutionsOrderSync>;
  let mockKiboAppConfigurationService: jest.Mocked<KiboAppConfigurationService>;
  let tenantConfig: TenantConfiguration = {
    id: "",
    kiboTenant: 0,
    kiboSites: [],
    dsTenant: "",
    locationMapping: [],
    dsCredentials: undefined,
  };
  let apiContext: KiboApiContext = {};
  let appConfig: KiboAppConfiguration = {
    clientId: "",
    clientSecret: "",
    homeHost: "",
  };

  beforeEach(() => {
    mockTenantConfigService =
      new TenantConfigService() as jest.Mocked<TenantConfigService>;
    mockDeliverySolutionsOrderSync = new DeliverySolutionsOrderSync({
      tenantConfig,
      apiContext,
      appConfig,
    }) as jest.Mocked<DeliverySolutionsOrderSync>;
    mockKiboAppConfigurationService =
      new KiboAppConfigurationService() as jest.Mocked<KiboAppConfigurationService>;

    jest
      .spyOn(TenantConfigService.prototype, "getConfigByDsTenant")
      .mockResolvedValue(tenantConfig);
    jest
      .spyOn(DeliverySolutionsOrderSync.prototype, "cancelKiboShipment")
      .mockResolvedValue(mockDeliverySolutionsOrderSync);
    jest
      .spyOn(DeliverySolutionsOrderSync.prototype, "markKiboShipmentDelivered")
      .mockResolvedValue(mockDeliverySolutionsOrderSync);
    jest
      .spyOn(KiboAppConfigurationService, "getCurrent")
      .mockReturnValue(appConfig);
  });

  it("should handle ORDER_CANCELLED event", async () => {
    const event= {
      "detail-type": "ORDER_CANCELLED",
      detail: {
        tenantId: "testTenant",
        id: "",
        version: "",
        account: "",
        time: "",
        region: "",
        source: "",
      },
    };

    await handler(event as EventBridgeEvent<string, any> );

    expect(
      mockDeliverySolutionsOrderSync.cancelKiboShipment
    ).toHaveBeenCalledWith(event.detail);
  });

  it("should handle ORDER_DELIVERED event", async () => {
    const event = {
      "detail-type": "ORDER_DELIVERED",
      detail: { tenantId: "testTenant" },
    };

    await handler(event as EventBridgeEvent<string, any>);

    expect(
      mockDeliverySolutionsOrderSync.markKiboShipmentDelivered
    ).toHaveBeenCalledWith(event.detail);
  });

  // Add more tests for other cases
});
