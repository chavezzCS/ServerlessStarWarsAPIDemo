import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

let clientOptions = {};
if (process.env.IS_OFFLINE) {

  clientOptions = {
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  };
}
const client = new DynamoDBClient(clientOptions);
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME!;

export async function saveItem(item: any) {
  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    })
  );
}

export async function getItem(id: string) {
  const res = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    })
  );
  return res.Item;
}

export async function queryByType(type: string) {
    const res = await docClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "tipo = :tipo",
        ExpressionAttributeValues: { 
          ":tipo": type 
        },
        ProjectionExpression: "id, tipo, nombrePlaneta, elevacion, #ts",
        ExpressionAttributeNames: {
          "#ts": "timestamp"
        }
      })
    );
  return res.Items || [];
}
