import type { ItemType } from "@/types";
import { Box, MenuItem, TextField } from "@mui/material";
import { AppDialog } from "./AppDialog";

const STATUS_OPTIONS = ["利用可能", "使用中", "メンテナンス中", "廃棄"];

/** 備品編集ダイアログのプロパティ */
interface ItemEditDialogProps {
  /** 開閉状態 */
  open: boolean;
  /** 編集対象index */
  editIndex: number | null;
  /** フォームデータ */
  form: Omit<ItemType, "id">;
  /** フォームデータを更新する関数 */
  setForm: React.Dispatch<React.SetStateAction<Omit<ItemType, "id">>>;
  /** ダイアログを閉じる関数 */
  handleClose: () => void;
  /** フォームデータを送信する関数 */
  handleSubmit: () => void;
}

/**
 * 備品編集ダイアログ
 * @param param0
 * @returns
 */
export const ItemEditDialog = ({
  open,
  editIndex,
  form,
  setForm,
  handleClose,
  handleSubmit,
}: ItemEditDialogProps) => {
  /** フォームの値が変更されたときの処理 */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <AppDialog
        open={open}
        onClose={handleClose}
        onCancel={handleClose}
        onSubmit={handleSubmit}
        title={editIndex !== null ? "備品編集" : "備品追加"}
        content={
          <Box display="flex" flexDirection="column" gap={2} mt={1} minWidth={320}>
            <TextField
              autoFocus
              label="備品名"
              name="itemName"
              value={form.itemName}
              onChange={handleChange}
              required
              fullWidth
              size="small"
            />
            <TextField
              label="カテゴリ"
              name="category"
              value={form.category}
              onChange={handleChange}
              fullWidth
              size="small"
            />
            <TextField
              select
              label="ステータス"
              name="status"
              value={form.status || STATUS_OPTIONS[0]}
              onChange={handleChange}
              fullWidth
              size="small"
            >
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="備考"
              name="note"
              value={form.note}
              onChange={handleChange}
              fullWidth
              size="small"
              multiline
              rows={2}
            />
          </Box>
        }
        cancelText="キャンセル"
        submitText="保存"
      />
    </>
  );
};
