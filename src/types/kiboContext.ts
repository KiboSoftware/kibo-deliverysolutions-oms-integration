

export interface KiboApiContext {
    tenantId?: number;
    siteId?: number;
    masterCatalogId?: number;
    catalogId?: number;
    localeCode: string;
    currencyCode: string;
}
export function initKiboApiContextFromHeaders ( headers: any ): KiboApiContext{
    return {
        tenantId: parseInt(headers['x-vol-tenant']) || undefined,
        siteId: parseInt(headers['x-vol-site']) || undefined,
        masterCatalogId: parseInt(headers['x-vol-master-catalog']) || undefined,
        catalogId: parseInt(headers['x-vol-catalog']) || undefined,
        localeCode: headers['x-vol-locale'],
        currencyCode: headers['x-vol-currency']
      }
}