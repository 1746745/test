import type { LockerType } from "@/types";
import { callAzureFunction, HttpMethod } from "@/utils/API";

/**
 * ロッカー情報を更新するカスタムフック
 * @returns ロッカー情報
 */
export const useUpdateLocker = async (locker: LockerType): Promise<void> => {
  await callAzureFunction({
    functionUrl: "updateLocker",
    options: {
      method: HttpMethod.POST,
      body: locker
    },
  });
};
