export interface Address {
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    addressType: string;
    cityOrTown: string;
    countryCode: string;
    isValidated: boolean;
    postalOrZipCode: string;
    stateOrProvince: string;
}

export interface Contact {
    id: number;
    address: Address;
    companyOrOrganization: string;
    email: string;
    firstName: string;
    lastNameOrSurname: string;
    middleNameOrInitial: string;
    shortFullName: string;
    fullName: string;
    phoneNumbers: {
        home: string;
        mobile: string;
        work: string;
    };
}

export interface Destination {
    destinationContact: Contact;
    isDestinationCommercial: boolean;
}

export interface Customer {
    customerContact: Contact;
}

export interface Option {
    attributeFQN: string;
    name: string;
    stringValue: string;
    value: string;
    shopperEnteredValue: string;
}

export interface Item {
    lineId: number;
    originalOrderItemId: string;
    goodsType: string;
    productCode: string;
    variationProductCode: string;
    quantity: number;
    transferQuantity: number;
    trueTransferQuantity: number;
    readyForPickupQuantity: number;
    imageUrl: string;
    name: string;
    upc: string;
    allowsBackOrder: boolean;
    unitPrice: number;
    isTaxable: boolean;
    actualPrice: number;
    weight: number;
    length: number;
    width: number;
    height: number;
    weightUnit: string;
    options: Option[];
    manageStock: boolean;
    creditValue: number;
    isAssemblyRequired: boolean;
    isPackagedStandAlone: boolean;
    allowsFutureAllocate: boolean;
    inventoryTags: any[];
    isReservedInventory: boolean;
    allowsSubstitution: boolean;
    originalQuantity: number;
}

export interface WorkflowState {
    shipmentState: string;
}

export interface Shipment {
    shipmentNumber: number;
    orderId: string;
    orderNumber: number;
    orderSubmitDate: string;
    customerAccountId: number;
    tenantId: number;
    siteId: number;
    fulfillmentDate: string;
    shipmentType: string;
    shipmentStatus: string;
    fulfillmentStatus: string;
    fulfillmentLocationCode: string;
    assignedLocationCode: string;
    workflowProcessId: string;
    workflowProcessContainerId: string;
    total: number;
    currencyCode: string;
    destination: Destination;
    customer: Customer;
    items: Item[];
    canceledItems: any[];
    reassignedItems: any[];
    rejectedItems: any[];
    transferredItems: any[];
    packages: any[];
    workflowState: WorkflowState;
    email: string;
    acceptedDate: string;
    readyForPickup: boolean;
    readyForPickupDate: string;
}