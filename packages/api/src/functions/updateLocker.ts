import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { CosmosDbAccessClient } from "../infrastructures";
import { LockerType } from "../types";

/** 接続先コンテナ名 */
const CONTAINER_NAME = "items";

/**
 * ロッカー情報を更新するAPI関数
 *
 * @param request リクエストデータ
 * @param context メタデータ
 * @returns 実行結果
 */
export async function updateLocker(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  // リクエストデータを取得
  const bodyJson = await request.json();

  // 削除
  const cosmosDbAccessClient = new CosmosDbAccessClient();
  const entities: LockerType[] = [
    {
      id: bodyJson["lockerId"],
      lockerName: bodyJson["lockerName"],
      left: bodyJson["left"],
      top: bodyJson["top"],
      width: bodyJson["left"],
      height: bodyJson["height"],
    },
  ];
  await cosmosDbAccessClient.saveLockerEntities(CONTAINER_NAME, entities);

  return { status: 200 };
}

app.http("updateLocker", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: updateLocker,
});
