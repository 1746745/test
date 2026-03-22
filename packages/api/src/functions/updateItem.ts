import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { CosmosDbAccessClient } from "../infrastructures";
import { ItemType } from "../types";

/** 接続先コンテナ名 */
const CONTAINER_NAME = "items";

/**
 * 備品情報を更新するAPI関数
 *
 * @param request リクエストデータ
 * @param context メタデータ
 * @returns 実行結果
 */
export async function updateItem(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  // リクエストデータを取得
  const bodyJson = await request.json();

  // 更新
  const cosmosDbAccessClient = new CosmosDbAccessClient();
  const entities: ItemType[] = [
    {
      id: bodyJson["id"],
      itemName: bodyJson["itemName"],
      lockerId: bodyJson["lockerId"],
      category: bodyJson["category"],
      status: bodyJson["status"],
      note: bodyJson["note"],
    },
  ];
  await cosmosDbAccessClient.saveItemEntities(CONTAINER_NAME, entities);

  return { status: 200, body: JSON.stringify({ success: true }) };
}

app.http("updateItem", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: updateItem,
});
