import path from "path";
import fs from "fs/promises";
import { createTempDir, generateTempFilePaths, cleanupTempFiles } from "../utils/fileUtils";

// fsモックのセットアップ
jest.mock("fs/promises", () => ({
  mkdir: jest.fn().mockResolvedValue(undefined),
  unlink: jest.fn().mockResolvedValue(undefined)
}));

describe("FileUtils", () => {
  const baseDir = "/test/dir";
  const tmpDir = path.resolve(baseDir, "..", "tmp");
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe("createTempDir", () => {
    it("ベースディレクトリの上の階層に一時ディレクトリを作成する", async () => {
      const result = await createTempDir(baseDir);
      
      expect(result).toBe(tmpDir);
      expect(fs.mkdir).toHaveBeenCalledWith(tmpDir, { recursive: true });
    });
  });
  
  describe("generateTempFilePaths", () => {
    it("一時ディレクトリ内に一意のファイルパスを生成する", () => {
      const { svgPath, pngPath } = generateTempFilePaths(tmpDir);
      
      expect(svgPath).toContain(tmpDir);
      expect(pngPath).toContain(tmpDir);
      expect(svgPath).toMatch(/\.svg$/);
      expect(pngPath).toMatch(/\.png$/);
    });
  });
  
  describe("cleanupTempFiles", () => {
    it("一時ファイルを削除する", async () => {
      const svgPath = path.join(tmpDir, "test.svg");
      const pngPath = path.join(tmpDir, "test.png");
      
      await cleanupTempFiles(svgPath, pngPath);
      
      expect(fs.unlink).toHaveBeenCalledTimes(2);
      expect(fs.unlink).toHaveBeenCalledWith(svgPath);
      expect(fs.unlink).toHaveBeenCalledWith(pngPath);
    });
  });
}); 