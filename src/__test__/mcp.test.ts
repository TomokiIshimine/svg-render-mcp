import { createMcpServer } from "../server/mcp";

// サービスのモック
jest.mock("../services/svgRenderer", () => {
  return {
    SvgRenderer: jest.fn().mockImplementation(() => ({
      render: jest.fn().mockResolvedValue({
        content: [{
          type: "image",
          data: "test",
          mimeType: "image/png"
        }]
      })
    }))
  };
});

// sdkのモック
jest.mock("@modelcontextprotocol/sdk/server/mcp", () => {
  return {
    McpServer: jest.fn().mockImplementation(() => ({
      tool: jest.fn()
    }))
  };
});

// 必要なモジュールのインポート
const SvgRenderer = require("../services/svgRenderer").SvgRenderer;

describe("MCP Server", () => {
  const baseDir = "/test/dir";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("サーバーを作成し、SvgRendererを初期化する", () => {
    const server = createMcpServer(baseDir);
    
    expect(server).toBeDefined();
    expect(SvgRenderer).toHaveBeenCalledWith(baseDir);
  });
}); 