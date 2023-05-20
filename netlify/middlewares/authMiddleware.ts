import middy from '@middy/core'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getAuth } from 'firebase-admin/auth';

const middleware = (): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
    const before: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
        request
    ) => {
        try {
            const token = request.event.headers?.authorization?.replace('Bearer ', '') || '';
            request.event['firebaseUser'] = await getAuth().verifyIdToken(token);
        } catch (e) {
            return {
                statusCode: 401
            }
        }
    }

    const after: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
        request
    ): Promise<void> => {
        // Your middleware logic
    }

    return {
        before,
        after
    }
}

export default middleware