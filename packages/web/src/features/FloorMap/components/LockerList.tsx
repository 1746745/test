import { AppDialog } from "@/components/Dialog/AppDialog";
import { DeleteButton } from "@/components/Button/DeleteButton";
import { useAuth, UserRole } from "@/auth";
import { useDeleteLocker, useGetItems, useUpdateLocker } from "@/hooks";
import type { LockerType } from "@/types";
import { Box, Divider, List, ListItem, TextField, Typography } from "@mui/material";
import React from "react";
import { ItemList } from "./ItemList";

/** ロッカーリストコンポーネントのプロパティ */
interface LockerListProps {
  /** ロッカーの配列 */
  lockers: LockerType[];
  /** ロッカーの状態を更新する関数 */
  setLockers: React.Dispatch<React.SetStateAction<LockerType[]>>;
  /** 選択中のロッカーID */
  selectedId: string | null;
  /** 選択中のロッカーIDを更新する関数 */
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
}

/**
 * ロッカーリストコンポーネント
 * @param param0
 * @returns
 */
export const LockerList = ({
  lockers,
  setLockers,
  selectedId,
  setSelectedId,
}: LockerListProps) => {
  const { role } = useAuth();
  const isAdmin = role === UserRole.Admin;

  /** APIを呼び出してDBデータを取得 */
  React.useEffect(() => {
    const fetchData = async () => {
      const items = await useGetItems();
      return items;
    };
    fetchData();
  }, []);

  const selectedLocker = lockers.find((r) => r.id === selectedId) ?? null;

  // リネーム用の状態
  const [renamingLocker, setRenamingLocker] = React.useState<LockerType | null>(null);
  const [renameValue, setRenameValue] = React.useState("");

  const handleRenameSubmit = async () => {
    if (!renamingLocker || !renameValue.trim()) return;
    const updated = { ...renamingLocker, lockerName: renameValue.trim() };
    setLockers((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    await useUpdateLocker(updated);
    setRenamingLocker(null);
  };

  return (
    <Box sx={{ display: "flex", flexShrink: 0, width: 560 }}>
      <Box
        sx={{
          width: selectedLocker ? 280 : 560,
          borderLeft: "1px solid #eee",
          p: 1,
          boxSizing: "border-box",
          overflowY: "auto",
          maxHeight: "80vh",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          ロッカーリスト
        </Typography>
        <Divider />
        {lockers.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            登録されているロッカーがありません
          </Typography>
        ) : (
          <List disablePadding>
            {lockers.map((r, _) => (
              <ListItem key={r.id} sx={{ borderRadius: 1, mb: 0.5 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  {/** ロッカー */}
                  <Box
                    sx={{ flex: 1 }}
                    onClick={() => setSelectedId(r.id)}
                    onDoubleClick={() => {
                      if (!isAdmin) return;
                      setRenamingLocker(r);
                      setRenameValue(r.lockerName);
                    }}
                  >
                    <Box
                      sx={{
                        p: 0.5,
                        borderRadius: 1,
                        cursor: "pointer",
                        transition:
                          "background-color 150ms, box-shadow 150ms, transform 150ms",
                        backgroundColor:
                          selectedId === r.id
                            ? "action.selected"
                            : "transparent",
                        boxShadow:
                          selectedId === r.id
                            ? (theme: any) =>
                                `0 0 0 2px ${theme.palette.primary.light}`
                            : "none",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        component="div"
                        sx={{
                          fontSize: 12,
                          fontWeight: selectedId === r.id ? 700 : 600,
                          color:
                            selectedId === r.id
                              ? "primary.main"
                              : "text.primary",
                        }}
                      >
                        {r.lockerName}
                      </Typography>

                      <Typography
                        component="div"
                        sx={{
                          fontSize: 11,
                          color: "text.secondary",
                        }}
                      >
                        {`座標（L:${Math.round(r.left)} T:${Math.round(
                          r.top,
                        )} W:${Math.round(r.width)} H:${Math.round(
                          r.height,
                        )}）`}
                      </Typography>
                    </Box>
                  </Box>

                  {/** 削除ボタン（管理者のみ） */}
                  {isAdmin && <DeleteButton
                    onClick={async (e) => {
                      e.stopPropagation();
                      setLockers((prev) => prev.filter((p) => p.id !== r.id));
                      if (selectedId === r.id) setSelectedId(null);

                      // DBから削除
                      await useDeleteLocker(r);
                    }}
                  />}

                  {/** TODO 選択されたロッカー内の備品を登録 */}
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      {selectedLocker && <ItemList locker={selectedLocker} />}

      <AppDialog
        open={renamingLocker !== null}
        onClose={() => setRenamingLocker(null)}
        onCancel={() => setRenamingLocker(null)}
        onSubmit={handleRenameSubmit}
        title="ロッカー名を変更"
        content={
          <TextField
            autoFocus
            label="名前"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleRenameSubmit(); }}
            fullWidth
            size="small"
            sx={{ mt: 1 }}
          />
        }
        cancelText="キャンセル"
        submitText="変更"
      />
    </Box>
  );
};
