import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";

// 編集ボタンのプロパティ
interface EditButtonProps {
  /** クリック時のハンドラ */
  onClick?: (ev: React.MouseEvent) => void;
}

/**
 * 編集ボタンコンポーネント
 * @returns 編集ボタン
 */
export const EditButton = ({ onClick }: EditButtonProps) => {
  return (
    <IconButton onClick={onClick}>
      <EditIcon />
    </IconButton>
  );
};
