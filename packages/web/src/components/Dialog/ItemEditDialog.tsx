import type { ItemType } from "@/types";
import { Box, TextField } from "@mui/material";
import { AppDialog } from "./AppDialog";

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
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="名称"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="カテゴリ"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="状態"
              name="status"
              value={form.status}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="備考"
              name="note"
              value={form.note}
              onChange={handleChange}
              fullWidth
            />
          </Box>
        }
        cancelText="キャンセル"
        submitText="保存"
      />
    </>
  );
};
