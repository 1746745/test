import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

/** アプリ共通ダイアログのプロパティ */
interface DialogProps {
  /** 開閉制御 */
  open: boolean;
  /** 閉じるボタンが押されたときの処理 */
  onClose: () => void;
  /** キャンセルボタンが押されたときの処理 */
  onCancel: () => void;
  /** OKボタンが押されたときの処理 */
  onSubmit: () => void;
  /** ダイアログのタイトル */
  title: string;
  /** ダイアログの内容 */
  content: React.ReactNode;
  /** キャンセルボタンのテキスト */
  cancelText: string;
  /** OKボタンのテキスト */
  submitText: string;
}

/**
 * アプリ共通ダイアログコンポーネント
 * @param param0
 * @returns
 */
export const AppDialog = ({
  open,
  onClose,
  onCancel,
  onSubmit,
  title,
  content,
  cancelText,
  submitText,
}: DialogProps) => {
  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{content}</DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>{cancelText}</Button>
          <Button onClick={onSubmit}>{submitText}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
