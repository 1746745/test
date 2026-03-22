import AppHeader from "@/components/AppHeader/AppHeader";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React from "react";
import { ZoomPanPinchWrapper } from "./components";

/**
 * フロアマップ画面
 * @returns フロアマップ画面コンポーネント
 */
export const FloorMap: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <Box sx={{ width: "100%" }}>
      {/** アプリ共通ヘッダー */}
      <AppHeader />

      <Box sx={{ py: 2, pl: 2 }}>
        <TextField
          placeholder="備品を検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{ mb: 2, width: 320 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <Paper sx={{ width: "95%", height: 700, p: 2 }} elevation={1}>
          <Box sx={{ width: "60%", height: 300 }}>
            <React.Suspense fallback={<Typography>Loading...</Typography>}>
              <ZoomPanPinchWrapper searchQuery={searchQuery} />
            </React.Suspense>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
