# SVG Render MCP

SVG文字列をPNG画像にレンダリングするMCP（Model Context Protocol）サーバーです。

## 機能

- SVG文字列を入力としてPNG画像を返却
- 画像サイズの変更
- 背景色の指定

## インストール方法

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/svg-render-mcp.git
cd svg-render-mcp

# 依存関係をインストール
npm install

# プロジェクトをビルド
npm run build
```

## 使用方法

### 直接起動

```bash
npm start
```

または

```bash
node build/index.js
```

### Claude Desktop で使用する場合

Claude Desktopの設定ファイル（`claude_desktop_config.json`）を編集します:

```json
{
  "mcpServers": {
    "svgRender": {
      "command": "node",
      "args": ["パス/to/svg-render-mcp/build/index.js"]
    }
  }
}
```

### クライアントからのリクエスト例

```json
{
  "type": "toolRequest",
  "data": {
    "name": "renderSvg",
    "params": {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"200\"><rect width=\"100%\" height=\"100%\" fill=\"#f0f0f0\" /><circle cx=\"100\" cy=\"100\" r=\"80\" stroke=\"blue\" stroke-width=\"4\" fill=\"yellow\" /><text x=\"100\" y=\"125\" font-size=\"30\" text-anchor=\"middle\" fill=\"black\">SVG</text></svg>",
      "width": 400,
      "height": 400,
      "background": "#ffffff"
    }
  }
}
```

## パラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|--------|------|
| svg | string | はい | SVG形式の文字列 |
| width | number | いいえ | 出力画像の幅 |
| height | number | いいえ | 出力画像の高さ |
| background | string | いいえ | 背景色（例：#ffffff） |

## 開発

```bash
# ビルド
npm run build

# プロジェクトの実行
npm start
```

## 依存パッケージ

- @modelcontextprotocol/sdk - MCP通信用
- sharp - SVG→PNG変換用
- zod - スキーマバリデーション用 