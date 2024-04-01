import { Request as JWTRequest } from "express-jwt";
import { Response } from "express";
import { TenantConfigService } from "../services/tenantConfigurationService";

export class ConfigApiHandler {
  tenantConfigService: TenantConfigService;
  constructor({
    tenantConfigService,
  }: {
    tenantConfigService: TenantConfigService;
  }) {
    this.tenantConfigService = tenantConfigService;
  }

  get = async (req: JWTRequest, res: Response) => {
    if (!req.auth?.tenantId) {
      res.status(401).send("Unauthorized");
      return;
    }
    const tenantId = req.auth.tenantId as number;
    const config = await this.tenantConfigService.getConfigByKiboTenant(
      tenantId
    );
    if (!config) {
      res.status(404).send("Config not found");
      return;
    }
    res.json(config);
  };
  put = async (req: JWTRequest, res: Response) => {
    if (!req.auth?.tenantId) {
      res.status(401).send("Unauthorized");
      return;
    }
    const settings = JSON.parse(req.body);
    const tenantId = req.auth.tenantId as number;
 
    settings.kiboTenant = tenantId;
    settings.id = tenantId.toString();
    console.log("Upserting config", settings);
    try {
      await this.tenantConfigService.upsert(settings);
    } catch (ex) {
      console.error("Error upserting config", ex, settings);
      res.status(500).send("Error upserting config");
      return;
    }

    res.status(201).send(settings);
  };
  list = async (req: JWTRequest, res: Response) => {
    if (!req.auth?.tenantId) {
      res.status(401).send("Unauthorized");
      return;
    }
    const tenantId = req.auth.tenantId as number;
    if (tenantId !== 1) {
      res.status(401).send("Unauthorized");
      return;
    }
    const configs = await this.tenantConfigService.getAllConfigs();
    res.json(configs);
  };
}
