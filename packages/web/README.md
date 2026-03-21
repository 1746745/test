# Azure Blob ストレージへのアップロード

## 概要

npm コマンドでビルドする
ビルドした HTML と js ファイルを Azure ポータルからコンテナに配置する

## コマンド

```cmd
cd packages/web
npm run build
```

## 方法

1. ワーキング用のストレージ：working2025filest を開く
2. $web を開く
   1. $web：静的コンテンツを置く場所
3. packages/api/dist のファイルを手動アップロード
   1. assets/index-XXXXXXX.js
      1. 古いファイルは削除
   2. index.html
      1. 上書きしてアップロードにチェックを付ける
