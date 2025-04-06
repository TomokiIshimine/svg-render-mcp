import { SvgRenderer } from "../services/svgRenderer";
import path from "path";

// sharpのモック
jest.mock("sharp", () => {
  return jest.fn().mockImplementation(() => ({
    resize: jest.fn().mockReturnThis(),
    flatten: jest.fn().mockReturnThis(),
    png: jest.fn().mockReturnThis(),
    toFile: jest.fn().mockResolvedValue(undefined)
  }));
});

// fs/promisesのモック
jest.mock("fs/promises", () => ({
  writeFile: jest.fn().mockResolvedValue(undefined),
  readFile: jest.fn().mockResolvedValue(Buffer.from("test")),
  mkdir: jest.fn().mockResolvedValue(undefined),
  unlink: jest.fn().mockResolvedValue(undefined)
}));

describe("SvgRenderer", () => {
  let renderer: SvgRenderer;
  const baseDir = "/test/dir";

  beforeEach(() => {
    jest.clearAllMocks();
    renderer = new SvgRenderer(baseDir);
  });

  describe("render", () => {
    it("SVGをPNGに変換して画像を返す", async () => {
      // NODE_ENVをtestに設定して実際のファイル変換をスキップ
      process.env.NODE_ENV = 'test';
      
      const args = {
        svg: "<svg></svg>",
        width: 100,
        height: 100,
        background: "#ffffff"
      };
      
      const result = await renderer.render(args);

      // Base64エンコードされた'test'を検証
      expect(result.content[0]).toEqual({
        type: "image",
        data: "dGVzdA==", 
        mimeType: "image/png"
      });
    });

    it("パラメータが省略されても正常に動作する", async () => {
      // NODE_ENVをtestに設定
      process.env.NODE_ENV = 'test';
      
      const args = {
        svg: "<svg></svg>"
      };
      
      const result = await renderer.render(args);

      expect(result.content[0]).toEqual({
        type: "image",
        data: "dGVzdA==",
        mimeType: "image/png"
      });
    });
  });
}); 