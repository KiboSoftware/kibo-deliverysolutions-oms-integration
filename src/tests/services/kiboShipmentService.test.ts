
import { ShipmentApi, ShipmentNotesApi } from '@kibocommerce/rest-sdk/clients/Fulfillment';
import { KiboShipmentService } from '../../services/kiboShipmentService';

jest.mock('@kibocommerce/rest-sdk/clients/Fulfillment', () => ({
  ShipmentApi: jest.fn(),
  ShipmentNotesApi: jest.fn(),
}));

describe('KiboShipmentService', () => {
  let service: KiboShipmentService;
  let mockShipmentApi: jest.Mocked<ShipmentApi>;
  let mockShipmentNotesApi: jest.Mocked<ShipmentNotesApi>;

  beforeEach(() => {
    mockShipmentApi = new ShipmentApi() as jest.Mocked<ShipmentApi>;
    mockShipmentNotesApi = new ShipmentNotesApi() as jest.Mocked<ShipmentNotesApi>;

    mockShipmentApi.getShipment = jest.fn();
    service = new KiboShipmentService({
      apiContext: {
        tenantId: 1,
        siteId: 1,
        catalogId: 1,
        masterCatalogId: 1,
      },
      appConfig: {
        clientId: 'test',
        clientSecret: 'test',
        homeHost: 'test',
      },
    });

    service.shipmentApi = mockShipmentApi;
    service.shipmentNotesApi = mockShipmentNotesApi;
  });

  it('should get shipment by id', async () => {
    const mockShipment = { shipmentNumber: 1 };
    mockShipmentApi.getShipment.mockResolvedValue(mockShipment);

    const result = await service.getShipmentById(1);

    expect(result).toEqual(mockShipment);
    expect(mockShipmentApi.getShipment).toHaveBeenCalledWith({ shipmentNumber: 1 });
  });

  // Add more tests for other methods in a similar way
});