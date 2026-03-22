import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { CosmosDbAccessClient } from "../infrastructures";

/** 接続先コンテナ名 */
const CONTAINER_NAME = "items";

/**
 * ロッカーIDで備品情報を取得するAPI関数
 *
 * @param request リクエストデータ
 * @param context メタデータ
 * @returns 実行結果
 */
export async function getItemsByLockerId(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  // クエリパラメータからlockeridを取得
  const lockerId = request.query.get("lockerid");

  // lockeridが指定されていない場合はエラー
  if (!lockerId) {
    return {
      status: 400,
      body: JSON.stringify({ error: "lockerid parameter is required" }),
    };
  }

  // SQL（lockeridで検索）
  const sql =
    "SELECT * FROM c WHERE c.id like 'item_%' AND c.lockerId = @lockerId";
  const parameters = [{ name: "@lockerId", value: lockerId }];

  // 備品を取得
  const cosmosDbAccessClient = new CosmosDbAccessClient();
  const entities = await cosmosDbAccessClient.getItemEntities(
    CONTAINER_NAME,
    sql,
    parameters,
  );

  return { status: 200, body: JSON.stringify(entities) };
}

app.http("getItemsByLockerId", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: getItemsByLockerId,
});
