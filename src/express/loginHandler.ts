import { Request, Response } from "express";
import * as querystring from "querystring";
import { SignatureVerificationService } from "../services/signatureVerificationServcie";
import { JwtService } from "../services/jwtService";

export class LoginHandler {
  sharedSecret: string;
  signaturService: SignatureVerificationService;
  jwtService: JwtService;
  rootPath: string;

  constructor({
    sharedSecret,
    signaturService,
    jwtService,
  }: {
    sharedSecret: string;
    signaturService: SignatureVerificationService;
    jwtService: JwtService;
  }) {
    this.sharedSecret = sharedSecret;
    this.signaturService = signaturService;
    this.jwtService = jwtService;
    this.rootPath = "/" + process.env.HOSTING_PATH;
  }

  decodeBody2W(body: any): string {
    const unencodedParams = Object.entries(body)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    return unencodedParams;
  }

  base64Decode(input: string): string {
    const buffer = Buffer.from(input, "base64");
    const decoded = buffer.toString("utf8");
    return decoded;
  }

  decodeBody(body: string): string {
    const strBody = this.base64Decode(body);
    const params = querystring.parse(strBody);
    const unencodedParams = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    return unencodedParams;
  }

  handle_test = (req: Request, res: Response) => {
    const lowerCaseQuery = Object.entries(req.query).reduce((result, [key, value]) => {
      result[key.toLowerCase()] = value;
      return result;
    }, {} as Record<string, any>);
    
    const tenantId = parseInt(lowerCaseQuery['tenantid'] as any);
    if (isNaN(tenantId)) {
      console.error("Invalid tenantId:", tenantId);
      res.status(401).send("Invalid tenantId");
      return;
    }
    const sec = req.query.secret as string;
    if (sec == this.sharedSecret) {
      const jwt = this.jwtService.createJwt(tenantId);

      res.cookie("jwt", jwt, {
        path: this.rootPath,
        sameSite: "none",
        secure: true,
      });
      const redirect = this.rootPath.endsWith("/")
        ? this.rootPath + "index.html"
        : this.rootPath + "/index.html";
      res.redirect(redirect);
    }else{
      
        console.error("Invalid secs");
        res.status(401).send("Invalid secs");
        return;
      
    }
  };
  handle = (req: Request, res: Response) => {
    const tenantId = parseInt(req.query.tenantId as any);
    req.body;
    

    const body = this.decodeBody(req.body);
    if (isNaN(tenantId)) {
      console.error("Invalid tenantId:", tenantId);
      res.status(401).send("Invalid tenantId");
      return;
    }
    const timeStampStr = req.query.dt as string;
    const messageHash = req.query.messageHash as string;
    this.signaturService.verifySignatureHash(
      this.sharedSecret,
      timeStampStr,
      body,
      messageHash
    );

    const jwt = this.jwtService.createJwt(tenantId);

    res.cookie("jwt", jwt, {
      path: this.rootPath,
      sameSite: "none",
      secure: true,
    });
    const redirect = this.rootPath.endsWith("/")
      ? this.rootPath + "index.html"
      : this.rootPath + "/index.html";
    res.redirect(redirect);
  };
}
