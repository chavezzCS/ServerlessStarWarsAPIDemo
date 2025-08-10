import { APIGatewayProxyResult } from "aws-lambda";
export const ok = (data: any): APIGatewayProxyResult => ({
  statusCode: 200,
  body: JSON.stringify(data),
});

export const badRequest = (message: string): APIGatewayProxyResult => ({
  statusCode: 400,
  body: JSON.stringify({ error: message }),
});

export const serverError = (message: string): APIGatewayProxyResult => ({
  statusCode: 500,
  body: JSON.stringify({ error: message }),
});

export const unauthorized = (message: string) : APIGatewayProxyResult  => ({
  statusCode: 403,
  body: JSON.stringify({ error: message }),
});
