import TopTabs from "@/components/TopTabs/TopTabs";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";

/**
 * アプリヘッダーコンポーネント
 * @returns アプリヘッダーコンポーネント
 */
const AppHeader: React.FC = () => {
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
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AppHeader;
