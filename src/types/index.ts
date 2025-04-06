import { z } from "zod";

export const RenderSvgArgs = z.object({
  svg: z.string().describe("SVG string content to render."),
  width: z.number().optional().describe("Output image width in pixels."),
  height: z.number().optional().describe("Output image height in pixels."),
  background: z.string().optional().describe("Background color, e.g. #ffffff.")
});

export type RenderSvgArgs = z.infer<typeof RenderSvgArgs>; 