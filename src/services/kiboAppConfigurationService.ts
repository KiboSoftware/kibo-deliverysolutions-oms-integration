export class KiboAppConfigurationService {
  public static getCurrent(): KiboAppConfiguration {
    return {
      clientId: process.env.KIBO_CLIENT_ID,
      clientSecret: process.env.KIBO_CLIENT_SECRET,
      homeHost: process.env.KIBO_HOME_HOST,
    };
  }
}

export interface KiboAppConfiguration {
  clientId: string;
  clientSecret: string;
  homeHost: string;
}
