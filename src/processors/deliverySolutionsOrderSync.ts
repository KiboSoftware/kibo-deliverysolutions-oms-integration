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
      'kibo_'+ shipmentNumber.toString()
    );
  }
  async updateShipmentItems(shipmentNumber: number): Promise<any> {
    const kiboShipment = await this.getShipmentById(shipmentNumber);
    if (kiboShipment?.shipmentType != "Delivery") {
      return;
    }
    const deliveryOrder = await this.deliverySolutionsService.getOrder(
      'kibo_'+ shipmentNumber.toString()
    );
    if (!deliveryOrder) {
      return;
    }

    const mappedOrder = mapKiboShipmentToDsOrder(
      kiboShipment,
      this.tenantConfig,
      deliveryOrder.dropoffTime,
      deliveryOrder.pickupTime
    );

    delete mappedOrder.isEstimate;
    delete mappedOrder.tenantId;
    delete mappedOrder.isPickup;

    console.log("editing order");
    return await this.deliverySolutionsService.editOrder(mappedOrder);
  }

  async processShipmentCreate(shipmentNumber: number): Promise<any> {
    const shipment = await this.getShipmentById(shipmentNumber);
    if (shipment?.shipmentType != "Delivery") {
      return;
    }

    const now = new Date().getTime();
    let pickup: TimeWindow | undefined = {
      startsAt: now,
      endsAt: now + 1000 * 60 * 60 * 24,
    };
    let dropOff: TimeWindow = {
      startsAt: now,
      endsAt: now + 1000 * 60 * 60 * 24,
    };

    const order = await this.getOrderById(shipment.orderId);

    const dropOffAttribute = order?.attributes
      ?.find((attr: OrderAttribute) => {
        return attr.fullyQualifiedName?.toLowerCase().includes("dropOff");
      })
      ?.values?.[0]?.toString()
      ?.trim();
    if (dropOffAttribute) {
      dropOff = JSON.parse(dropOffAttribute);
    }

    const pickUpAttribute = order.attributes
      ?.find((attr: OrderAttribute) => {
        return attr.fullyQualifiedName?.toLowerCase().includes("pickup");
      })
      ?.values?.[0]?.toString()
      ?.trim();
    if (pickUpAttribute) {
      pickup = JSON.parse(pickUpAttribute);
    }

    //todo: what if pickup or dropoff time is null ??
    return await this.createOrder(shipment, dropOff, pickup);
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
    dropOff: TimeWindow,
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
