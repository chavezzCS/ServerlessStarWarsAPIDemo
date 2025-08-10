// Importa la función que quieres probar
import { APIGatewayProxyResult } from "aws-lambda";
import { handler } from "../src/handlers/historial";
import { queryByType } from "../src/services/dynamo";
import { v4 as uuidv4 } from "uuid";

beforeEach(() => {
  jest.clearAllMocks();
});
jest.mock("../src/services/dynamo", () => ({
  queryByType: jest.fn(),
}));
jest.mock("uuid", () => ({
  v4: jest.fn(() => "mock-uuid-123"),
}));

const mockedListItems = queryByType as jest.MockedFunction<typeof queryByType>;
describe("historial.handler", () => {
  //prueba de flujo exitoso
  it("debería listar los planetas registrados", async () => {
    const mockEvent = {};
    const mockData = [
      { id: "1", nombre: "Tatooine" },
      { id: "2", nombre: "Alderaan" },
    ];
    mockedListItems.mockResolvedValue(mockData);

    const result = (await handler(
      mockEvent as any,
      {} as any,
      {} as any
    )) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    
    expect(body.items).toEqual(mockData);
  });
});
