import { TenantConfiguration } from "../types/tenantConfiguration";
import { TenantConfigService } from "../services/tenantConfigurationService";

describe("TenantConfigService", () => {
  const mockDynamoDbGet = jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({
      Item: {
        id: "34851",
        dsCredentials: {
          api: "https://api.deliverysolutions.co",
          apiKey: "API_KEY",
        },
        dsTenant: "kibo",
       
        locationMapping: [
          {
            kibo: "70672974049",
            ds: "002",
          },
        ],
        kiboSites: [65126],
        kiboTenant: 0,
      } as TenantConfiguration,
    }),
  });

  beforeEach(() => {
    TenantConfigService.dynamoDb = {
      get: mockDynamoDbGet,
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getConfigById should return the correct configuration", async () => {
    const id = "34851";
    const expectedConfig: TenantConfiguration = {
      id: "34851",
      dsCredentials: {
        api: "https://api.deliverysolutions.co",
        apiKey: "API_KEY",
      },
      dsTenant: "kibo",
      
      locationMapping: [
        {
          kibo: "70672974049",
          ds: "002",
        },
      ],
      kiboSites: [65126],
      kiboTenant: 0,
      createOrderEvent: "",
      orderReadyEvent: "",
      tipProductCode: ""
    };

    
    const result = await new TenantConfigService().getConfigById(id);

    expect(mockDynamoDbGet).toHaveBeenCalledWith({
      TableName: process.env.DYNAMODB_TABLE!,
      Key: { id },
    });
    expect(result).toEqual(expectedConfig);
  });
});