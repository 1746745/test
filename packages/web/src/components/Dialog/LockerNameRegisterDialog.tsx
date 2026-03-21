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
}

/**
 * ロッカー名登録ダイアログ
 *
 * @param param0
 * @returns
 */
export const LockerNameRegisterDialog = ({
  lockers,
  setLockers,
  targetLockerName,
  setTargetLockerName,
}: LockerNameRegisterDialogProps) => {
  // ダイアログ関連の状態
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [pendingRenameId, setPendingRenameId] = React.useState<string | null>(
    null
  );

  // 新規に追加された "name が空の" ロッカーを検知してダイアログを開く
  React.useEffect(() => {
    if (pendingRenameId) return;
    const unnamed = lockers.find((r) => !r.name || r.name.trim() === "");
    if (unnamed) {
      setPendingRenameId(unnamed.id);
      setTargetLockerName("");
      setDialogOpen(true);
    }
  }, [lockers, pendingRenameId]);

  // ダイアログが閉じられたら、名前があれば確定、なければロッカーを削除する
  React.useEffect(() => {
    // dialogOpen が false に遷移したタイミングで処理する
    if (dialogOpen) return;
    if (!pendingRenameId) return;

    const name = targetLockerName.trim();
    if (name.length > 0) {
      setLockers((prev) =>
        prev.map((r) => (r.id === pendingRenameId ? { ...r, name } : r))
      );

    } else {
      // キャンセルまたは空名の場合は追加した矩形を取り除く
      setLockers((prev) => prev.filter((r) => r.id !== pendingRenameId));
    }

    setPendingRenameId(null);
    setTargetLockerName("");
  }, [dialogOpen, pendingRenameId, targetLockerName]);

  // ダイアログのOKボタンが押されたときの処理
  const handleDialogSubmit = (name: string) => {
    setTargetLockerName(name);
    setDialogOpen(false);
  };

  // ユーザーがキャンセルしたときは pending の矩形を削除して状態をクリアする
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
        onClose={() => setDialogOpen(false)}
        onCancel={() => handleDialogCancel()}
        onSubmit={() => handleDialogSubmit(targetLockerName)}
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
          />
        }
        cancelText="キャンセル"
        submitText="OK"
      />
    </>
  );
};
