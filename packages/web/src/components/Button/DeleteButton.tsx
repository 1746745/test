import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";

// 削除ボタンのプロパティ
interface DeleteButtonProps {
  /** クリック時のハンドラ */
  onClick: (ev: React.MouseEvent) => void;
  /** ボタンのサイズ(任意) */
  size?: "small" | "medium" | "large";
  /** sxプロパティ(任意) */
  sx?: object;
}

/**
 * 削除ボタンコンポーネント
 *
 * @param onClick - クリック時のハンドラ
 * @param props - その他のプロパティ
 */
export const DeleteButton: React.FC<DeleteButtonProps> = ({
  onClick,
  ...props
}) => {
  return (
    <>
      <IconButton onClick={onClick} {...props}>
        <DeleteIcon />
      </IconButton>
    </>
  );
};
