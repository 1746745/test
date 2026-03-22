import { AuthProvider } from "./auth";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import { FloorMap } from "./features";
import { EquipmentManagement } from "./features/EquipmentManagement";
import { BrowserRouter, Route, Routes } from "react-router-dom";

/**
 * アプリケーションのルーティング設定
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <FloorMap />
              </ProtectedRoute>
            }
          />
          <Route
            path="/equipment"
            element={
              <ProtectedRoute>
                <EquipmentManagement />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
