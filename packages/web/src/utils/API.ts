/** APIのベースURL */
const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * HTTPメソッド
 */
export enum HttpMethod {
  /** GETメソッド */
  GET = "GET",
  /** POSTメソッド */
  POST = "POST",
}

/** Azure Function呼び出しパラメータ */
export interface callAzureFunctionParams {
  /** Azure FunctionのURL */
  functionUrl: string;
  /** オプション */
  options?: {
    /** HTTPメソッド */
    method?: HttpMethod;
    /** ヘッダー */
    headers?: Record<string, string>;
    /** ボディ */
    body?: any;
  };
}

/**
 * Azure Function呼び出しユーティリティ
 * @param functionUrl 実行する関数のURL（関数名）
 * @param options オプション（HTTPメソッド）
 * @returns レスポンスデータ（JSON形式）
 */
export async function callAzureFunction(props: callAzureFunctionParams) {
  const { functionUrl, options } = props;
  try {
    const response = await fetch(`${API_BASE_URL}/${functionUrl}`, {
      method: options?.method,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        ...(options?.headers || {}),
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      throw new Error("APIエラーが発生しました");
    }
    // レスポンスをJSON形式で返却
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Azure Function呼び出しエラー:", error);
    throw error;
  }
}
