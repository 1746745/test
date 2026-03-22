import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import React from "react";

// 削除ボタンのプロパティ
interface DeleteButtonProps {
  /** クリック時のハンドラ */
  onClick: (ev: React.MouseEvent) => void;
  /** 確認ダイアログのメッセージ */
  confirmMessage?: string;
  /** ボタンのサイズ(任意) */
  size?: "small" | "medium" | "large";
  /** sxプロパティ(任意) */
  sx?: object;
}

/**
 * 削除ボタンコンポーネント（確認ダイアログ付き）
 */
export const DeleteButton: React.FC<DeleteButtonProps> = ({
  onClick,
  confirmMessage = "削除してもよろしいですか？",
  ...props
}) => {
  const [open, setOpen] = React.useState(false);
  const savedEvent = React.useRef<React.MouseEvent | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    savedEvent.current = e;
    setOpen(true);
  };

  const handleConfirm = () => {
    setOpen(false);
    if (savedEvent.current) onClick(savedEvent.current);
  };

  return (
    <>
      <IconButton onClick={handleClick} {...props}>
        <DeleteIcon />
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>削除の確認</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>キャンセル</Button>
          <Button onClick={handleConfirm} color="error">削除</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
