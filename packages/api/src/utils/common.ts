import { ulid } from "ulid";

/**
 * ローカルホスト判定
 *
 * @param url - URL
 * @returns ローカルホストの場合は true、それ以外の場合は false
 */
export function isLocalhost(url: string): boolean {
  const localhostPatterns = ["http://localhost", "https://localhost"];
  return localhostPatterns.some((pattern) => url.startsWith(pattern));
}

/**
 * ULIDを用いた一意なIDを作成
 *   ULID: 生成順でソート可能な一意のIDを生成するNodeライブラリ
 * @returns ID
 */
export function createULID(): string {
  return ulid();
}
