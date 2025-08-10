import { APIGatewayProxyHandler } from "aws-lambda";
import jwt from "jsonwebtoken";

const SECRET_KEY = "rimac";

export const handler: APIGatewayProxyHandler = async () => {
  const payload = {
    issuedAt: Date.now(),
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

  return {
    statusCode: 200,
    body: JSON.stringify({ token }),
  };
};
