import * as http from "http";
import * as fs from "fs/promises";
import * as path from "path";
import { existsSync } from "fs";

export const __rootDir = (function getAppRootDir() {
  let currentDir = process.cwd();
  while (!existsSync(path.join(currentDir, "package.json"))) {
    currentDir = path.join(currentDir, "..");
  }
  return currentDir;
})();

let port = process.env["PORT"] || "8080";

const PUBLIC_PATH = path.join(__rootDir, "./public");
const STATIC_PATH = path.join(__rootDir, "./build");

const MIME_TYPES: { [key: string]: string } = {
  html: "text/html; charset=UTF-8",
  js: "application/javascript; charset=UTF-8",
  css: "text/css",
  json: "application/json",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  ico: "image/x-icon",
  svg: "image/svg+xml",
};

const serveFile = async (name: string): Promise<[Buffer | null, string]> => {
  if (name === "/") {
    name = "/index.html";
  }

  const fileExt = path.extname(name).substring(1);
  const mimeType = MIME_TYPES[fileExt] || MIME_TYPES.html;

  if (name.endsWith(".ts")) {
    name.replace(".ts", ".js");
  }

  let filePath: string;
  filePath = path.join(PUBLIC_PATH, name);

  if (!filePath.startsWith(STATIC_PATH) && !filePath.startsWith(PUBLIC_PATH)) {
    console.log(`Can't be served: ${name}`);
    return [null, mimeType];
  }
  try {
    return [await fs.readFile(filePath), mimeType];
  } catch {
    filePath = path.join(STATIC_PATH, name);
  }

  try {
    return [await fs.readFile(filePath), mimeType];
  } catch (e) {
    console.log(`File not found: ${name}. Trying .js`);
    filePath = filePath + ".js";
  }

  try {
    return [await fs.readFile(filePath), MIME_TYPES["js"]];
  } catch (e) {
    console.log(`File not found: ${name}. `, e);
  }

  return [null, mimeType];
};

const server = http.createServer(async (req, res) => {
  const { url } = req;

  if (!url) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
    return;
  }

  const [file, mimeType] = await serveFile(url);
  if (file) {
    res.writeHead(200, { "Content-Type": mimeType });
    res.end(file);
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("404 Not Found");
});
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

server.on("error", (error) => {
  console.log(error);
  if (error.message.includes("EADDRINUSE")) {
    server.close();
    const newPort = parseInt(port) + 1;
    console.log(`Port ${port} is already in use. Trying port ${newPort}`);
    port = newPort.toString();
    server.listen(port);
  }
});
