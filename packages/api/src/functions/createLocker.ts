import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { CosmosDbAccessClient } from "../infrastructures";
import { LockerType } from "../types";
import { createULID } from "../utils/common";

/** 接続先コンテナ名 */
const CONTAINER_NAME = "items";

/**
 * ロッカー情報を作成するAPI関数
 *
 * @param request リクエストデータ
 * @param context メタデータ
 * @returns 実行結果
 */
export async function createLocker(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  // リクエストデータを受け取る
  const bodyJson = await request.json();

  // 登録
  const cosmosDbAccessClient = new CosmosDbAccessClient();
  const entities: LockerType[] = [
    {
      id: `locker_${createULID()}`,
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

app.http("createLocker", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: createLocker,
});
