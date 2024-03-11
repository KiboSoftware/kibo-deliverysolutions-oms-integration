import { EventBridgeEvent, Context } from 'aws-lambda';

export const handler = async (event: EventBridgeEvent<string, any>, context: Context) => {
  const detail = event.detail;

  // Process the event detail
  console.log(event, event.detail.body);
};