import { hasUncaughtExceptionCaptureCallback } from "process";
import { SignatureVerificationService } from "../../services/signatureVerificationServcie";


describe("SignatureVerificationService", () => {
  let service: SignatureVerificationService;

  beforeEach(() => {
    service = new SignatureVerificationService();
  });

  test("createAppSignatureHash should return the correct hash", () => {
   
    const sitebuilderHashKey='a/xfQMToNm2kJgYJ9V8GMyhT4p5A0Q1LUkgAoWTFXKs=';
    const secret = '8eaa7ed6961543b1b90cd92de677d197';
    const hash = service.createAppHashKey(secret);

    expect(hash).toBe(sitebuilderHashKey);
  });

  

  test("createAppSignatureHash should validate the correct hash1", () => {
    
    const timeStamp = 'Sat, 30 Mar 2024 18:18:22 GMT';
    const body ='x-vol-tenant-domain=t28854.sandbox.mozu.com&x-vol-return-url=https://t28854.sandbox.mozu.com/Admin/s-47137/capability/edit/e352e7284c744a9a898b38aa9c47dc8d/#configure';
    const sbComputedHash ='qCiWLJSmXZGH9kHpmyd5rG+pqzae6j4agupe1CJckuw='
    const secret = '8eaa7ed6961543b1b90cd92de677d197';
    service.verifySignatureHash(secret,timeStamp,body,sbComputedHash, 10*365*24*60);
    
  });

  test("createAppSignatureHash should fail to validate an old  hash1", () => {
    
    const timeStamp = 'Sat, 30 Mar 2024 18:18:22 GMT';
    const body ='x-vol-tenant-domain=t28854.sandbox.mozu.com&x-vol-return-url=https://t28854.sandbox.mozu.com/Admin/s-47137/capability/edit/e352e7284c744a9a898b38aa9c47dc8d/#configure';
    const sbComputedHash ='qCiWLJSmXZGH9kHpmyd5rG+pqzae6j4agupe1CJckuw='
    const secret = '8eaa7ed6961543b1b90cd92de677d197';
    expect(() => {
        service.verifySignatureHash(secret,timeStamp,body,sbComputedHash, 15);
      }).toThrow();
    
  }); 

 
});

