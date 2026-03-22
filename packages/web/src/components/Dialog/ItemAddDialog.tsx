import { AppDialog } from "@/components/Dialog/AppDialog";
import { Box, MenuItem, TextField } from "@mui/material";
import React from "react";

/** アイテム追加フォームの値 */
export interface ItemAddFormValues {
  itemName: string;
  category: string;
  status: string;
  note: string;
}

/** アイテム追加ダイアログのプロパティ */
interface ItemAddDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ItemAddFormValues) => void;
}

const STATUS_OPTIONS = ["利用可能", "使用中", "メンテナンス中", "廃棄"];

/**
 * アイテム追加ダイアログ
 */
export const ItemAddDialog = ({ open, onClose, onSubmit }: ItemAddDialogProps) => {
  const [values, setValues] = React.useState<ItemAddFormValues>({
    itemName: "",
    category: "",
    status: STATUS_OPTIONS[0],
    note: "",
  });

  const handleChange = (field: keyof ItemAddFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!values.itemName.trim()) return;
    onSubmit(values);
    setValues({ itemName: "", category: "", status: STATUS_OPTIONS[0], note: "" });
  };

  const handleCancel = () => {
    setValues({ itemName: "", category: "", status: STATUS_OPTIONS[0], note: "" });
    onClose();
  };

  return (
    <AppDialog
      open={open}
      onClose={handleCancel}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
      title="備品を追加"
      content={
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1, minWidth: 320 }}>
          <TextField
            autoFocus
            label="備品名"
            value={values.itemName}
            onChange={handleChange("itemName")}
            required
            fullWidth
            size="small"
          />
          <TextField
            label="カテゴリ"
            value={values.category}
            onChange={handleChange("category")}
            fullWidth
            size="small"
          />
          <TextField
            select
            label="ステータス"
            value={values.status}
            onChange={handleChange("status")}
            fullWidth
            size="small"
          >
            {STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="備考"
            value={values.note}
            onChange={handleChange("note")}
            fullWidth
            size="small"
            multiline
            rows={2}
          />
        </Box>
      }
      cancelText="キャンセル"
      submitText="追加"
    />
  );
};
