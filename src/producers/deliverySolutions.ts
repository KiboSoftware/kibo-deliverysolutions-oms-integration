// dsWebhook
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";

const eventBridge = new EventBridgeClient({ region: process.env.AWS_REGION }); // replace with your region

export const handler = async (event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
  const headers = event.headers;
  const body = JSON.parse(event.body || "");
  const busName = process.env.EVENTBRIDGE_BUS_NAME || "default";
  const topic = body.event || "unknown";
  console.log ("Received event", JSON.stringify({ body, headers }));

  const command = new PutEventsCommand({
    Entries: [
      {
        Source: "ds",
        DetailType: body.event || body.status || "unknown",
        Detail: JSON.stringify(body),
        EventBusName: busName,
      },
    ],
  });

  const resp = await eventBridge.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Webhook processed successfully", resp }),
  };
};
