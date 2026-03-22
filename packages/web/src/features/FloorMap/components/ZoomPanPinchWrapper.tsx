import { AppDialog } from "@/components/Dialog/AppDialog";
import { LockerNameRegisterDialog } from "@/components";
import { useGetLockers, useUpdateLocker } from "@/hooks/";
import type { LockerType } from "@/types";
import { Box, TextField } from "@mui/material";
import Paper from "@mui/material/Paper";
import React from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { LockerList } from "./LockerList";

/**
 * ズーム・パン・ピンチ操作をラップするコンポーネント
 *
 * @returns ZoomPanPinchWrapper コンポーネント
 */
export const ZoomPanPinchWrapper = () => {
  // コンポーネント全体のref（外部クリック判定用）
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  // クリック開始・終了座標を保持するためのref（画像内部座標）
  const startPoint = React.useRef<{ x: number; y: number } | null>(null);
  const [currentPoint, setCurrentPoint] = React.useState<{
    x: number;
    y: number;
  } | null>(null);

  // 選択範囲の表示状態
  const [selectionVisible, setSelectionVisible] = React.useState(false);

  // 作成済みロッカーの配列
  const [lockers, setLockers] = React.useState<LockerType[]>([]);

  // 選択中のロッカーID
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  // ロッカー名
  const [targetLockerName, setTargetLockerName] = React.useState<string>("");

  // リネーム用の状態
  const [renamingLocker, setRenamingLocker] = React.useState<LockerType | null>(null);
  const [renameValue, setRenameValue] = React.useState("");

  const handleRenameSubmit = async () => {
    if (!renamingLocker || !renameValue.trim()) return;
    const updated = { ...renamingLocker, lockerName: renameValue.trim() };
    setLockers((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    await useUpdateLocker(updated);
    setRenamingLocker(null);
  };

  // 編集モード: 'none' | 'move' | 'resize'
  const editMode = React.useRef<"none" | "move" | "resize">("none");

  // 編集開始時の参照データ
  const editRef = React.useRef<{
    startMouse: { x: number; y: number };
    rectBefore: { left: number; top: number; width: number; height: number };
    locker: LockerType;
  } | null>(null);

  // 画像要素へのref（座標計算やイベント登録用）
  const imgRef = React.useRef<HTMLImageElement | null>(null);

  // TransformWrapperの状態を保持
  const transformStateRef = React.useRef<{
    scale: number;
    positionX: number;
    positionY: number;
  }>({ scale: 1, positionX: 0, positionY: 0 });

  // 画像内座標取得用（ズーム・パン変換を考慮）
  const getRelativeCoordsFromClient = (clientX: number, clientY: number) => {
    const img = imgRef.current;
    if (!img) return null;
    const rect = img.getBoundingClientRect();
    const { scale } = transformStateRef.current;

    // TransformComponentによる変換を考慮した座標計算
    // rect.left/topは既にズーム・パンが適用された位置
    // そのため、単純にrectからの相対位置を計算し、scaleで割るだけ
    const x = (clientX - rect.left) / scale;
    const y = (clientY - rect.top) / scale;

    return { x, y };
  };

  /**
   * マウスダウンハンドラ
   *
   * @param e React.MouseEvent
   * @returns
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    // 左ボタンのみ開始
    if (e.button !== 0) return;
    const coords = getRelativeCoordsFromClient(e.clientX, e.clientY);
    if (!coords) return;
    startPoint.current = coords;
    setCurrentPoint(coords);
    setSelectionVisible(true);
    // 拡大・パン操作と競合しないようにイベントを止める
    e.preventDefault();
    e.stopPropagation();
  };

  /**
   * マウスムーブハンドラ
   *
   * @param e React.MouseEvent
   * @returns
   */
  const handleMouseMove = (e: React.MouseEvent) => {
    const coords = getRelativeCoordsFromClient(e.clientX, e.clientY);
    if (!coords) return;

    // 編集中（移動/リサイズ）があればそちら優先
    if (editMode.current !== "none" && selectedId && editRef.current) {
      const deltaX = coords.x - editRef.current.startMouse.x;
      const deltaY = coords.y - editRef.current.startMouse.y;
      setLockers((prev) =>
        prev.map((r) => {
          if (r.id !== selectedId) return r;
          if (editMode.current === "move") {
            return {
              ...r,
              left: editRef.current!.rectBefore.left + deltaX,
              top: editRef.current!.rectBefore.top + deltaY,
            };
          }
          // resize: bottom-rightハンドルで幅と高さを変更
          if (editMode.current === "resize") {
            return {
              ...r,
              width: Math.max(4, editRef.current!.rectBefore.width + deltaX),
              height: Math.max(4, editRef.current!.rectBefore.height + deltaY),
            };
          }
          return r;
        }),
      );
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // ロッカー作成中は現在点を更新
    if (startPoint.current) {
      setCurrentPoint(coords);
      e.preventDefault();
      e.stopPropagation();
    }
  };

  /**
   * マウスアップハンドラ（ロッカー作成）
   *
   * @param e React.MouseEvent
   * @returns
   */
  const handleMouseUp = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const coords = getRelativeCoordsFromClient(e.clientX, e.clientY);

    if (startPoint.current && coords) {
      // ロッカーを配列に追加（画像内座標）
      const left = Math.min(startPoint.current.x, coords.x);
      const top = Math.min(startPoint.current.y, coords.y);
      const width = Math.abs(startPoint.current.x - coords.x);
      const height = Math.abs(startPoint.current.y - coords.y);
      const locker: LockerType = {
        // TODO IDはAPI側で自動生成して上書きされる
        id: String(Date.now()) + Math.random().toString(36).slice(2, 7),
        lockerName: targetLockerName,
        left,
        top,
        width,
        height,
      };

      // 幅・高さが0に近いものは追加しない（DB登録はダイアログで名前確定後に行う）
      if (width > 2 && height > 2) {
        setLockers((prev) => [...prev, locker]);
      }
    }

    // 編集モードがアクティブなら終了（完了後の座標でDBを更新）
    if (editMode.current !== "none" && editRef.current) {
      const deltaX = coords ? coords.x - editRef.current.startMouse.x : 0;
      const deltaY = coords ? coords.y - editRef.current.startMouse.y : 0;
      const before = editRef.current.rectBefore;
      const baseLocker = editRef.current.locker;
      let updatedLocker: LockerType;
      if (editMode.current === "move") {
        updatedLocker = {
          ...baseLocker,
          left: before.left + deltaX,
          top: before.top + deltaY,
        };
      } else {
        updatedLocker = {
          ...baseLocker,
          width: Math.max(4, before.width + deltaX),
          height: Math.max(4, before.height + deltaY),
        };
      }
      useUpdateLocker(updatedLocker);
      editMode.current = "none";
      editRef.current = null;
    }

    startPoint.current = null;
    setSelectionVisible(false);
    setCurrentPoint(null);
    e.preventDefault();
    e.stopPropagation();
  };

  /**
   * ロッカー矩形のマウスダウンハンドラ（移動開始）
   *
   * @param e React.MouseEvent
   * @param r ロッカー情報
   * @returns
   */
  const handleRectMouseDown = (
    e: React.MouseEvent,
    r: {
      id: string;
      lockerName: string;
      left: number;
      top: number;
      width: number;
      height: number;
    },
  ) => {
    // 左ボタンのみ
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    setSelectedId(r.id);

    const locker: LockerType = {
      id: r.id,
      lockerName: r.lockerName,
      left: r.left,
      top: r.top,
      width: r.width,
      height: r.height,
    };

    editMode.current = "move";
    editRef.current = {
      startMouse: getRelativeCoordsFromClient(e.clientX, e.clientY)!,
      rectBefore: locker,
      locker,
    };
  };

  /**
   * リサイズハンドラ（右下ハンドル）
   *
   * @param e React.MouseEvent
   * @param r ロッカー情報
   * @returns
   */
  const handleResizeMouseDown = (
    e: React.MouseEvent,
    r: {
      id: string;
      lockerName: string;
      left: number;
      top: number;
      width: number;
      height: number;
    },
  ) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    setSelectedId(r.id);

    const locker: LockerType = {
      id: r.id,
      lockerName: r.lockerName,
      left: r.left,
      top: r.top,
      width: r.width,
      height: r.height,
    };

    editMode.current = "resize";
    editRef.current = {
      startMouse: getRelativeCoordsFromClient(e.clientX, e.clientY)!,
      rectBefore: locker,
      locker,
    };
  };

  /**
   * 選択ロッカーのスタイルを計算
   *
   * @returns React.CSSProperties
   */
  const calcSelectionStyle = () => {
    const s = startPoint.current;
    const c = currentPoint;
    if (!s || !c) return { display: "none" } as React.CSSProperties;
    const left = Math.min(s.x, c.x);
    const top = Math.min(s.y, c.y);
    const width = Math.abs(s.x - c.x);
    const height = Math.abs(s.y - c.y);
    return {
      position: "absolute",
      left,
      top,
      width,
      height,
      border: "2px solid rgba(0,120,212,0.9)",
      backgroundColor: "rgba(0,120,212,0.15)",
      pointerEvents: "none",
    } as React.CSSProperties;
  };

  /**
   * ドキュメント全体のクリック監視（外部クリックで選択解除）
   *
   * @returns
   */
  React.useEffect(() => {
    const onDocDown = (ev: MouseEvent) => {
      const root = rootRef.current;
      if (!root) return;
      const target = ev.target as Node | null;
      if (!target) return;
      if (!root.contains(target)) {
        setSelectedId(null);
      }
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, []);

  /** カスタムフックからAPIを呼び出してデータを取得 */
  React.useEffect(() => {
    const fetchData = async () => {
      const lockers = await useGetLockers();
      setLockers(lockers);
    };
    fetchData();
  }, []);

  return (
    <Box ref={rootRef} sx={{ display: "flex", width: "100%", gap: 2 }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
      <TransformWrapper
        onTransformed={(ref) => {
          // ズーム・パン状態を保存
          transformStateRef.current = {
            scale: ref.state.scale,
            positionX: ref.state.positionX,
            positionY: ref.state.positionY,
          };
        }}
      >
        <TransformComponent>
          <Paper
            elevation={1}
            sx={{
              position: "relative",
              width: "100%",
              height: "60%",
              userSelect: "none",
              overflow: "hidden",
              p: 0,
            }}
            // ロッカーの作成/移動などの動作が他のマウス操作に妨害されないようにする
            onMouseDown={(e) => {
              e.stopPropagation();
              handleMouseDown(e as unknown as React.MouseEvent);
            }}
            onMouseMove={(e) => {
              e.stopPropagation();
              handleMouseMove(e as unknown as React.MouseEvent);
            }}
            onMouseUp={(e) => {
              e.stopPropagation();
              handleMouseUp(e as unknown as React.MouseEvent);
            }}
          >
            {/** フロアマップの表示 */}
            <img
              ref={imgRef}
              src="./ei3F.png" // TODO フロアマップを変更できるような仕組みが欲しい
              alt="Floor Map"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
              draggable={false}
            />

            {/** ロッカー名登録ダイアログ */}
            <LockerNameRegisterDialog
              lockers={lockers}
              setLockers={setLockers}
              targetLockerName={targetLockerName}
              setTargetLockerName={setTargetLockerName}
            />

            {/** ロッカー名変更ダイアログ */}
            <AppDialog
              open={renamingLocker !== null}
              onClose={() => setRenamingLocker(null)}
              onCancel={() => setRenamingLocker(null)}
              onSubmit={handleRenameSubmit}
              title="ロッカー名を変更"
              content={
                <TextField
                  autoFocus
                  label="名前"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleRenameSubmit(); }}
                  fullWidth
                  size="small"
                  sx={{ mt: 1 }}
                />
              }
              cancelText="キャンセル"
              submitText="変更"
            />

            {/** 選択範囲の表示 */}
            {selectionVisible && startPoint.current && currentPoint && (
              <div style={calcSelectionStyle()} />
            )}

            {/* 保存済みロッカーの描画 */}
            {lockers.map((r) => {
              const isSelected = selectedId === r.id;
              return (
                <div
                  key={r.id}
                  onMouseDown={(e) => handleRectMouseDown(e, r)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setRenamingLocker(r);
                    setRenameValue(r.lockerName);
                  }}
                  style={{
                    position: "absolute",
                    left: r.left,
                    top: r.top,
                    width: r.width,
                    height: r.height,
                    border: isSelected
                      ? "2px solid rgba(255,120,0,0.95)"
                      : "2px dashed rgba(255,120,0,0.95)",
                    backgroundColor: isSelected
                      ? "rgba(255,120,0,0.12)"
                      : "rgba(255,120,0,0.08)",
                    cursor: isSelected ? "move" : "pointer",
                    boxSizing: "border-box",
                    zIndex: isSelected ? 5 : 3,
                  }}
                >
                  {/* 右下のリサイズハンドル */}
                  {isSelected && (
                    <div
                      onMouseDown={(e) => handleResizeMouseDown(e, r)}
                      style={{
                        position: "absolute",
                        width: 12,
                        height: 12,
                        right: -6,
                        bottom: -6,
                        background: "white",
                        border: "2px solid rgba(255,120,0,0.95)",
                        cursor: "nwse-resize",
                        zIndex: 20,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </Paper>
        </TransformComponent>
      </TransformWrapper>
      </Box>

      {/* 右サイドバー: ロッカーリスト */}
      <LockerList
        lockers={lockers}
        setLockers={setLockers}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />
    </Box>
  );
};
