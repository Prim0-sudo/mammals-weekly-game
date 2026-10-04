import "./check.mjs";
import { cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, dirname, relative } from "node:path";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "dist");
if (relative(root, output) !== "dist") throw Error("Unsafe output directory");
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of ["index.html", "src", "assets"])
  await cp(resolve(root, file), resolve(output, file), { recursive: true });
console.log("Built current source into dist.");
