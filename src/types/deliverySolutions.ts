export interface Address {
    street?: string;
    street2?: string;
    apartmentNumber?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
}

export interface Contact {
    name?: string;
    phone?: string;
    email?: string;
    notifySms? :boolean
    notifyEmail?: boolean
}

export interface Size {
    height?: number;
    width?: number;
    length?: number;
}

export interface Item {
    quantity?: number;
    size?: Size;
    sku?: string;
    weight?: number;
    price?: number;
    sale_price?: number;
    title?: string;
}

export interface TimeWindow {
    startsAt?: number;
    endsAt?: number;
}

export interface ReturnLocation {
    address?: Address;
    contact?: Contact;
    name?: string;
    pickupInstructions?: string;
}

export interface DeliverySolutionsOrder {
    pickupTime?: TimeWindow ;
    dropoffTime?: TimeWindow;
    deliveryContact?: Contact;
    deliveryAddress?: Address;
    dispatch?: { type?: string };
    type?: string;
    storeExternalId?: string;
    orderExternalId?: string;
    orderValue?: number;
    tips?: number;
    itemList?: Item[];
    isEstimate?: boolean;
    tenantId?: string;
    isPickup?: boolean;
    brandExternalId?: string;
    currencyCode?: string;
    pickupInstructions?: string;
    isLegacy?: boolean;
    isPickupASAP?: boolean;
    isDropoffASAP?: boolean;
    userPickupTime?: number;
    returnStoreId?: string;
    undeliverableOrderReturnLocation?: ReturnLocation;
    packages?: any[];
    timeZone?: string;
    pickUpContact?: Contact;
    pickUpAddress?: Address;
    pickUpTime?: number;
    labelLink?: string;
    barcodeLink?: string;
    status?: string;
    estimatedPickupTime?: null | string;
    estimatedPickupTimeStarts?: null | string;
    estimatedPickupTimeEnds?: null | string;
    estimatedDeliveryTime?: null | string;
    estimatedDeliveryTimeStarts?: null | string;
    estimatedDeliveryTimeEnds?: null | string;
    deliveryInstructions?: null | string;
    dspAttributes?: null | any;
    receivedAt?: string;
    receivedAtEpoch?: number;
    provider?: string;
    preferredProvider?: string;
    preferredService?: string;
    orderId?: string;
    note?: string;
    statusUser?: null | any;
    trackingNumber?: string;
    event?: string;
    driverExternalId?: string;
    driverId?: string;
    orderAttributes?: any;
    signatureImageUrl?: null | string;
    attachments?: null | any;
    errors?: any[];
    driver?: null | any;
    vehicle?: null | any;
    lastLocation?: null | any;
    currency?: null | any;
    amount?: null | any;
    labels?: null | any;
    trackingUrl?: null | string;
    alternateLocation?: null | any;
    serviceType?: null | string;
    isTipsPosted?: boolean;
    actualDeliveryTime?: null | string;
    actualPickupTime?: null | string;
    fee?: null | any;
    returnRequest?: null | any;
    providerReturnResponse?: null | any;
    proposedProviders?: any[];
    feedback?: null | any;
    clonedFrom?: null | any;
    groupId?: null | string;
    serviceId?: null | string;
    providerBatch?: null | any;
    barcodes?: null | any;
    carrier?: null | any;
    subStatus?: null | string;
    isSelfHealed?: boolean;
    batchId?: string;
    batchSequence?: null | number;
    signature?: null | any;
    shipments?: any[];
    createdAt?: string;
    lastUpdatedAt?: string;
    isSpirit?: boolean;
    isBeerOrWine?: boolean;
    isTobacco?: boolean;
    isFragile?: boolean;
    isRx?: boolean;
    hasRefrigeratedItems?: boolean;
    hasPerishableItems?: boolean;
    notifications?: null | any;
    eventReason?: null | any;
    geofences?: any[];
    exceptionDetails?: null | any;
}