import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FloorMap } from "./features";
// import EquipmentManagement from its actual location:
import { EquipmentManagement } from "./features/EquipmentManagement";

/**
 * アプリケーションのルーティング設定
 */
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FloorMap />} />
          <Route path="/equipment" element={<EquipmentManagement />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
