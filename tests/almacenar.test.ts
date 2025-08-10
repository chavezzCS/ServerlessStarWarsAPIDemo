// Importa la función que quieres probar
import { APIGatewayProxyResult } from "aws-lambda";
import { handler } from "../src/handlers/almacenar";
import { saveItem } from "../src/services/dynamo";
import { v4 as uuidv4 } from "uuid";

beforeEach(() => {
  jest.clearAllMocks();
});
jest.mock("../src/services/dynamo", () => ({
  saveItem: jest.fn(), 
}));
jest.mock("uuid", () => ({
  v4: jest.fn(() => "mock-uuid-123"), 
}));

const mockedSaveItem = saveItem as jest.Mocked<typeof saveItem>;
describe("almacenar.handler", () => {
  //prueba de flujo exitoso
  it("debería almacenar el item y devolver un status 200 con el item creado", async () => {
    const mockEvent = {
      body: JSON.stringify({ mensaje: "Este es un mensaje de prueba" }),
    };
    const result = (await handler(mockEvent as any, {} as any, {} as any))as APIGatewayProxyResult;
    expect(mockedSaveItem).toHaveBeenCalledWith({
      id: "mock-uuid-123",
      tipo: "personalizado",
      timestamp: expect.any(Number),
      mensaje: "Este es un mensaje de prueba",
    });
      expect(result.statusCode).toBe(200);
      const body = JSON.parse(result.body);
      expect(body.message).toBe("Datos almacenados correctamente");
      expect(body.item.id).toBe("mock-uuid-123");

  });

  //prueba de flujos incorrectos
  it("debería devolver un status 400 si falta el cuerpo de la petición", async () => {
    const mockEvent = { body: null };
    const result = (await handler(mockEvent as any, {} as any, {} as any))as APIGatewayProxyResult;
      expect(result.statusCode).toBe(400);
      const body = JSON.parse(result.body);
      console.log(body)
      expect(body.error).toBe("Falta el cuerpo de la petición");
      expect(mockedSaveItem).not.toHaveBeenCalled();
  });
});
