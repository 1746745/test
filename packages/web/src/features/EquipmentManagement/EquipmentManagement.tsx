import { ItemEditDialog } from "@/components";
import AppHeader from "@/components/AppHeader/AppHeader";
import { DeleteButton, EditButton } from "@/components/Button";
import {
  useCreateItem,
  useDeleteItems,
  useGetItems,
  useUpdateItems,
} from "@/hooks";
import type { ItemType } from "@/types";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

/**
 * 備品管理コンポーネント
 * @returns 備品管理画面
 */
export const EquipmentManagement = () => {
  /** 備品情報の状態 */
  const [equipments, setEquipments] = useState<ItemType[]>([]);
  /** ダイアログのオープン状態 */
  const [open, setOpen] = useState(false);
  /** 編集中のインデックス */
  const [editIndex, setEditIndex] = useState<number | null>(null);
  /** フォームの状態 */
  const [form, setForm] = useState<Omit<ItemType, "id">>({
    name: "",
    category: "",
    status: "",
    note: "",
  });

  /** ダイアログを開く */
  const handleOpen = (index: number | null = null) => {
    setEditIndex(index);
    if (index !== null) {
      const { id, ...item } = equipments[index];
      setForm(item);
    } else {
      setForm({ name: "", category: "", status: "", note: "" });
    }
    setOpen(true);
  };

  /** ダイアログを閉じる */
  const handleClose = () => {
    setOpen(false);
    setEditIndex(null);
  };

  /** フォームが送信されたときの処理 */
  const handleSubmit = async () => {
    // 更新されたかどうか
    if (editIndex !== null) {
      const updated = [...equipments];
      updated[editIndex] = { ...updated[editIndex], ...form };
      setEquipments(updated);

      // DBの情報を更新
      await useUpdateItems(updated[editIndex]);
    } else {
      const newItem = { id: Date.now(), ...form };
      setEquipments([...equipments, newItem]);

      // DBに登録
      await useCreateItem(newItem);
    }
    handleClose();
  };

  /** 備品を削除する処理 */
  const handleDelete = async (index: number) => {
    const target = equipments.filter((_, i) => i !== index);
    setEquipments(target);

    // DBの情報を更新
    await useDeleteItems(target[index]);
  };

  /** APIを呼び出してDBデータを取得 */
  React.useEffect(() => {
    const fetchData = async () => {
      const items = await useGetItems();
      setEquipments(items);
    };
    fetchData();
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      {/** アプリ共通ヘッダー */}
      <AppHeader />

      {/** 備品管理画面 */}
      <Box p={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          備品管理
        </Typography>
        <Box mb={2} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            備品追加
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>名称</TableCell>
                <TableCell>カテゴリ</TableCell>
                <TableCell>状態</TableCell>
                <TableCell>備考</TableCell>
                <TableCell align="right">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {equipments.map((eq, idx) => (
                <TableRow key={eq.id}>
                  <TableCell>{eq.name}</TableCell>
                  <TableCell>{eq.category}</TableCell>
                  <TableCell>{eq.status}</TableCell>
                  <TableCell>{eq.note}</TableCell>
                  <TableCell align="right">
                    {/** 編集ボタン */}
                    <EditButton onClick={() => handleOpen(idx)} />

                    {/** 削除ボタン */}
                    <DeleteButton onClick={() => handleDelete(idx)} />
                  </TableCell>
                </TableRow>
              ))}
              {equipments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    登録された備品がありません
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/** 編集ダイアログ */}
        <ItemEditDialog
          open={open}
          editIndex={editIndex}
          form={form}
          setForm={setForm}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
        />
      </Box>
    </Box>
  );
};
