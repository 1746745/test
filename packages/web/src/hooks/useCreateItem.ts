import type { ItemType } from "@/types";
import { callAzureFunction, HttpMethod } from "@/utils/API";

/**
 * 備品情報を登録するカスタムフック
 */
export const useCreateItem = async (item: ItemType): Promise<void> => {
  await callAzureFunction({
    functionUrl: "createItem",
    options: {
      method: HttpMethod.POST,
      body: item
    },
  });
};
