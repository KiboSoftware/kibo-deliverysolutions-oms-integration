// kiboWebHook
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import  kiboEventConsumer  from "../consumers/kibo";
const eventBridge = new EventBridgeClient({ region: process.env.AWS_REGION }); // replace with your region

export const handler = async (event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
  const headers = event.headers;
  const body = JSON.parse(event.body || "");
  const busName = process.env.EVENTBRIDGE_BUS_NAME || "default";
  const eventType = body.topic || "unknown";

  console.log ("Received event", JSON.stringify({ body, headers }));
  const command = new PutEventsCommand({
    Entries: [
      {
        Source: "kibo",
        DetailType: eventType,
        Detail: JSON.stringify({ body, headers }),
        EventBusName: busName,
      },
    ],
  });

  if( headers['x-run-sync'] === "true"){
    console.log("running sync");
    const consumerDetail = {
      ['detail-type']: eventType,
      detail: { body, headers }
    } as any;
    try{
      const resp =  kiboEventConsumer(consumerDetail);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Webhook processed successfully",
          resp: resp,
        }),
      };
    }catch(e){  
      console.error("Error processing event", e);
      return  {
        statusCode: 200,
        body: JSON.stringify({
          message: "Webhook processed successfully",
          resp: e,
        }),
      };
    }
    
  }


  const resp = await eventBridge.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Webhook processed successfully",
      resp: resp,
    }),
  };
};
