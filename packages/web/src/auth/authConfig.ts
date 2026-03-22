import type { Configuration, PopupRequest } from "@azure/msal-browser";

/** MSALの設定 */
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID ?? "",
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID ?? ""}`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

/** ログインリクエスト設定 */
export const loginRequest: PopupRequest = {
  scopes: ["openid", "profile", "email"],
};

/** ユーザーロール */
export enum UserRole {
  /** 管理者 */
  Admin = "Admin",
  /** 利用者 */
  User = "User",
}
