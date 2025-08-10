import { APIGatewayProxyHandler } from "aws-lambda";
import { getPlanetData } from "../services/starwars";
import { getElevacion } from "../services/elevacion";
import { getItem, saveItem } from "../services/dynamo";
import { ok, badRequest, serverError } from "../utils/responses";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const planet = event.queryStringParameters?.planet;
    if (!planet) return badRequest("Debe indicar un planeta");

    //Caché
    const cached = await getItem(planet);
    if (cached && Date.now() - cached.timestamp < 30 * 60 * 1000) {
      return ok({ source: "cache", data: cached });
    }

    //Apis externas
    const planetData = await getPlanetData(planet);
    if (!planetData) return badRequest("Planeta no encontrado");

    //Coordenadas aleatorias
    const lat = Math.random() * 90;
    const lon = Math.random() * 180;
    const elevacion = await getElevacion(lat, lon);

    const combined = {
      id: planet,
      timestamp: Date.now(),
      tipo: "fusionado",
      nombrePlaneta: planetData.name,
      elevacion: elevacion,
    };

    await saveItem(combined);

    return ok({ source: "api", data: combined });
  } catch (err) {
    console.error(err);
    return serverError("Error interno");
  }
};
