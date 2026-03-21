# AzureFunctions へのアップロード方法

## 概要

- npm コマンドでビルドする
- ビルドした js ファイルを関数アプリにデプロイ（アップロード）する

## コマンド

```cmd
cd packages/api
npm run build
func azure functionapp publish Working-2025-func
```

または

## タスク

TASK EXPLORER > PortalApp > vscode > api: build+deploy を実行
