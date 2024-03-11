

export interface KiboApiContext {
    tenantId: number;
    siteId: number;
    masterCatalogId: number;
    catalogId: number;
    localeCode: string;
    currencyCode: string;
}
export function initKiboApiContextFromHeaders ( headers: any ): KiboApiContext{
    return {
        tenantId: headers['x-vol-tenant-id'],
        siteId: headers['x-vol-site-id'],
        masterCatalogId: headers['x-vol-master-catalog-id'],
        catalogId: headers['x-vol-catalog-id'],
        localeCode: headers['x-vol-locale-code'],
        currencyCode: headers['x-vol-currency']
    }
}