import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { CosmosDbAccessClient } from "../infrastructures";
import { ItemType } from "../types";
import { createULID } from "../utils/common";

/** 接続先コンテナ名 */
const CONTAINER_NAME = "items";

/**
 * 備品情報を作成するAPI関数
 *
 * @param request リクエストデータ
 * @param context メタデータ
 * @returns 実行結果
 */
export async function createItem(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  // リクエストデータを受け取る
  const bodyJson = await request.json();

  // 登録
  const cosmosDbAccessClient = new CosmosDbAccessClient();
  const entities: ItemType[] = [
    {
      id: `item_${createULID()}`,
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

app.http("createItem", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: createItem,
});
