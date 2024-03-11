// dsWebhook
import { EventBridge } from "aws-sdk";

const eventBridge = new EventBridge();

export const handler = async (event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
    const headers = event.headers;
    const body = JSON.parse(event.body || '');
    const busName = process.env.EVENTBRIDGE_BUS_NAME || 'default';
    const topic = body.event || 'unknown';
    await eventBridge.putEvents({
        Entries: [
            {
                Source: 'ds',
                DetailType: body.topic,
                Detail: JSON.stringify({ body, headers }),
                EventBusName: busName,
            },
        ],
    }).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Webhook processed successfully' }),
    };
};
