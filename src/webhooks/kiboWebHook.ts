import { SQS } from 'aws-sdk';
import { APIGatewayProxyHandler, APIGatewayEvent, Context, APIGatewayProxyResult } from 'aws-lambda';

const sqs = new SQS();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const body = JSON.parse(event.body || '{}');

  const params : SQS.SendMessageRequest= {
    MessageBody: JSON.stringify({
      kind:'kibo',
      webHook: body
    }),
    QueueUrl: process.env.QUEUE_URL!,
  };

  try {
    await sqs.sendMessage(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Message sent to the queue.' }),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'An error occurred when sending the message to the queue.' }),
    };
  }
};