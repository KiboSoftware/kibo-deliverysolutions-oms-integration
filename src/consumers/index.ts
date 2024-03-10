import { SQSEvent, Context } from 'aws-lambda';

export const handler = async (event: SQSEvent, context: Context) => {
  for (const record of event.Records) {
    const body = JSON.parse(record.body);

    // Process the message
    console.log(body);
  }
};