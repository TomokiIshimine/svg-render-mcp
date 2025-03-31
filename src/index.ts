import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create an MCP server instance for rendering SVG to PNG images
const server = new McpServer({
  name: "SVG Renderer",
  version: "1.0.0",
  description: "A service that renders SVG content to PNG images with customizable dimensions and background color."
});

// Add a tool to render SVG content to PNG images with customizable settings
server.tool(
  "renderSvg",
  {
    svg: z.string().describe("SVG string content to render (SVG文字列)"),
    width: z.number().optional().describe("Output image width in pixels (出力画像の幅)"),
    height: z.number().optional().describe("Output image height in pixels (出力画像の高さ)"),
    background: z.string().optional().describe("Background color, e.g. #ffffff (背景色)")
  },
  async (args, _extra) => {
    try {
      const { svg, width, height, background } = args;
      
      // Create a directory for temporary files
      const tmpDir = path.resolve(__dirname, "..", "tmp");
      
      // Create the directory if it doesn't exist
      try {
        await fs.mkdir(tmpDir, { recursive: true });
      } catch (err) {
        // Ignore if directory already exists
      }
      
      // Generate unique filenames
      const id = randomUUID();
      const svgPath = path.join(tmpDir, `${id}.svg`);
      const pngPath = path.join(tmpDir, `${id}.png`);
      
      // Write SVG content to file
      await fs.writeFile(svgPath, svg);
      
      // Convert SVG to PNG
      const pipeline = sharp(svgPath);
      
      // Apply resize options if both width and height are specified
      if (width && height) {
        pipeline.resize(width, height);
      }
      
      // Apply background color if specified
      if (background) {
        pipeline.flatten({ background });
      }
      
      // Save as PNG
      await pipeline.png().toFile(pngPath);
      
      // Read PNG as Base64
      const imageBuffer = await fs.readFile(pngPath);
      const base64Image = imageBuffer.toString("base64");
      
      // Clean up temporary files
      await fs.unlink(svgPath).catch(() => {});
      await fs.unlink(pngPath).catch(() => {});
      
      // Return the image as Base64
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
      console.error("SVG rendering error:", err);
      // Return error message if rendering fails
      return {
        content: [{ 
          type: "text", 
          text: `Error occurred: ${err instanceof Error ? err.message : String(err)}` 
        }]
      };
    }
  }
);

// Connect to standard I/O for message exchange
const transport = new StdioServerTransport();
await server.connect(transport);
