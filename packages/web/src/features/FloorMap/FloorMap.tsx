import AppHeader from "@/components/AppHeader/AppHeader";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React from "react";
import { ZoomPanPinchWrapper } from "./components";

/**
 * フロアマップ画面
 * @returns フロアマップ画面コンポーネント
 */
export const FloorMap: React.FC = () => {
  return (
    <Box sx={{ width: "100%" }}>
      {/** アプリ共通ヘッダー */}
      <AppHeader />

      <Box sx={{ py: 4, pl: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          フロアマップ画面
        </Typography>

        <Paper sx={{ width: "95%", height: 700, p: 2 }} elevation={1}>
          <Box sx={{ width: "60%", height: 300 }}>
            <React.Suspense fallback={<Typography>Loading...</Typography>}>
              <ZoomPanPinchWrapper />
            </React.Suspense>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
