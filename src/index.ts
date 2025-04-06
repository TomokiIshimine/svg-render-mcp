import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createMcpServer } from "./server/mcp.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = createMcpServer(__dirname);
const transport = new StdioServerTransport();
await server.connect(transport);
