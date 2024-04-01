import { KiboAppConfiguration } from "../services/kiboAppConfigurationService";
import { KiboApplicationService } from "../services/kiboApplicaitonService";
import { KiboApiContext } from "../types/kiboContext";

import { TenantConfiguration } from "../types/tenantConfiguration";

export class ApplicationEventProcessor {
  tenantConfig: TenantConfiguration;

  appService: KiboApplicationService;
  constructor({
    tenantConfig,
    apiContext,
    appConfig,
  }: {
    tenantConfig: TenantConfiguration;
    apiContext: KiboApiContext;
    appConfig: KiboAppConfiguration;
  }) {
    this.tenantConfig = tenantConfig;
    this.appService = new KiboApplicationService({
      apiContext,
      appConfig,
    });
  }

  async processEvent(event: any): Promise<any> {
    console.log("Processing application event", event);
    switch (event.body.topic) {
      case "application.installed":
      case "application.updated":
      case "application.upgraded":
        return await this.validateInstallation(event);
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
}
