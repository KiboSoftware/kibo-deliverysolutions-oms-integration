import { CatalogAdminsAttribute } from "@kibocommerce/rest-sdk/clients/CatalogAdministration/models";
import { constants } from "buffer";

export interface TenantConfiguration {
  id: string;
  kiboTenant: number;
  kiboSites: number[];
  dsTenant: string;
  locationMapping: LocationMapping[];
  createOrderEvent?: string;
  orderReadyEvent?: string;
  tipProductCode?: string;
  // kiboCredentials: {
  //   clientId: string;
  //   clientSecret: string;
  //   api: string;
  // };
  dsCredentials: dsCredentials;
}

export interface LocationMapping {
  kibo: string;
  ds: string;
}

export interface dsCredentials {
  apiKey: string;
  api: string;
}


export const DsProductAttributes :CatalogAdminsAttribute[] =[
  {
    "adminName": "Delivery Solution's Item Type",
    "namespace": "Tenant",
    "attributeCode": "dsItemType",   
    "inputType": "List",
    "valueType": "Predefined",
    "dataType": "String",
    "isProperty": true,
   
    "content": {
      "localeCode": "en-US",
      "name": "Delivery Solution's Item Type"
    },
    "vocabularyValues": [
      {
        "valueSequence": 1,
        "value": "Spirit",
        "mappedGenericValues": [],
        "content": {
          "localeCode": "en-US",
          "stringValue": "Spirit"
        },
        "displayOrder": 1
      },
      {
        "valueSequence": 2,
        "value": "BeerOrWine",
        "mappedGenericValues": [],
        "content": {
          "localeCode": "en-US",
          "stringValue": "Beer or Wine"
        },
        "displayOrder": 2
      },
      {
        "valueSequence": 3,
        "value": "Tabacco",
        "mappedGenericValues": [],
        "content": {
          "localeCode": "en-US",
          "stringValue": "Tabacco"
        },
        "displayOrder": 3
      },
      {
        "valueSequence": 4,
        "value": "Rx",
        "mappedGenericValues": [],
        "content": {
          "localeCode": "en-US",
          "stringValue": "Rx"
        },
        "displayOrder": 4
      }
    ]
    },
    {
      "adminName": "Delivery Solution's Is Refrigerated",
      "namespace": "Tenant",
      "attributeCode": "dsRefrigerated",
    
      "isValueMappingAttribute": false,
     
     
      "inputType": "YesNo",
      "valueType": "AdminEntered",
      "dataType": "Bool",
      "isOption": false,
      "isExtra": false,
      "isProperty": true,
      "availableForOrderRouting": false,
      "content": {
        "localeCode": "en-US",
        "name": "Delivery Solution's Is Refrigerated",
        "description": ""
      }
      
    },
    {
      "adminName": "Delivery Solution's Is Perishable",
      "namespace": "Tenant",
      "attributeCode": "dsPerishable",
    
      "isValueMappingAttribute": false,
      
     
      "inputType": "YesNo",
      "valueType": "AdminEntered",
      "dataType": "Bool",
      "isOption": false,
      "isExtra": false,
      "isProperty": true,
      "availableForOrderRouting": false,
      "content": {
        "localeCode": "en-US",
        "name": "Delivery Solution's Is Perishable",
        "description": ""
      }
      
    }

];
  
