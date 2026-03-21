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
 * ロッカー情報の一覧を取得するAPI関数
 *
 * @param request リクエストデータ
 * @param context メタデータ
 * @returns 実行結果
 */
export async function getLockers(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  // SQL
  const sql = "SELECT * FROM c WHERE id LIKE %locker_ ";

  // ロッカーを全取得
  const cosmosDbAccessClient = new CosmosDbAccessClient();
  const entities = await cosmosDbAccessClient.getLockerEntities(
    CONTAINER_NAME,
    sql,
  );

  // 呼び出し側でパースされるため、json形式に変換
  const json = {
    entities: entities,
  };

  return { status: 200, body: JSON.stringify(json) };
}

app.http("getLockers", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: getLockers,
});
