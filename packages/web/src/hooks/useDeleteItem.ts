import type { ItemType } from "@/types";
import { callAzureFunction, HttpMethod } from "@/utils/API";

/**
 * 備品情報を削除するカスタムフック
 * @returns 備品情報
 */
export const useDeleteItems = async (item: ItemType): Promise<void> => {
  await callAzureFunction({
    functionUrl: "deleteItem",
    options: {
      method: HttpMethod.POST,
      body: item
    },
  });
};
