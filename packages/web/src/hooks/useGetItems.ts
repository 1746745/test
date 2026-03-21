import type { ItemType } from "@/types";
import { callAzureFunction, HttpMethod } from "@/utils/API";

/**
 * 備品情報を取得するカスタムフック
 * @returns 備品情報の配列
 */
export const useGetItems = async (): Promise<ItemType[]> => {
  const response: ItemType[] = (await callAzureFunction({
    functionUrl: "getItems",
    options: {
      method: HttpMethod.GET,
    },
  }).then((data) => data)) as ItemType[];
  return response;
};
