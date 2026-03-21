import type { ItemType } from "@/types";
import { callAzureFunction, HttpMethod } from "@/utils/API";

/**
 * 備品情報を更新するカスタムフック
 * @returns 備品情報
 */
export const useUpdateItems = async (item: ItemType): Promise<void> => {
  await callAzureFunction({
    functionUrl: "updateItem",
    options: {
      method: HttpMethod.POST,
      body: item
    },
  });
};
