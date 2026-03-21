import type { LockerType } from "@/types";
import { callAzureFunction, HttpMethod } from "@/utils/API";

/**
 * ロッカー情報を取得するカスタムフック
 * @returns ロッカー情報の配列
 */
export const useGetLockers = async (): Promise<LockerType[]> => {
  const response: LockerType[] = (await callAzureFunction({
    functionUrl: "getLockers",
    options: {
      method: HttpMethod.GET,
    },
  }).then((data) => data)) as LockerType[];
  return response;
};
