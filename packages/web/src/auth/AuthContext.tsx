import { PublicClientApplication, type AccountInfo } from "@azure/msal-browser";
import React from "react";
import { loginRequest, msalConfig, UserRole } from "./authConfig";

interface AuthContextValue {
  /** ログイン中のアカウント情報 */
  account: AccountInfo | null;
  /** ユーザーロール */
  role: UserRole;
  /** ログイン関数 */
  login: () => Promise<void>;
  /** ログアウト関数 */
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextValue>({
  account: null,
  role: UserRole.User,
  login: async () => {},
  logout: () => {},
});

const msalInstance = new PublicClientApplication(msalConfig);

/**
 * 認証プロバイダー
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [account, setAccount] = React.useState<AccountInfo | null>(null);
  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    msalInstance.initialize().then(() => {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) setAccount(accounts[0]);
      setInitialized(true);
    });
  }, []);

  /** IDトークンのrolesクレームからロールを判定 */
  const getRole = (acc: AccountInfo | null): UserRole => {
    const claims = acc?.idTokenClaims as Record<string, unknown> | undefined;
    const roles = claims?.roles as string[] | undefined;
    if (roles?.includes(UserRole.Admin)) return UserRole.Admin;
    return UserRole.User;
  };

  const login = async () => {
    const result = await msalInstance.loginPopup(loginRequest);
    setAccount(result.account);
  };

  const logout = () => {
    msalInstance.logoutPopup().then(() => setAccount(null));
  };

  if (!initialized) return null;

  return (
    <AuthContext.Provider
      value={{ account, role: getRole(account), login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/** 認証コンテキストを使用するカスタムフック */
export const useAuth = () => React.useContext(AuthContext);
