import * as crypto from "crypto";

export class SignatureVerificationService {
  public createAppHashKey(sharedSecret: string): string {
    const payloadByteArray = Buffer.from(sharedSecret + sharedSecret);
    return crypto
      .createHash("sha256")
      .update(payloadByteArray)
      .digest("base64");
  }

  public computeHash(appHashKey: string, date: string, body: string): string {
    const payload = appHashKey + date + body;
    const hash = crypto
      .createHash("sha256")
      .update(payload, "utf8")
      .digest("base64");

    return hash;
  }
  public isWithinMinutes(date: Date, minutes: number): boolean {
    const timeAgo = new Date(Date.now() - minutes * 60 * 1000);
    return date >= timeAgo;
  }
  public verifySignatureHash(
    sharedSecret: string,
    date: string,
    body: string,
    signature: string,
    timeLimitMinutes: number = 15
  ): void {
    const timeStamp = new Date(date);
    if (isNaN(timeStamp.getTime())) {
      throw new Error("Invalid date");
    }
    if (!this.isWithinMinutes(timeStamp, timeLimitMinutes)) {
      throw new Error("Date is too old");
    }
    

    const appHashKey = this.createAppHashKey(sharedSecret);
    const hash = this.computeHash(appHashKey, date, body);
    
    
    if ( hash !== signature){
        throw new Error("Invalid signature");        
    }
  }
}