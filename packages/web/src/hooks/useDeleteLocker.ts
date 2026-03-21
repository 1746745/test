import type { LockerType } from "@/types";
import { callAzureFunction, HttpMethod } from "@/utils/API";

/**
 * ロッカー情報を削除するカスタムフック
 */
export const useDeleteLocker = async (locker: LockerType): Promise<void> => {
  await callAzureFunction({
    functionUrl: "deleteLocker",
    options: {
      method: HttpMethod.POST,
      body: locker
    },
  });
};
