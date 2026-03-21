import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * タブ項目タイプ
 */
export type TabItem = { label: string; path: string };

/** デフォルトのタブ項目 */
export const defaultTabs: TabItem[] = [
  { label: "FloorMap", path: "/" },
  { label: "Equipment", path: "/equipment" },
];

/**
 * トップタブコンポーネント
 * @param props.tabs タブ項目の配列
 * @returns トップタブコンポーネント
 */
export const TopTabs: React.FC<{ tabs?: TabItem[] }> = ({
  tabs = defaultTabs,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab = tabs.findIndex((t) => t.path === location.pathname);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    const p = tabs[newValue]?.path;
    if (p) navigate(p);
  };

  return (
    <Tabs value={currentTab === -1 ? 0 : currentTab} onChange={handleTabChange}>
      {tabs.map((t) => (
        <Tab key={t.path} label={t.label} />
      ))}
    </Tabs>
  );
};

export default TopTabs;
