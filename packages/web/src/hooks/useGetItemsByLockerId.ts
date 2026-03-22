import type { ItemType } from "@/types";
import { callAzureFunction, HttpMethod } from "@/utils/API";

/**
 * ロッカーIDで備品情報を取得するカスタムフック
 * @param lockerId ロッカーID
 * @returns 備品情報の配列
 */
export const useGetItemsByLockerId = async (
  lockerId: string,
): Promise<ItemType[]> => {
  const response = (await callAzureFunction({
    functionUrl: `getItemsByLockerId?lockerid=${encodeURIComponent(lockerId)}`,
    options: {
      method: HttpMethod.GET,
    },
  })) as ItemType[];
  return response;
};
