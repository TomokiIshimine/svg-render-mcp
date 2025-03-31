import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

// 現在のディレクトリを取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MCPサーバーのインスタンスを作成
const server = new McpServer({
  name: "SVG Renderer",
  version: "1.0.0"
});

// SVGをレンダリングするツールを追加
server.tool(
  "renderSvg",
  {
    svg: z.string().describe("SVG文字列"),
    width: z.number().optional().describe("出力画像の幅"),
    height: z.number().optional().describe("出力画像の高さ"),
    background: z.string().optional().describe("背景色（例：#ffffff）")
  },
  async (args, _extra) => {
    try {
      const { svg, width, height, background } = args;
      
      // 一時ファイルの場所を作成
      const tmpDir = path.resolve(__dirname, "..", "tmp");
      
      // ディレクトリが存在しなければ作成
      try {
        await fs.mkdir(tmpDir, { recursive: true });
      } catch (err) {
        // ディレクトリが既に存在する場合は無視
      }
      
      // 一意のファイル名を生成
      const id = randomUUID();
      const svgPath = path.join(tmpDir, `${id}.svg`);
      const pngPath = path.join(tmpDir, `${id}.png`);
      
      // SVGファイルを書き込み
      await fs.writeFile(svgPath, svg);
      
      // SVGをPNGに変換
      const pipeline = sharp(svgPath);
      
      // リサイズオプションを設定
      if (width && height) {
        pipeline.resize(width, height);
      }
      
      // 背景色を設定
      if (background) {
        pipeline.flatten({ background });
      }
      
      // PNGとして保存
      await pipeline.png().toFile(pngPath);
      
      // PNGをBase64として読み込み
      const imageBuffer = await fs.readFile(pngPath);
      const base64Image = imageBuffer.toString("base64");
      
      // 一時ファイルを削除
      await fs.unlink(svgPath).catch(() => {});
      await fs.unlink(pngPath).catch(() => {});
      
      // 画像をBase64で返す
      return {
        content: [
          {
            type: "image",
            data: base64Image,
            mimeType: "image/png"
          }
        ]
      };
    } catch (err) {
      console.error("SVGレンダリングエラー:", err);
      return {
        content: [{ 
          type: "text", 
          text: `エラーが発生しました: ${err instanceof Error ? err.message : String(err)}` 
        }]
      };
    }
  }
);

// 標準入出力を通じてメッセージを受信・送信
const transport = new StdioServerTransport();
await server.connect(transport);
