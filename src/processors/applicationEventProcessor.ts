import { KiboAppConfiguration } from "../services/kiboAppConfigurationService";
import { KiboApplicationService } from "../services/kiboApplicaitonService";
import { KiboApiContext } from "../types/kiboContext";

import { DsProductAttributes, TenantConfiguration } from "../types/tenantConfiguration";

export class ApplicationEventProcessor {
  tenantConfig: TenantConfiguration;

  appService: KiboApplicationService;
  apiContext: KiboApiContext;
  constructor({ tenantConfig, apiContext, appConfig }: { tenantConfig: TenantConfiguration; apiContext: KiboApiContext; appConfig: KiboAppConfiguration }) {
    this.tenantConfig = tenantConfig;
    this.appService = new KiboApplicationService({
      apiContext,
      appConfig,
    });
    this.apiContext = apiContext;
  }

  async processEvent(event: any): Promise<any> {
    console.log("Processing application event", event);
    switch (event.body.topic) {
      case "application.installed":
      case "application.updated":
      case "application.upgraded":
        await this.validateInstallation(event);
        return await this.validateAttributes(event);
    }
  }

  async validateInstallation(event: any): Promise<any> {
    console.log("Validating installation");
    const settings = await this.appService.getSettings();
    console.log("before", settings);
    if (!settings.enabled || !settings.initialized) {
      settings.enabled = true;
      settings.initialized = true;
      const after = await this.appService.updateSettings(settings);
      console.log("after", after);
    }
  }
  async validateAttributes(event: any): Promise<any> {
    console.log("Validating attributes");
    const tenant = await this.appService.tenantsApi.getTenant({ tenantId: this.apiContext.tenantId });

    function addMcHeaderFn(catalogId: any) {
      return (incomingOptions) => {
        incomingOptions.init.headers['x-vol-master-catalog'] = catalogId
        return incomingOptions.init;
      }
   }

    for (const mc of tenant.masterCatalogs) {
      const filter = DsProductAttributes.map((attr) => `attributeCode eq '${attr.attributeCode}'`).join(" or ");
      const results = await this.appService.productAttributesApi.getAttributes({
        filter,
        responseFields: "items(attributeCode)",
        
      }, addMcHeaderFn(mc.id));
      for (const attribute of DsProductAttributes) {
        const attributes = results.items.find((attr) => attr.attributeCode.toLowerCase() === attribute.attributeCode.toLowerCase());
        if (!attributes) {
          attribute.content.localeCode= mc.defaultLocaleCode;
          attribute.vocabularyValues?.forEach((value) => {value.content.localeCode = mc.defaultLocaleCode});
          const after = await this.appService.productAttributesApi.addAttribute({
            catalogAdminsAttribute: attribute,
            responseFields: "attributeCode",
          },addMcHeaderFn(mc.id));
          console.log("after", after);
        }
      }
      const pt = await this.appService.productTypesApi.getProductType({ productTypeId: 1 , responseFields:"properties(attributeFQN)" },addMcHeaderFn(mc.id));
      const results2 = await this.appService.productAttributesApi.getAttributes({
        filter  ,
        responseFields: "items(attributeFQN, vocabularyValues(value))",      
      }, addMcHeaderFn(mc.id));
      let i = 0;
      for (const attribute of results2.items) {
        const attributes = pt.properties.find((attr) => attr?.attributeFQN?.toLowerCase() === attribute.attributeFQN.toLowerCase() );
        if(!attributes){
            await this.appService.productTypesApi.addProperty({productTypeId:1 , attributeInProductType:{
                attributeFQN: attribute.attributeFQN,
                isRequiredByAdmin:false,
                order:pt.properties.length + i++,
                vocabularyValues: attribute.vocabularyValues?.map((value) => {return {value: value.value}}),
            }}, addMcHeaderFn(mc.id));
        }
      }
    }
  }
}
