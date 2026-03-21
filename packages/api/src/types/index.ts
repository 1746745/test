
/**
 * ロッカー情報の型定義
 */
export interface LockerType {
  /** ID */
  id: string,
  /** 名前 */
  lockerName: string,
  /** 座標(左) */
  left: string,
  /** 座標(上) */
  top: string,
  /** 横幅 */
  width: string,
  /** 高さ */
  height: string,
}

/**
 * 備品情報の型定義
 */
export interface ItemType {
  /** ID */
  id: string,
  /** 備品名 */
  itemName: string,
  /** 登録されているロッカーID */
  lockerId: string,
  /** カテゴリ */
  category: string,
  /** 状態 */
  status: string,
  /** 備考 */
  note: string,
}