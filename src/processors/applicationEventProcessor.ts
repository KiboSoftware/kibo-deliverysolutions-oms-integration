import { KiboApplicationService } from "../services/kiboApplicaitonService";

import { TenantConfiguration } from "../types/tenantConfiguration";

export class ApplicationEventProcessor {
  tenantConfig: TenantConfiguration;

  appService: KiboApplicationService;
  constructor({ tenantConfig }: { tenantConfig: TenantConfiguration }) {
    this.tenantConfig = tenantConfig;
    this.appService = new KiboApplicationService(tenantConfig);
  }

  async processEvent(event: any): Promise<any> {
    switch (event.topic) {
      case "application.installed":
      case "application.updated":
      case "application.upgraded":
        return this.validateInstallation(event);
    }
    return Promise.resolve();
  }

  async validateInstallation(event: any): Promise<any> {
    const settings = await this.appService.getSettings();
    if (!settings.enabled || !settings.initialized) {
      settings.enabled = true;
      settings.initialized = true;
      return this.appService.updateSettings(settings);
    }
    console.log(event);
    return Promise.resolve();
  }
}
