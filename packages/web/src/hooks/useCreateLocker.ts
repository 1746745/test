import type { LockerType } from "@/types";
import { callAzureFunction, HttpMethod } from "@/utils/API";

/**
 * ロッカー情報を登録するカスタムフック
 */
export const useCreateLocker = async (
  locker: LockerType,
): Promise<{ id: string }> => {
  return await callAzureFunction({
    functionUrl: "createLocker",
    options: {
      method: HttpMethod.POST,
      body: locker,
    },
  });
};
