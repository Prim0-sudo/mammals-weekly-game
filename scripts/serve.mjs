import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, dirname, extname, relative, isAbsolute } from "node:path";
const root = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  process.argv.includes("--dist") ? "dist" : ".",
);
const port = Number(process.env.PORT || 4186);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".json": "application/json",
  ".md": "text/plain; charset=utf-8",
};
createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    const file = resolve(
      root,
      "." + path + (path.endsWith("/") ? "index.html" : ""),
    );
    const rel = relative(root, file);
    if (
      rel.startsWith("..") ||
      isAbsolute(rel) ||
      rel.split(/[\\/]/).some((x) => x.startsWith("."))
    ) {
      res.writeHead(403).end();
      return;
    }
    if (!(await stat(file)).isFile()) throw Error("Not a file");
    res
      .writeHead(200, {
        "Content-Type": types[extname(file)] || "application/octet-stream",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      })
      .end(await readFile(file));
  } catch {
    res.writeHead(404).end("Not found");
  }
}).listen(port, "127.0.0.1", () =>
  console.log(`Mammal Discovery Club: http://127.0.0.1:${port}/ (${root})`),
);
