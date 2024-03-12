import { DeliverySolutionsService } from "../services/delvierySolutionsService";
import { KiboShipmentService } from "../services/kiboShipmentService";
import { TenantConfiguration } from "../types/tenantConfiguration";
import { KiboApiContext } from "../types/kiboContext";
import { DeliverySolutionsOrder, TimeWindow } from "../types/deliverySolutions";
import { mapKiboShipmentToDsOrder } from "../mappers/shippingMappers";
import { EntityModelOfShipment } from "@kibocommerce/rest-sdk/clients/Fulfillment";
import {
  Order,
  OrderApi,
  OrderAttribute,
} from "@kibocommerce/rest-sdk/clients/Commerce";
import { KiboCommerceService } from "../services/kiboCommerceService";
import { mapTimeWindows } from "../mappers/orderMappers";
export class DeliverySolutionsOrderSync {
  deliverySolutionsService: DeliverySolutionsService;
  kiboShipmentService: KiboShipmentService;
  kiboOrderService: KiboCommerceService;
  tenantConfig: TenantConfiguration;

  constructor(
    tenantConfig: TenantConfiguration,
    kiboApiContext: KiboApiContext
  ) {
    this.tenantConfig = tenantConfig;
    this.deliverySolutionsService = new DeliverySolutionsService(tenantConfig);
    this.kiboShipmentService = new KiboShipmentService(
      tenantConfig,
      kiboApiContext
    );
    this.kiboOrderService = new KiboCommerceService(
      tenantConfig,
      kiboApiContext
    );
  }

  async processShipmentCancel(shipmentNumber: number): Promise<any> {
    const shipment = await this.getShipmentById(shipmentNumber);
    if (shipment?.shipmentType != "Delivery") {
      return;
    }
    return await this.deliverySolutionsService.cancelOrder(
      "kibo_" + shipmentNumber.toString()
    );
  }
  async releaseShipment(shipmentNumber: number): Promise<any> {
    const kiboShipment = await this.getShipmentById(shipmentNumber);
    if (kiboShipment?.shipmentType != "Delivery") {
      return;
    }
    const deliveryOrder = {
      orderExternalId: "kibo_" + shipmentNumber.toString(),
      release: {
        type: "immediate",
      },
    } as any as DeliverySolutionsOrder;

    console.log("releasing order");
    return await this.deliverySolutionsService.editOrder(deliveryOrder);
  }
  async updateShipmentItems(shipmentNumber: number): Promise<any> {
    const kiboShipment = await this.getShipmentById(shipmentNumber);
    if (kiboShipment?.shipmentType != "Delivery") {
      return;
    }
    

    const mappedOrder = mapKiboShipmentToDsOrder(
      kiboShipment,
      this.tenantConfig      
    );

    const deliveryOrder = {
      orderExternalId: mappedOrder.orderExternalId,
      aitemList: mappedOrder.itemList,
    } as any as DeliverySolutionsOrder;

    console.log("editing order");
    return await this.deliverySolutionsService.editOrder(mappedOrder);
  }

  async processShipmentCreate(shipmentNumber: number): Promise<any> {
    const shipment = await this.getShipmentById(shipmentNumber);
    if (shipment?.shipmentType != "Delivery") {
      return;
    }

    const order = await this.getOrderById(shipment.orderId);

    const windows = mapTimeWindows(order, true);

    return await this.createOrder(shipment, windows.dropoffTime, windows.pickupTime);
  }
  async getShipmentById(
    kiboShipmentId: number
  ): Promise<EntityModelOfShipment> {
    return await this.kiboShipmentService.getShipmentById(kiboShipmentId);
  }
  async getOrderById(kiboOrderId: string): Promise<Order> {
    return await this.kiboOrderService.getOrderById(kiboOrderId);
  }

  async createOrder(
    kiboShipment: EntityModelOfShipment,
    dropOff?: TimeWindow,
    pickup?: TimeWindow
  ): Promise<DeliverySolutionsOrder> {
    const mappedOrder = mapKiboShipmentToDsOrder(
      kiboShipment,
      this.tenantConfig,
      dropOff,
      pickup
    );

    const deliverySolutionsOrder =
      await this.deliverySolutionsService.createOrder(mappedOrder);
    console.log("deliverySolutionsOrder", deliverySolutionsOrder);
    if (deliverySolutionsOrder.trackingUrl) {
      await this.kiboShipmentService.updateTracking(
        deliverySolutionsOrder,
        kiboShipment
      );
    }
    return deliverySolutionsOrder;
  }
}
