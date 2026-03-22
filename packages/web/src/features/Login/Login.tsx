import { useAuth } from "@/auth";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Alert, Avatar, Box, Button, CircularProgress, Paper, Typography } from "@mui/material";
import React from "react";

/**
 * ログイン画面
 */
export const Login: React.FC = () => {
  const { login } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await login();
    } catch {
      setError("ログインに失敗しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.100",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          width: 360,
        }}
      >
        <Avatar sx={{ bgcolor: "primary.main", mb: 1 }}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography variant="h5" component="h1" fontWeight={700}>
          PortalApp
        </Typography>

        <Typography variant="body2" color="text.secondary" textAlign="center">
          Azureアカウントでログインしてください
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleLogin}
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={18} color="inherit" /> : undefined
          }
          sx={{ mt: 1 }}
        >
          {loading ? "ログイン中..." : "Microsoftアカウントでログイン"}
        </Button>
      </Paper>
    </Box>
  );
};
