import {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { S3 } from "aws-sdk";
import { error } from "console";
import * as querystring from "querystring";

import { SignatureVerificationService } from "../services/signatureVerificationServcie";
import { JwtService } from "../services/jwtService";
import { KiboAppConfigurationService } from "../services/kiboAppConfigurationService";

const bucketName = process.env.CONTENT_BUCKET_NAME;
const s3 = new S3();
export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  if (
    event.requestContext.http.method === "POST" &&
    "messageHash" in event.queryStringParameters
  ) {
    try {
      return login(event);
    } catch (error) {
      console.error("Error logging in:", error);
      return {
        statusCode: 500,
        body: "Internal Server Error",
      };
    }
  }
  const path = event.requestContext.http.path.substring(1) || "index.html";

  try {
    const getObjectParams = {
      Bucket: bucketName,
      Key: path,
    };

    const { Body, ContentType } = await s3.getObject(getObjectParams).promise();

    return {
      statusCode: 200,
      body: Body.toString(),
      headers: {
        "Content-Type": ContentType,
      },
    };
  } catch (error) {
    console.error("Error retrieving object from S3:", error);
    return {
      statusCode: 500,
      body: "Internal Server ErrorZ",
    };
  }
};

function base64Decode(input: string): string {
  const buffer = Buffer.from(input, "base64");
  const decoded = buffer.toString("utf8");
  return decoded;
}

function decodeBody(body: string): string {
  const strBody = base64Decode(body);
  const params = querystring.parse(strBody);
  const unencodedParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return unencodedParams;
}

function login(event: APIGatewayProxyEventV2): APIGatewayProxyResultV2 {
  const appConfig = KiboAppConfigurationService.getCurrent();
  const messageHash = event.queryStringParameters["messageHash"];
  const tenantId = parseInt(event.queryStringParameters["tenantId"]);
  const signatureServcie = new SignatureVerificationService();
  const body = decodeBody(event.body);
  if (isNaN(tenantId)) {
    console.error("Invalid tenantId:", tenantId);
    throw error("Invalid tenantId");
  }
  const timeStampStr = event.queryStringParameters["dt"];
  signatureServcie.verifySignatureHash(
    appConfig.clientSecret,
    timeStampStr,
    body,
    messageHash
  );
  const jwtService = new JwtService(appConfig.clientSecret);
  const jwt = jwtService.createJwt(tenantId);

  return {
    statusCode: 302,
    headers: {
      Location: event.requestContext.http.path, // The URL you want to redirect to
      "Set-Cookie": `jwt=${jwt}; path=/; samesite=none; secure`, // Set your cookie here
    },
    body: "",
  };
}
