import { APIGatewayProxyHandler } from "aws-lambda";
import { queryByType } from "../services/dynamo";
import { ok, serverError } from "../utils/responses";

export const handler: APIGatewayProxyHandler = async () => {
  try {
    const data = await queryByType("fusionado");
    return ok({ items: data });
  } catch (err) {
    console.error(err);
    return serverError("Error interno");
  }
};
