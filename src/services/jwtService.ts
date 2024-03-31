import { APIGatewayProxyEventV2 } from "aws-lambda";
import * as jwt from "jsonwebtoken";

export class JwtService {
  sharedSecret: string;
  constructor(sharedSecret: string) {
    this.sharedSecret = sharedSecret;
  }

  createJwt(tenantId: number): string {
    const payload = {
      tenantId: tenantId,
    };
    const token = jwt.sign(payload, this.sharedSecret);
    return token;
  }
  readJwt(token: string): any {
    const decoded = jwt.decode(token);
    return decoded;
  }
  readJwtFromEvent(event: APIGatewayProxyEventV2): any {
    const cookies = event.cookies;

    if (cookies) {
      cookies.forEach((cookie) => {
        const [name, value] = cookie.split("=");
        if (name === "jwt") {
          return this.readJwt(value);
        }
      });
    }
    return null;
  }
}
