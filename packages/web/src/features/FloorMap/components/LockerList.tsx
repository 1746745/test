import { DeleteButton } from "@/components/Button/DeleteButton";
import { useDeleteLocker, useGetItems } from "@/hooks";
import type { LockerType } from "@/types";
import { Box, Divider, List, ListItem, Typography } from "@mui/material";
import React from "react";

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
  /** APIを呼び出してDBデータを取得 */
  React.useEffect(() => {
    const fetchData = async () => {
      const items = await useGetItems();
      return items;
    };
    fetchData();
  }, []);

  return (
    <>
      <Box
        sx={{
          width: 560,
          borderLeft: "1px solid #eee",
          p: 1,
          boxSizing: "border-box",
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
                  <Box sx={{ flex: 1 }} onClick={() => setSelectedId(r.id)}>
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
                        {r.name}
                      </Typography>

                      <Typography
                        component="div"
                        sx={{
                          fontSize: 11,
                          color: "text.secondary",
                        }}
                      >
                        {`座標（L:${Math.round(r.left)} T:${Math.round(
                          r.top
                        )} W:${Math.round(r.width)} H:${Math.round(
                          r.height
                        )}）`}
                      </Typography>
                    </Box>
                  </Box>

                  {/** 削除ボタン */}
                  <DeleteButton
                    onClick={async (e) => {
                      e.stopPropagation();
                      setLockers((prev) => prev.filter((p) => p.id !== r.id));
                      if (selectedId === r.id) setSelectedId(null);

                      // DBから削除
                      await useDeleteLocker(r);
                    }}
                  />

                  {/** TODO 選択されたロッカー内の備品を登録 */}
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </>
  );
};
