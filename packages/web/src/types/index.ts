/**
 * 備品タイプ
 */
export type ItemType = {
  /** 備品ID */
  id: number;

  /** 備品名 */
  name: string;

  /** カテゴリ */
  category: string;

  /** ステータス */
  status: string;

  /** 備品の備考 */
  note?: string;
};

/** ロッカータイプ */
export type LockerType = {
  /** ロッカーID */
  id: string;

  /** ロッカー名 */
  name: string;

  /** ロッカーの位置(左) */
  left: number;

  /** ロッカーの位置(上) */
  top: number;

  /** ロッカーのサイズ(横幅) */
  width: number;

  /** ロッカーのサイズ(縦幅) */
  height: number;
};
