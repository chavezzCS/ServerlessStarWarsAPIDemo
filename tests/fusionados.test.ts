import { APIGatewayProxyResult } from "aws-lambda";
import { getPlanetData } from "../src/services/starwars";
import { getElevacion } from "../src/services/elevacion";
import { handler } from "../src/handlers/fusionados";
import { saveItem, getItem } from "../src/services/dynamo";

beforeEach(() => {
  jest.clearAllMocks();
});
jest.mock("../src/services/starwars", () => ({
  getPlanetData: jest.fn(),
}));
jest.mock("../src/services/elevacion", () => ({
  getElevacion: jest.fn(),
}));
jest.mock("../src/services/dynamo", () => ({
  getItem: jest.fn(),
  saveItem: jest.fn(),
}));

const mockedGetItem = getItem as jest.MockedFunction<typeof getItem>;
const mockedSaveItem = saveItem as jest.MockedFunction<typeof saveItem>;
const mockedGetPlanetData = getPlanetData as jest.MockedFunction<
  typeof getPlanetData
>;
const mockedGetElevacion = getElevacion as jest.MockedFunction<
  typeof getElevacion
>;

describe("fusionados.handler", () => {
  //prueba de flujo exitoso
  it("debería devolver el elemento en caché, en su defecto devolverlo de la API externa", async () => {
    mockedGetItem.mockResolvedValueOnce(undefined);
    mockedGetPlanetData.mockResolvedValueOnce({ name: "Tatooine", id: "1" });
    mockedGetElevacion.mockResolvedValue(150);

    

    const mockEvent = { queryStringParameters: { planet: "1" } };
    let result1 = (await handler(
      mockEvent as any,
      {} as any,
      {} as any
    )) as APIGatewayProxyResult;
    let body1 = JSON.parse(result1.body);

    expect(result1.statusCode).toBe(200);
    expect(body1.source).toBe("api");
    expect(body1.data.nombrePlaneta).toBe("Tatooine");
    expect(body1.data.elevacion).toBe(150);

    mockedGetItem.mockResolvedValueOnce({
        nombrePlaneta: "Tatooine",
        elevacion: "100",
        timestamp: Date.now(),
        tipo: "fusionado"
    });
    let result2 = (await handler(
      mockEvent as any,
      {} as any,
      {} as any
    )) as APIGatewayProxyResult;
    let body2 = JSON.parse(result2.body);
    console.log(result2)
    expect(result2.statusCode).toBe(200);
    expect(body2.source).toBe("cache");
    expect(body2.data.nombrePlaneta).toBe("Tatooine");
    expect(body2.data.elevacion).toBe("100");
  });

  //prueba de flujos incorrectos
  it("debería devolver un status 400 si no se indica planeta", async () => {
    const mockEvent = {
      queryStringParameters: {},
    };
    const result = (await handler(
      mockEvent as any,
      {} as any,
      {} as any
    )) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.error).toBe("Debe indicar un planeta");
    expect(mockedSaveItem).not.toHaveBeenCalled();
  });

  it("debería devolver un status 400 si no se encuentra el planeta", async () => {
    mockedGetItem.mockResolvedValueOnce(undefined);
    mockedGetPlanetData.mockResolvedValueOnce(null);
    const mockEvent = {
      queryStringParameters: {
        planet: "0",
      },
    };
    const result = (await handler(
      mockEvent as any,
      {} as any,
      {} as any
    )) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.error).toBe("Planeta no encontrado");
    expect(mockedSaveItem).not.toHaveBeenCalled();
  });
});
