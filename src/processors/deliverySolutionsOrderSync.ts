import { DeliverySolutionsService } from "../services/delvierySolutionsService";
import { KiboShipmentService } from "../services/kiboShipmentService";
import { TenantConfiguration } from "../types/tenantConfiguration";
import { KiboApiContext } from "../types/kiboContext";
import { DeliverySolutionsOrder } from "../types/deliverySolutions";
import { mapKiboShipmentToDsOrder } from "../mappers/shippingMappers";
import { EntityModelOfShipment } from "@kibocommerce/rest-sdk/clients/Fulfillment";
import { Order } from "@kibocommerce/rest-sdk/clients/Commerce";
import { KiboCommerceService } from "../services/kiboCommerceService";

import { KiboAppConfiguration } from "../services/kiboAppConfigurationService";

export class DeliverySolutionsOrderSync {
  deliverySolutionsService: DeliverySolutionsService;
  kiboShipmentService: KiboShipmentService;
  kiboOrderService: KiboCommerceService;
  tenantConfig: TenantConfiguration;
  createOrderEvent: string;
  shipmentCancelEvents: string[];
  orderReadyEvent: string;
  orderUpdateEvents: string[];

  constructor({ tenantConfig, apiContext, appConfig }: { tenantConfig: TenantConfiguration; apiContext: KiboApiContext; appConfig: KiboAppConfiguration }) {
    this.tenantConfig = tenantConfig;
    this.deliverySolutionsService = new DeliverySolutionsService(tenantConfig);
    this.kiboShipmentService = new KiboShipmentService({
      apiContext,
      appConfig,
    });
    this.kiboOrderService = new KiboCommerceService({ apiContext, appConfig });

    this.tenantConfig = tenantConfig;
    this.createOrderEvent = tenantConfig.createOrderEvent || "ACCEPTED_SHIPMENT";
    this.shipmentCancelEvents = ["CANCELED", "BACKORDER"];
    this.orderReadyEvent = tenantConfig.orderReadyEvent || "READY_FOR_DELIVERY";
    this.orderUpdateEvents = ["PARTIAL_INVENTORY_NOPE"];
  }

  async route(event: any): Promise<any> {
    const body = event.body;
    const extendedProperties = event.body?.extendedProperties;
    const newState = extendedProperties.find((prop: { key: string }) => prop.key === "newState")?.value;
    const shipmentNumber = parseInt(body.entityId);

    if (newState == this.createOrderEvent) {
      return await this.processShipmentCreate(shipmentNumber);
    }
    if (this.shipmentCancelEvents.includes(newState)) {
      return await this.processShipmentCancel(shipmentNumber);
    }
    if (this.orderUpdateEvents.includes(newState)) {
      return await this.updateShipmentItems(shipmentNumber);
    }
    if (newState == this.orderReadyEvent) {
      return await this.releaseShipment(shipmentNumber);
    }
    return Promise.resolve();
  }

  async processShipmentCancel(shipmentNumber: number): Promise<any> {
    const shipment = await this.getShipmentById(shipmentNumber);
    if (shipment?.shipmentType != "Delivery") {
      return;
    }
    console.log("candeling order", "kibo_" + shipmentNumber.toString());
    return await this.deliverySolutionsService.cancelOrder("kibo_" + shipmentNumber.toString());
  }
  async releaseShipment(shipmentNumber: number): Promise<any> {
    const kiboShipment = await this.getShipmentById(shipmentNumber);
    
    if (kiboShipment?.shipmentType != "Delivery") {
      return;
    }
    let deliveryOrder = {
      orderExternalId: "kibo_" + shipmentNumber.toString(),
      release: {
        type: "immediate",
      },
    } as any as DeliverySolutionsOrder;

    console.log("releasing order", deliveryOrder.orderExternalId);
    deliveryOrder = await this.deliverySolutionsService.editOrder(deliveryOrder);
    console.log("released order", deliveryOrder);
  }
  async updateShipmentItems(shipmentNumber: number): Promise<any> {
    const kiboShipment = await this.getShipmentById(shipmentNumber);
    if (kiboShipment?.shipmentType != "Delivery") {
      return;
    }
    const order = await this.getOrderById(kiboShipment.orderId);
    const mappedOrder = mapKiboShipmentToDsOrder({ kiboShipment, kiboOrder:order,  tenantConfig: this.tenantConfig });

    const deliveryOrder = {
      orderExternalId: mappedOrder.orderExternalId,
      aitemList: mappedOrder.itemList,
    } as any as DeliverySolutionsOrder;

    console.log("editing order", deliveryOrder.orderExternalId);
    return await this.deliverySolutionsService.editOrder(deliveryOrder);
  }

  async processShipmentCreate(shipmentNumber: number): Promise<any> {
    const shipment = await this.getShipmentById(shipmentNumber);
    if (shipment?.shipmentType != "Delivery") {
      return;
    }
    const order = await this.getOrderById(shipment.orderId);

    //const order = await this.getOrderById(shipment.orderId);

    

    const dsOrder = await this.createOrder({shipment,order});
    console.log("created dsOrder", dsOrder);
    return dsOrder;
  }
  async getShipmentById(kiboShipmentId: number): Promise<EntityModelOfShipment> {
    return await this.kiboShipmentService.getShipmentById(kiboShipmentId);
  }
  async getOrderById(kiboOrderId: string): Promise<Order> {
    return await this.kiboOrderService.getOrderById(kiboOrderId);
  }
  toDsOrderExternalId(kiboId: number): string {
    return "kibo_" + kiboId;
  }
  toKiboShipmentId(dsId: string): number {
    return parseInt(dsId.replace("kibo_", ""));
  }

  async cancelKiboShipment(dsOrder: DeliverySolutionsOrder): Promise<any> {
    const shipmentId = this.toKiboShipmentId(dsOrder.orderExternalId);
    return await this.kiboShipmentService.cancel(shipmentId);
  }
  async markKiboShipmentDelivered(dsOrder: DeliverySolutionsOrder): Promise<any> {
    const shipmentId = this.toKiboShipmentId(dsOrder.orderExternalId);
    return await this.kiboShipmentService.execute(shipmentId, "Provide to Customer");
  }
  async logEvent( event:string, dsOrder: DeliverySolutionsOrder):Promise<any> {
    const shipmentId = this.toKiboShipmentId(dsOrder.orderExternalId);
    return await this.kiboShipmentService.appendLog(shipmentId, event);
  }

  async createOrder({shipment, order} : { shipment: EntityModelOfShipment, order: Order}): Promise<DeliverySolutionsOrder> {
    const mappedOrder = mapKiboShipmentToDsOrder({ kiboShipment:shipment, kiboOrder: order, tenantConfig: this.tenantConfig });

    const deliverySolutionsOrder = await this.deliverySolutionsService.createOrder(mappedOrder);
    console.log("deliverySolutionsOrder", deliverySolutionsOrder);
    if (deliverySolutionsOrder.trackingUrl) {
      await this.kiboShipmentService.updateTracking();
    }
    return deliverySolutionsOrder;
  }
}
