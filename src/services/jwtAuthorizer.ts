import { APIGatewayTokenAuthorizerHandler, PolicyDocument } from "aws-lambda";
import jwt from "jsonwebtoken";

const secret = "rimac";

export const handler: APIGatewayTokenAuthorizerHandler = async (event) => {
  try {
    const token = event.authorizationToken?.split(" ")[1];
    if (!token) throw new Error("No token");

    const decoded = jwt.verify(token, secret);

    const policy: PolicyDocument = {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Allow",
          Resource: event.methodArn,
        },
      ],
    };

    return {
      principalId: (decoded as any).sub || "user",
      policyDocument: policy,
    };
  } catch (error) {
    return {
      principalId: "user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: event.methodArn,
          },
        ],
      },
    };
  }
};
