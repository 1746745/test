import { ItemAddDialog } from "@/components/Dialog/ItemAddDialog";
import { ItemEditDialog } from "@/components/Dialog/ItemEditDialog";
import { DeleteButton, EditButton } from "@/components/Button";
import { useCreateItem, useDeleteItems, useGetItemsByLockerId, useUpdateItems } from "@/hooks";
import type { ItemType, LockerType } from "@/types";
import AddIcon from "@mui/icons-material/Add";
import { Box, Chip, Divider, IconButton, List, ListItem, Tooltip, Typography } from "@mui/material";
import React from "react";

/** アイテムリストコンポーネントのプロパティ */
interface ItemListProps {
  /** 選択中のロッカー */
  locker: LockerType;
}

/**
 * 選択ロッカーのアイテムリストコンポーネント
 */
export const ItemList = ({ locker }: ItemListProps) => {
  const [items, setItems] = React.useState<ItemType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<ItemType | null>(null);
  const [editForm, setEditForm] = React.useState<Omit<ItemType, "id">>({
    itemName: "",
    lockerId: locker.id,
    category: "",
    status: "",
    note: "",
  });

  React.useEffect(() => {
    setLoading(true);
    useGetItemsByLockerId(locker.id)
      .then((data) => setItems(data ?? []))
      .finally(() => setLoading(false));
  }, [locker.id]);

  const handleAdd = async (values: { itemName: string; category: string; status: string; note: string }) => {
    const newItem: ItemType = {
      id: 0,
      lockerId: locker.id,
      itemName: values.itemName,
      category: values.category,
      status: values.status,
      note: values.note || undefined,
    };
    await useCreateItem(newItem);
    const updated = await useGetItemsByLockerId(locker.id);
    setItems(updated ?? []);
    setAddDialogOpen(false);
  };

  const handleDelete = async (item: ItemType) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    await useDeleteItems(item);
  };

  const handleEditOpen = (item: ItemType) => {
    setEditingItem(item);
    const { id, ...rest } = item;
    setEditForm(rest);
  };

  const handleEditSubmit = async () => {
    if (!editingItem) return;
    const updated = { ...editingItem, ...editForm };
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    await useUpdateItems(updated);
    setEditingItem(null);
  };

  return (
    <Box
      sx={{
        width: 280,
        borderLeft: "1px solid #eee",
        p: 1,
        boxSizing: "border-box",
        overflowY: "auto",
        maxHeight: "80vh",
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          {locker.lockerName}
        </Typography>
        <Tooltip title="備品を追加">
          <IconButton size="small" onClick={() => setAddDialogOpen(true)}>
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Divider />
      {loading ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          読み込み中...
        </Typography>
      ) : items.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          備品が登録されていません
        </Typography>
      ) : (
        <List disablePadding>
          {items.map((item) => (
            <ListItem key={item.id} sx={{ px: 0.5, py: 0.5 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                      {item.itemName}
                    </Typography>
                    <Chip label={item.status} size="small" sx={{ fontSize: 10 }} />
                  </Box>
                  <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                    {item.category}
                  </Typography>
                  {item.note && (
                    <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                      {item.note}
                    </Typography>
                  )}
                </Box>
                <EditButton onClick={() => handleEditOpen(item)} />
                <DeleteButton onClick={() => handleDelete(item)} />
              </Box>
            </ListItem>
          ))}
        </List>
      )}

      <ItemAddDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={handleAdd}
      />

      <ItemEditDialog
        open={editingItem !== null}
        editIndex={0}
        form={editForm}
        setForm={setEditForm}
        handleClose={() => setEditingItem(null)}
        handleSubmit={handleEditSubmit}
      />
    </Box>
  );
};
