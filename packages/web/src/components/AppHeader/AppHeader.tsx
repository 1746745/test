import { useAuth, UserRole } from "@/auth";
import TopTabs from "@/components/TopTabs/TopTabs";
import LogoutIcon from "@mui/icons-material/Logout";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React from "react";

/**
 * アプリヘッダーコンポーネント
 * @returns アプリヘッダーコンポーネント
 */
const AppHeader: React.FC = () => {
  const { account, role, logout } = useAuth();

  return (
    <AppBar position="static" color="primary">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <Typography variant="h6" component="div" sx={{ mr: 3 }}>
              PortalApp
            </Typography>
            <TopTabs />
          </Box>

          {account && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label={role === UserRole.Admin ? "管理者" : "利用者"}
                size="small"
                sx={{
                  bgcolor: role === UserRole.Admin ? "warning.main" : "success.main",
                  color: "white",
                  fontWeight: 700,
                }}
              />
              <Typography variant="body2" sx={{ color: "white" }}>
                {account.name ?? account.username}
              </Typography>
              <Tooltip title="ログアウト">
                <IconButton color="inherit" onClick={logout} size="small">
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AppHeader;
