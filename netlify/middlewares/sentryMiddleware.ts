import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as Sentry from "@sentry/node";

const middleware = (
  sentryOptions: Sentry.NodeOptions
): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  const before: middy.MiddlewareFn<
    APIGatewayProxyEvent,
    APIGatewayProxyResult
  > = async () => {
    Sentry.init(sentryOptions);
  };

  const onError: middy.MiddlewareFn<
    APIGatewayProxyEvent,
    APIGatewayProxyResult
  > = async (request) => {
    if (request.error) {
      Sentry.configureScope((scope) => {
        scope.setExtra("event", request.event);
        if (request.error?.message) {
          scope.setExtra("message", request.error?.message);
        }
        if (request.error?.stack) {
          scope.setExtra("stack", request.error?.stack);
        }
      });

      Sentry.captureException(request.error);
    }
  };

  return {
    before,
    onError,
  };
};

export default middleware;
