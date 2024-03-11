// kiboWebhook
import { EventBridge } from "aws-sdk";
const eventBridge = new EventBridge();

export const handler = async (event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
    const headers = event.headers;
    const body = JSON.parse(event.body || '');
    const busName = process.env.EVENTBRIDGE_BUS_NAME || 'default';
    const eventType = body.topic || 'unknown'
    const resp = await eventBridge.putEvents({
        Entries: [
            {
                Source: 'kibo',
                DetailType: eventType,
                Detail: JSON.stringify({ body, headers }),
                EventBusName: busName,
            },
        ],
    }).promise();
    console.log('kiboWebhook', busName, resp);

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Webhook processed successfully', resp:resp }),
    };
};