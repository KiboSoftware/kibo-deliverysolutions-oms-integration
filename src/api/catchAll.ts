import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2, APIGatewayProxyResultV2, Context } from "aws-lambda";
import { S3 } from "aws-sdk";

const bucketName = process.env.CONTENT_BUCKET_NAME;
const s3 = new S3();
export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> => {
   console.log('catchAll', event);
    const path = event.requestContext.http.path.substring(1) || 'index.html';

    try {
        const getObjectParams = {
            Bucket: bucketName,
            Key:path
        };

        const { Body, ContentType } = await s3.getObject(getObjectParams).promise();

        return {
            statusCode: 200,
            body: Body.toString(),
            headers: {
                'Content-Type': ContentType
            }
        };
    } catch (error) {
        console.error('Error retrieving object from S3:', error);
        return {
            statusCode: 500,
            body: 'Internal Server ErrorZ'
        };
    }
};