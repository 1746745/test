import { useAuth } from "@/auth";
import { Login } from "@/features/Login";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * 認証済みユーザーのみアクセスを許可するルートラッパー
 * 未認証の場合はログイン画面を表示する
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { account } = useAuth();

  if (!account) {
    return <Login />;
  }

  return <>{children}</>;
};
