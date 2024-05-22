
import express from "express";
import serverless from "serverless-http";
import { expressjwt, Request as JWTRequest } from "express-jwt";
import { KiboAppConfigurationService } from "../services/kiboAppConfigurationService";
import { JwtService } from "../services/jwtService";
import { LoginHandler } from "./loginHandler";
import { SignatureVerificationService } from "../services/signatureVerificationServcie";
import { StaticHandler } from "./staticHandler";
import { S3Client } from "@aws-sdk/client-s3";
import { TenantConfigService } from "../services/tenantConfigurationService";
import { ConfigApiHandler } from "./configApiHandler";
import cookieParser from "cookie-parser";

const app = express();
const secret = KiboAppConfigurationService.getCurrent().clientSecret;
const jwtService = new JwtService(secret);
const signaturService = new SignatureVerificationService();
const tenantConfigService = new TenantConfigService();

const loginHandler = new LoginHandler({
  sharedSecret: secret,
  signaturService: signaturService,
  jwtService: jwtService,
});

const staticHandler = new StaticHandler({
  s3: new S3Client(),
});

const configApiHandler = new ConfigApiHandler({
  tenantConfigService: tenantConfigService,
});

app.use(cookieParser());
// JWT middleware
app.use(
  expressjwt({
    secret: secret,
    credentialsRequired: false,
    algorithms: ["HS256"],
    getToken: (req: JWTRequest) => {
      if (req && req.cookies) {
        return req.cookies.jwt;
      }
      return null;
    },
  })
);

// Routes
app.get("/configs/:id", configApiHandler.get);
app.get("/configs", configApiHandler.list);
app.put("/configs/:id", configApiHandler.put);
app.post("/login", loginHandler.handle);
app.get("/login_test", loginHandler.handle_test);

app.get("*", staticHandler.handle);

// Export your serverless app
export const handler = serverless(app);
