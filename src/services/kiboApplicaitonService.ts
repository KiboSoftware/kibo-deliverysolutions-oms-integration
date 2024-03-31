import { APIAuthClient } from '@kibocommerce/sdk-authentication'
import { TenantConfiguration } from '../types/tenantConfiguration'



export class KiboApplicationService {
    client: APIAuthClient
    auth_token_call : Promise<any>
    apiUrl: string
    constructor(config: TenantConfiguration) {
       
        this.client = new APIAuthClient({
            clientId: config.kiboCredentials.clientId,
            sharedSecret: config.kiboCredentials.clientSecret,
            authHost: config.kiboCredentials.api,
            apiHost: config.dsCredentials.api
        },fetch);
        this.client.authenticate
        this.apiUrl = `${config.kiboCredentials.api}/api/commerce/applications/settings`;        
       
    }  
    async getAccessToken(): Promise<string>{
        this.auth_token_call = this.auth_token_call || this.client.getAccessToken();
        return this.auth_token_call;
    }
    async getSettings(): Promise<KiboAppSettings>{
        const token = await this.getAccessToken()
        const response = await fetch(this.apiUrl, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const data: KiboAppSettings = await response.json();
          return data;
        
    }
    async updateSettings(newSettings: KiboAppSettings): Promise<KiboAppSettings> {
        const token = await this.getAccessToken();
        const response = await fetch(this.apiUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newSettings)
        });
      
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      
        const data: KiboAppSettings = await response.json();
        return data;
      }      
    
}

export interface KiboAppSettings {
    appId: string;
    uiConfigurationUrl: string;
    capabilities: any[];
    isExtension: boolean;
    initialized: boolean;
    enabled: boolean;
    appKey: string;
    isExtensionCertified: boolean;
  }
