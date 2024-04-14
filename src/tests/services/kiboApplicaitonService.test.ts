import { KiboApplicationService, KiboInstalledAppSettingsApi } from "../../services/kiboApplicaitonService";


describe("KiboApplicationService", () => {
  const mockGetSettings = jest.fn().mockResolvedValue({
    value: jest.fn().mockResolvedValue({
      // Mocked settings object
      setting1: "value1",
      setting2: "value2",
    }),
  });

  const mockUpdateSettings = jest.fn().mockResolvedValue({
    value: jest.fn().mockResolvedValue({
      // Mocked updated settings object
      setting1: "updatedValue1",
      setting2: "updatedValue2",
    }),
  });

  const mockClient = {
    getSettings: mockGetSettings,
    updateSettings: mockUpdateSettings,
  } as unknown as KiboInstalledAppSettingsApi;

  const nullInt = null as number;
  const mockApiContext = {
    tenantId: 42512,
    siteId: nullInt,
    catalogId: nullInt,
    masterCatalogId: nullInt
  };

  const mockAppConfig = {
    clientSecret: "mockClientSecret",
    clientId: "mockClientId",
    homeHost: "home.mozu.com",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getSettings should return the correct settings", async () => {
    const service = new KiboApplicationService({
      apiContext: mockApiContext,
      appConfig: mockAppConfig,
    });
    service.client = mockClient;

    const result = await service.getSettings();

    expect(mockGetSettings).toHaveBeenCalled();
    expect(result).toEqual({
      setting1: "value1",
      setting2: "value2",
    });
  });

