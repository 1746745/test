import {
  Container,
  CosmosClient,
  CosmosClientOptions,
  Database,
  SqlParameter
} from "@azure/cosmos";
import { HttpsProxyAgent } from "https-proxy-agent";
import { ItemType, LockerType } from "../../types";
import { isLocalhost } from "../../utils/common";

/**
 * Cosmos DB アクセス クライアント
 */
export class CosmosDbAccessClient {
  private database: Database;

  /**
   * コンストラクタ
   * @constructor
   */
  constructor() {
    const options: CosmosClientOptions = {
      endpoint: process.env.FUNC_COSMOS_ENDPOINT,
      key: process.env.FUNC_COSMOS_ACCOUNT_KEY,
    };

    // プロキシ設定（ローカル起動で外部のCosmosDBに接続する場合）
    if (!isLocalhost(process.env.FUNC_COSMOS_ENDPOINT) && process.env.HTTPS_PROXY) {
      options.agent = new HttpsProxyAgent(process.env.HTTPS_PROXY);
    }

    const client = new CosmosClient(options);
    this.database = client.database(process.env.FUNC_COSMOS_DB_NAME);
  }

  /**
   * ロッカーエンティティ登録
   * @param entities エンティティリスト
   * @returns {Promise<void>} 処理完了を示すPromiseオブジェクト
   */
  public async saveLockerEntities(containerName: string, entities: LockerType[]): Promise<void> {
    const container = await this.readContainer(containerName, "/id");

    // 登録処理
    for (const entity of entities) {
      console.log(entity);
      const ret = await container.items.upsert(entity);
    }
  }

  /**
   * 備品エンティティ登録
   * @param entities エンティティリスト
   * @returns {Promise<void>} 処理完了を示すPromiseオブジェクト
   */
  public async saveItemEntities(containerName: string, entities: ItemType[]): Promise<void> {
    const container = await this.readContainer(containerName, "/id");

    // 登録処理
    for (const entity of entities) {
      console.log(entity);
      const ret = await container.items.upsert(entity);
    }
  }

  /**
   * ロッカーエンティティ取得
   * @param query クエリ
   * @param parameters パラメーター
   * @returns {Promise<LockerType>} 処理完了を示すPromiseオブジェクト
   */
  public async getLockerEntities(
    containerName: string,
    query: string,
    parameters?: SqlParameter[]
  ): Promise<LockerType[]> {
    const container = await this.readContainer(containerName, "/id");
    const response = await container.items
      .query({
        query: query,
        parameters: parameters,
      })
      .fetchAll();
    const resources = response.resources.map((r) => {
      // Entity以外の項目(_rid,_self,_etag,_attachments,_ts)を除外して返却
      for (const k of Object.keys(r)) {
        if (k.startsWith("_")) {
          delete r[k];
        }
      }
      return r;
    });
    return resources;
  }

  /**
   * 備品エンティティ取得
   * @param query クエリ
   * @param parameters パラメーター
   * @returns {Promise<ItemType>} 処理完了を示すPromiseオブジェクト
   */
  public async getItemEntities(
    containerName: string,
    query: string,
    parameters?: SqlParameter[]
  ): Promise<ItemType[]> {
    const container = await this.readContainer(containerName, "/id");
    const response = await container.items
      .query({
        query: query,
        parameters: parameters,
      })
      .fetchAll();
    const resources = response.resources.map((r) => {
      // Entity以外の項目(_rid,_self,_etag,_attachments,_ts)を除外して返却
      for (const k of Object.keys(r)) {
        if (k.startsWith("_")) {
          delete r[k];
        }
      }
      return r;
    });
    return resources;
  }

  /**
   * ロッカーエンティティ削除
   * @param entities エンティティリスト
   * @return {Promise<void>} 処理完了を示すPromiseオブジェクト
   */
  public async deleteLockerEntities(containerName: string, entities: LockerType[]): Promise<void> {
    const container = await this.readContainer(containerName, "/id");

    // 削除処理
    for (const e of entities) {
      const ret = await container.item(e.id, e.id).delete();
    }
  }

  /**
   * 備品エンティティ削除
   * @param entities エンティティリスト
   * @return {Promise<void>} 処理完了を示すPromiseオブジェクト
   */
  public async deleteItemEntities(containerName: string, entities: ItemType[]): Promise<void> {
    const container = await this.readContainer(containerName, "/id");

    // 削除処理
    for (const e of entities) {
      const ret = await container.item(e.id, e.id).delete();
    }
  }

  /**
   * Cosmos DBコンテナを読出し
   * - 存在しない場合はサーバーレスモードで新規作成する
   * @param name - Cosmos DBコンテナ名。
   * @param partitionKey - Cosmos DBコンテナのパーティションキー。
   */
  private async readContainer(name: string, partitionKey: string): Promise<Container> {
    try {
      const { container } = await this.database.container(name).read();
      return container;
    } catch (error) {
      if (error.code === 404) {
        // コンテナが存在しない場合は新規作成
        const { container } = await this.database.containers.create({
          id: name,
          partitionKey: { paths: [partitionKey] },
        });
        return container;
      } else {
        console.error(error);
        throw error;
      }
    }
  }
}
