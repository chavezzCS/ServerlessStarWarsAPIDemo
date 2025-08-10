import { APIGatewayProxyHandler } from "aws-lambda";
import { saveItem } from "../services/dynamo";
import { ok, badRequest, serverError} from "../utils/responses";
import { v4 as uuidv4 } from "uuid";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    if (!event.body) return badRequest("Falta el cuerpo de la petición");

    const data = JSON.parse(event.body);
    const item = {
      id: uuidv4(),
      tipo: "personalizado",
      timestamp: Date.now(),
      mensaje: data.mensaje
    };

    await saveItem(item);
    return ok({ message: "Datos almacenados correctamente", item });
  } catch (err) {
    console.error(err);
    return serverError("Error interno");
  }
};
