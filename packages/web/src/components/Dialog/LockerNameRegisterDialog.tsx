import { useCreateLocker } from "@/hooks/useCreateLocker";
import type { LockerType } from "@/types";
import { TextField } from "@mui/material";
import React from "react";
import { AppDialog } from "./AppDialog";

// ロッカー名登録ダイアログのプロパティ
interface LockerNameRegisterDialogProps {
  /** 登録されているロッカー情報 */
  lockers: LockerType[];
  /** ロッカー情報を更新する関数 */
  setLockers: React.Dispatch<React.SetStateAction<LockerType[]>>;
  /** 選択されたロッカー名 */
  targetLockerName: string;
  /** ロッカー名を更新する関数 */
  setTargetLockerName: React.Dispatch<React.SetStateAction<string>>;
  /** 選択中のロッカーIDを更新する関数 */
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
}

/**
 * ロッカー名登録ダイアログ
 */
export const LockerNameRegisterDialog = ({
  lockers,
  setLockers,
  targetLockerName,
  setTargetLockerName,
  setSelectedId,
}: LockerNameRegisterDialogProps) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [pendingRenameId, setPendingRenameId] = React.useState<string | null>(null);

  // 新規に追加された "lockerName が空の" ロッカーを検知してダイアログを開く
  React.useEffect(() => {
    if (pendingRenameId) return;
    const unnamed = lockers.find(
      (r) => !r.lockerName || r.lockerName.trim() === "",
    );
    if (unnamed) {
      setPendingRenameId(unnamed.id);
      setTargetLockerName("");
      setDialogOpen(true);
    }
  }, [lockers, pendingRenameId]);

  // OKボタンが押されたときの処理
  const handleDialogSubmit = () => {
    const name = targetLockerName.trim();
    if (!pendingRenameId || name.length === 0) return;

    const locker = lockers.find((r) => r.id === pendingRenameId);
    if (!locker) return;

    const updatedLocker = { ...locker, lockerName: name };

    // 名前を同期的にstateへ反映（再検知防止）してからIDをクリア
    setLockers((prev) =>
      prev.map((r) => (r.id === pendingRenameId ? updatedLocker : r)),
    );
    setPendingRenameId(null);
    setTargetLockerName("");
    setDialogOpen(false);

    // 非同期でDBへ登録し、返却されたDBのIDでstateを更新して選択
    useCreateLocker(updatedLocker).then((res) => {
      const dbId = res?.id ?? updatedLocker.id;
      setLockers((prev) =>
        prev.map((r) =>
          r.id === updatedLocker.id ? { ...r, id: dbId } : r,
        ),
      );
      setSelectedId(dbId);
    });
  };

  // キャンセル時は追加した矩形を削除
  const handleDialogCancel = () => {
    if (pendingRenameId) {
      setLockers((prev) => prev.filter((r) => r.id !== pendingRenameId));
      setPendingRenameId(null);
    }
    setTargetLockerName("");
    setDialogOpen(false);
  };

  return (
    <>
      <AppDialog
        open={dialogOpen}
        onClose={handleDialogCancel}
        onCancel={handleDialogCancel}
        onSubmit={handleDialogSubmit}
        title="ロッカー名を入力"
        content={
          <TextField
            autoFocus
            margin="dense"
            label="名前"
            type="text"
            fullWidth
            variant="outlined"
            value={targetLockerName}
            onChange={(e) => setTargetLockerName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleDialogSubmit(); }}
          />
        }
        cancelText="キャンセル"
        submitText="OK"
      />
    </>
  );
};
